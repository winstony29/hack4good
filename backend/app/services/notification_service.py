from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import logging

from app.db.models import User, Activity, Notification
from app.services.twilio_client import get_twilio_client

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Service for orchestrating notifications via Twilio

    Handles SMS and WhatsApp notifications for:
    - Registration confirmations
    - Volunteer match confirmations
    - Activity reminders
    - Caregiver notifications
    """

    def __init__(self, db: Session):
        self.db = db
        self.twilio = get_twilio_client()

    async def send_notification(
        self,
        user_id: UUID,
        message: str,
        channel: str = 'sms'
    ) -> Notification:
        """
        Send a generic notification to a user and log it to database.

        Args:
            user_id: Target user UUID
            message: Notification text
            channel: 'sms' or 'whatsapp'

        Returns:
            Notification record with status

        Raises:
            ValueError: If user not found or has no phone number
        """
        user = self.db.query(User).filter(User.id == user_id).first()

        if not user:
            raise ValueError(f"User not found: {user_id}")

        phone = user.phone
        if channel == 'whatsapp' and user.caregiver_phone:
            phone = user.caregiver_phone

        if not phone:
            raise ValueError(f"User {user_id} has no phone number for {channel}")

        # Create notification record
        notification = Notification(
            user_id=user_id,
            message=message,
            channel=channel,
            status='pending'
        )
        self.db.add(notification)

        # Send via Twilio
        if channel == 'whatsapp':
            sid = self.twilio.send_whatsapp(phone, message)
        else:
            sid = self.twilio.send_sms(phone, message)

        # Update status
        if sid:
            notification.status = 'sent'
            notification.sent_at = datetime.utcnow()
        else:
            notification.status = 'failed'

        self.db.commit()
        self.db.refresh(notification)

        logger.info(f"Notification {notification.id} {notification.status} to {user_id} via {channel}")
        return notification

    def get_user_notifications(self, user_id: UUID) -> List[Notification]:
        """
        Get all notifications for a user.

        Args:
            user_id: Target user UUID

        Returns:
            List of Notification records ordered by created_at desc
        """
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )

    async def send_registration_confirmation(
        self,
        user_id: UUID,
        activity_id: UUID
    ) -> None:
        """
        Send registration confirmation to participant

        Also notifies caregiver via WhatsApp if phone number provided
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()

        if not user or not activity:
            logger.warning(f"Cannot send confirmation: user={user_id}, activity={activity_id}")
            return

        # Format message
        message = (
            f"Registration Confirmed!\n\n"
            f"Activity: {activity.title}\n"
            f"Date: {activity.date}\n"
            f"Time: {activity.start_time} - {activity.end_time}\n"
            f"Location: {activity.location}"
        )

        # Send SMS to participant
        if user.phone:
            self.twilio.send_sms(user.phone, message)

        # Send WhatsApp to caregiver
        if user.caregiver_phone:
            caregiver_message = f"MINDS Update: {user.full_name or 'Participant'} registered for activity.\n\n{message}"
            self.twilio.send_whatsapp(user.caregiver_phone, caregiver_message)

    async def send_volunteer_match_confirmation(
        self,
        volunteer_id: UUID,
        activity_id: UUID
    ) -> None:
        """Send match confirmation to volunteer"""
        volunteer = self.db.query(User).filter(User.id == volunteer_id).first()
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()

        if not volunteer or not activity:
            logger.warning(f"Cannot send match confirmation: volunteer={volunteer_id}, activity={activity_id}")
            return

        message = (
            f"You're Matched!\n\n"
            f"Activity: {activity.title}\n"
            f"Date: {activity.date}\n"
            f"Time: {activity.start_time} - {activity.end_time}\n"
            f"Location: {activity.location}\n\n"
            f"Thank you for volunteering!"
        )

        if volunteer.phone:
            self.twilio.send_sms(volunteer.phone, message)

    async def send_activity_reminder(
        self,
        user_id: UUID,
        activity_id: UUID,
        hours_before: int = 24
    ) -> None:
        """
        Send activity reminder

        Typically sent 24 hours before activity
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()

        if not user or not activity:
            logger.warning(f"Cannot send reminder: user={user_id}, activity={activity_id}")
            return

        message = (
            f"Reminder: Activity Tomorrow!\n\n"
            f"{activity.title}\n"
            f"Date: {activity.date}\n"
            f"Time: {activity.start_time}\n"
            f"Location: {activity.location}\n\n"
            f"See you there!"
        )

        if user.phone:
            self.twilio.send_sms(user.phone, message)

    async def send_cancellation_notification(
        self,
        user_id: UUID,
        activity_id: UUID
    ) -> None:
        """Send notification when registration is cancelled"""
        user = self.db.query(User).filter(User.id == user_id).first()
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()

        if not user or not activity:
            logger.warning(f"Cannot send cancellation: user={user_id}, activity={activity_id}")
            return

        message = (
            f"Cancellation Confirmed\n\n"
            f"Activity: {activity.title}\n"
            f"Date: {activity.date}\n\n"
            f"You have been removed from this activity."
        )

        if user.phone:
            self.twilio.send_sms(user.phone, message)
