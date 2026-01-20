from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
import logging

from app.core.auth import get_current_user
from app.core.deps import get_db
from app.core.enums import Role, RegistrationStatus
from app.db.models import Registration, Activity, User
from app.models.registration import (
    RegistrationCreate,
    RegistrationResponse,
    RegistrationWithActivity
)
from app.models.activity import ActivityResponse, StaffContactInfo
from app.services.registration_service import RegistrationService, ConflictError
from app.services.activity_service import ActivityService
from app.services.notification_service import NotificationService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/available", response_model=List[ActivityResponse])
async def get_available_activities_for_participant(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get activities available for participant registration (swiper)

    - Excludes activities participant is already registered to
    - Excludes past activities
    - Only shows activities with available spots
    - Filters by wheelchair accessibility if user requires wheelchair
    """
    from datetime import date
    
    # Get IDs of activities participant is already registered to
    registered_activity_ids = db.query(Registration.activity_id).filter(
        Registration.user_id == current_user.id,
        Registration.status != RegistrationStatus.CANCELLED
    ).all()
    registered_ids = [r[0] for r in registered_activity_ids]

    # Query future activities not already registered
    query = db.query(Activity).filter(
        Activity.date >= date.today(),
        Activity.current_participants < Activity.max_capacity  # Only show activities with spots
    )

    if registered_ids:
        query = query.filter(~Activity.id.in_(registered_ids))
    
    # Filter by wheelchair accessibility if user requires wheelchair
    # Access from user_metadata since current_user is a Supabase user object
    wheelchair_required = current_user.user_metadata.get('wheelchair_required', False)
    if wheelchair_required:
        query = query.filter(Activity.wheelchair_accessible == True)

    activities = query.order_by(Activity.date, Activity.start_time).all()

    # Build response with POC info for each activity
    return [_build_activity_response(activity, db) for activity in activities]


def _build_activity_response(activity: Activity, db: Session) -> ActivityResponse:
    """Build ActivityResponse with POC info"""
    response_data = {
        "id": activity.id,
        "title": activity.title,
        "description": activity.description,
        "date": activity.date,
        "start_time": activity.start_time,
        "end_time": activity.end_time,
        "location": activity.location,
        "max_capacity": activity.max_capacity,
        "current_participants": activity.current_participants,
        "program_type": activity.program_type,
        "wheelchair_accessible": activity.wheelchair_accessible,
        "payment_required": activity.payment_required,
        "created_by_staff_id": activity.created_by_staff_id,
        "created_at": activity.created_at,
        "point_of_contact": None,
        "title_zh": getattr(activity, 'title_zh', None),
        "title_ms": getattr(activity, 'title_ms', None),
        "title_ta": getattr(activity, 'title_ta', None),
        "description_zh": getattr(activity, 'description_zh', None),
        "description_ms": getattr(activity, 'description_ms', None),
        "description_ta": getattr(activity, 'description_ta', None),
    }
    
    if activity.created_by_staff_id:
        staff = db.query(User).filter(User.id == activity.created_by_staff_id).first()
        if staff:
            response_data["point_of_contact"] = StaffContactInfo(
                id=staff.id,
                full_name=staff.full_name,
                email=staff.email,
                phone=staff.phone
            )
    
    return ActivityResponse(**response_data)


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
    # Check activity exists
    activity = db.query(Activity).filter(Activity.id == registration.activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Run all validations
    service = RegistrationService(db)
    try:
        service.validate_all(current_user.id, registration.activity_id)
    except ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
    # Create registration
    db_registration = Registration(
        user_id=current_user.id,
        activity_id=registration.activity_id,
        status=RegistrationStatus.CONFIRMED
    )
    db.add(db_registration)
    
    # Increment participant count using service
    activity_service = ActivityService(db)
    activity_service.increment_participants(registration.activity_id)
    
    db.commit()
    db.refresh(db_registration)
    
    # Send notification (don't block on failure)
    try:
        notification_service = NotificationService(db)
        await notification_service.send_registration_confirmation(
            user_id=current_user.id,
            activity_id=registration.activity_id
        )
    except Exception as e:
        logger.warning(f"Failed to send registration notification: {e}")
    
    return db_registration


@router.get("", response_model=List[RegistrationWithActivity])
async def get_my_registrations(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all registrations for the current user
    """
    registrations = (
        db.query(Registration)
        .filter(Registration.user_id == current_user.id)
        .options(joinedload(Registration.activity))
        .order_by(Registration.created_at.desc())
        .all()
    )
    
    # Build response with activity details
    result = []
    for reg in registrations:
        result.append(RegistrationWithActivity(
            id=reg.id,
            user_id=reg.user_id,
            activity=_build_activity_response(reg.activity, db),
            status=reg.status,
            created_at=reg.created_at
        ))
    
    return result


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
    # Get user role from Supabase user metadata
    user_role = current_user.user_metadata.get('role')
    
    # Authorization check - compare as strings since current_user.id is a string UUID
    if str(current_user.id) != str(user_id) and user_role != Role.STAFF.value:
        raise HTTPException(status_code=403, detail="Not authorized to view these registrations")
    
    registrations = (
        db.query(Registration)
        .filter(Registration.user_id == user_id)
        .options(joinedload(Registration.activity))
        .order_by(Registration.created_at.desc())
        .all()
    )
    
    # Build response with activity details
    result = []
    for reg in registrations:
        result.append(RegistrationWithActivity(
            id=reg.id,
            user_id=reg.user_id,
            activity=_build_activity_response(reg.activity, db),
            status=reg.status,
            created_at=reg.created_at
        ))
    
    return result


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
    registration = db.query(Registration).filter(Registration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    # Get user role from Supabase user metadata
    user_role = current_user.user_metadata.get('role')
    
    # Check user owns it (or is staff) - compare as strings
    if str(registration.user_id) != str(current_user.id) and user_role != Role.STAFF.value:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this registration")
    
    # Check if already cancelled
    if registration.status == RegistrationStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Registration already cancelled")
    
    # Store for notification before committing
    activity_id = registration.activity_id
    
    # Update status
    registration.status = RegistrationStatus.CANCELLED
    
    # Decrement participant count using service
    activity_service = ActivityService(db)
    activity_service.decrement_participants(activity_id)
    
    db.commit()
    
    # Send notification (don't block on failure)
    try:
        notification_service = NotificationService(db)
        await notification_service.send_cancellation_notification(
            user_id=current_user.id,
            activity_id=activity_id
        )
    except Exception as e:
        logger.warning(f"Failed to send cancellation notification: {e}")
    
    return None
