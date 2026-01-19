from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
import logging

from app.db.models import User, Activity
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
