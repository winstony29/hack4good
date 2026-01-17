from sqlalchemy.orm import Session
from datetime import date, timedelta, time as dt_time
from uuid import UUID
from typing import List

from app.db.models import Registration, Activity, User
from app.core.enums import MembershipType, RegistrationStatus


class ConflictError(Exception):
    """Custom exception for registration conflicts"""
    pass


class RegistrationService:
    """
    Service for registration validation and operations
    
    Used by both participants and volunteers for registration logic
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def validate_membership_limit(self, user_id: UUID, activity_date: date) -> None:
        """
        Check if user has exceeded their weekly registration limit
        
        Raises ConflictError if limit exceeded
        """
        # Get user
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.membership_type:
            return  # No limit for users without membership type
        
        # Calculate week boundaries (Monday to Sunday)
        week_start = activity_date - timedelta(days=activity_date.weekday())
        week_end = week_start + timedelta(days=6)
        
        # Count registrations in the same week
        registration_count = (
            self.db.query(Registration)
            .join(Activity)
            .filter(
                Registration.user_id == user_id,
                Registration.status == RegistrationStatus.CONFIRMED,
                Activity.date >= week_start,
                Activity.date <= week_end
            )
            .count()
        )
        
        # Check limits based on membership type
        limits = {
            MembershipType.ONCE_WEEKLY: 1,
            MembershipType.TWICE_WEEKLY: 2,
            MembershipType.THREE_PLUS: 3
        }
        
        max_registrations = limits.get(user.membership_type)
        if max_registrations and registration_count >= max_registrations:
            raise ConflictError(
                f"Weekly registration limit exceeded. Your {user.membership_type.value} "
                f"membership allows {max_registrations} activities per week."
            )
    
    def check_time_conflict(self, user_id: UUID, activity_id: UUID) -> None:
        """
        Check if user has time conflict with existing registrations
        
        Raises ConflictError if conflict detected
        """
        # Get the activity we're trying to register for
        new_activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
        if not new_activity:
            raise ConflictError("Activity not found")
        
        # Get all confirmed registrations for user on same date
        existing_registrations = (
            self.db.query(Registration)
            .join(Activity)
            .filter(
                Registration.user_id == user_id,
                Registration.status == RegistrationStatus.CONFIRMED,
                Activity.date == new_activity.date
            )
            .all()
        )
        
        # Check for time overlaps
        for reg in existing_registrations:
            existing_activity = reg.activity
            
            if self._time_overlaps(
                new_activity.start_time, new_activity.end_time,
                existing_activity.start_time, existing_activity.end_time
            ):
                raise ConflictError(
                    f"Time conflict detected with activity: {existing_activity.title} "
                    f"({existing_activity.start_time} - {existing_activity.end_time})"
                )
    
    def _time_overlaps(
        self,
        start1: dt_time, end1: dt_time,
        start2: dt_time, end2: dt_time
    ) -> bool:
        """Check if two time ranges overlap"""
        return start1 < end2 and start2 < end1
    
    def check_existing_registration(self, user_id: UUID, activity_id: UUID) -> None:
        """
        Check if user already registered for activity
        
        Raises ConflictError if already registered
        """
        existing = (
            self.db.query(Registration)
            .filter(
                Registration.user_id == user_id,
                Registration.activity_id == activity_id,
                Registration.status == RegistrationStatus.CONFIRMED
            )
            .first()
        )
        
        if existing:
            raise ConflictError("You are already registered for this activity")
    
    def check_activity_capacity(self, activity_id: UUID) -> None:
        """
        Check if activity has available capacity
        
        Raises ConflictError if full
        """
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
        if not activity:
            raise ConflictError("Activity not found")
        
        if activity.current_participants >= activity.max_capacity:
            raise ConflictError("Activity is full. No spots available.")
    
    def validate_all(self, user_id: UUID, activity_id: UUID) -> None:
        """
        Run all validations for registration
        
        Raises ConflictError if any validation fails
        """
        activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
        if not activity:
            raise ConflictError("Activity not found")
        
        # Run all validation checks
        self.check_activity_capacity(activity_id)
        self.check_existing_registration(user_id, activity_id)
        self.check_time_conflict(user_id, activity_id)
        self.validate_membership_limit(user_id, activity.date)
