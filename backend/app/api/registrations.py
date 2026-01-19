from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
import logging

from app.core.auth import get_current_user
from app.core.deps import get_db
from app.core.enums import RegistrationStatus, Role
from app.models.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationWithActivity
)
from app.db.models import Registration, Activity
from app.services.registration_service import RegistrationService, ConflictError
from app.services.activity_service import ActivityService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_for_activity(
    registration: RegistrationCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register current user for an activity

    Validates:
    - Activity exists and is not full
    - User hasn't already registered
    - No time conflicts with other registrations
    - Membership limits not exceeded (for participants)

    Returns 409 Conflict if validation fails
    """
    user_id = UUID(current_user.id)

    # Run all validations via service
    reg_service = RegistrationService(db)
    try:
        reg_service.validate_all(user_id, registration.activity_id)
    except ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))

    # Create registration
    db_registration = Registration(
        user_id=user_id,
        activity_id=registration.activity_id,
        status=RegistrationStatus.CONFIRMED
    )
    db.add(db_registration)

    # Increment participant count
    activity_service = ActivityService(db)
    activity_service.increment_participants(registration.activity_id)

    db.commit()
    db.refresh(db_registration)

    # Send notification (non-blocking, don't fail registration if notification fails)
    try:
        from app.services.notification_service import NotificationService
        notification_service = NotificationService(db)
        await notification_service.send_registration_confirmation(
            user_id=user_id,
            activity_id=registration.activity_id
        )
    except Exception as e:
        logger.warning(f"Failed to send registration notification: {e}")

    return db_registration


@router.get("/user/{user_id}", response_model=List[RegistrationWithActivity])
async def get_user_registrations(
    user_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all registrations for a specific user

    Users can only view their own registrations unless they are staff
    """
    # Authorization: own registrations or staff
    user_role = current_user.user_metadata.get('role')
    if current_user.id != str(user_id) and user_role != Role.STAFF.value:
        raise HTTPException(status_code=403, detail="Not authorized to view these registrations")

    registrations = db.query(Registration).filter(
        Registration.user_id == user_id
    ).options(
        joinedload(Registration.activity)
    ).order_by(Registration.created_at.desc()).all()

    return registrations


@router.get("/activity/{activity_id}", response_model=List[RegistrationResponse])
async def get_activity_registrations(
    activity_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all registrations for a specific activity

    Returns list of users registered for the activity
    """
    # Verify activity exists
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    registrations = db.query(Registration).filter(
        Registration.activity_id == activity_id,
        Registration.status == RegistrationStatus.CONFIRMED
    ).all()

    return registrations


@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_registration(
    registration_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a registration

    - Updates status to 'cancelled'
    - Decrements activity participant count
    - Sends cancellation notification
    """
    # Fetch registration
    registration = db.query(Registration).filter(
        Registration.id == registration_id
    ).first()

    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")

    # Verify ownership (users can only cancel their own, staff can cancel any)
    user_role = current_user.user_metadata.get('role')
    if str(registration.user_id) != current_user.id and user_role != Role.STAFF.value:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this registration")

    # Check if already cancelled
    if registration.status == RegistrationStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Registration already cancelled")

    # Store for notification before committing
    activity_id = registration.activity_id
    user_id = registration.user_id

    # Update status
    registration.status = RegistrationStatus.CANCELLED

    # Decrement participant count
    activity_service = ActivityService(db)
    activity_service.decrement_participants(activity_id)

    db.commit()

    # Send cancellation notification (non-blocking)
    try:
        from app.services.notification_service import NotificationService
        notification_service = NotificationService(db)
        await notification_service.send_cancellation_notification(
            user_id=user_id,
            activity_id=activity_id
        )
    except Exception as e:
        logger.warning(f"Failed to send cancellation notification: {e}")

    return None
