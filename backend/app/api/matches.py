from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID

from app.core.auth import get_current_user, get_current_volunteer
from app.core.deps import get_db
from app.models.registration import (
    VolunteerMatchCreate,
    VolunteerMatchResponse,
    VolunteerMatchWithActivity
)
from app.models.activity import ActivityResponse

router = APIRouter()


@router.get("/available", response_model=List[ActivityResponse])
async def get_available_activities(
    current_user = Depends(get_current_volunteer),
    db: Session = Depends(get_db)
):
    """
    Get activities available for volunteer matching

    - Excludes activities volunteer is already matched to
    - Excludes past activities
    - Only shows activities with available spots
    - Filters by wheelchair accessibility if volunteer requires wheelchair
    """
    from datetime import date
    from app.db.models import Activity, VolunteerMatch, User
    from app.core.enums import RegistrationStatus
    from app.models.activity import StaffContactInfo

    # Get IDs of activities volunteer is already matched to
    matched_activity_ids = db.query(VolunteerMatch.activity_id).filter(
        VolunteerMatch.volunteer_id == current_user.id,
        VolunteerMatch.status != RegistrationStatus.CANCELLED
    ).all()
    matched_ids = [m[0] for m in matched_activity_ids]

    # Query future activities not already matched
    query = db.query(Activity).filter(Activity.date >= date.today())

    if matched_ids:
        query = query.filter(~Activity.id.in_(matched_ids))
    
    # Filter by wheelchair accessibility if volunteer requires wheelchair
    # Access from user_metadata since current_user is a Supabase user object
    wheelchair_required = current_user.user_metadata.get('wheelchair_required', False)
    if wheelchair_required:
        query = query.filter(Activity.wheelchair_accessible == True)

    activities = query.order_by(Activity.date, Activity.start_time).all()

    # Build response with POC info for each activity
    result = []
    for activity in activities:
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
        
        # Add POC info if available
        if activity.created_by_staff_id:
            staff = db.query(User).filter(User.id == activity.created_by_staff_id).first()
            if staff:
                response_data["point_of_contact"] = StaffContactInfo(
                    id=staff.id,
                    full_name=staff.full_name,
                    email=staff.email,
                    phone=staff.phone
                )
        
        result.append(ActivityResponse(**response_data))

    return result


@router.post("", response_model=VolunteerMatchResponse, status_code=status.HTTP_201_CREATED)
async def create_volunteer_match(
    match: VolunteerMatchCreate,
    current_user = Depends(get_current_volunteer),
    db: Session = Depends(get_db)
):
    """
    Match volunteer to an activity (Volunteer "swipes right")

    Similar validation to registration:
    - Check activity exists
    - Check for time conflicts
    - No duplicate matches
    """
    from datetime import date
    from app.db.models import Activity, VolunteerMatch
    from app.core.enums import RegistrationStatus

    # Validate activity exists and is in the future
    activity = db.query(Activity).filter(Activity.id == match.activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    if activity.date < date.today():
        raise HTTPException(status_code=400, detail="Cannot match to past activity")

    # Check for existing active match
    existing = db.query(VolunteerMatch).filter(
        VolunteerMatch.volunteer_id == current_user.id,
        VolunteerMatch.activity_id == match.activity_id,
        VolunteerMatch.status != RegistrationStatus.CANCELLED
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Already matched to this activity")

    # Check for time conflicts with other matched activities
    conflicting = db.query(VolunteerMatch).join(Activity).filter(
        VolunteerMatch.volunteer_id == current_user.id,
        VolunteerMatch.status != RegistrationStatus.CANCELLED,
        Activity.date == activity.date,
        Activity.start_time < activity.end_time,
        Activity.end_time > activity.start_time
    ).first()

    if conflicting:
        raise HTTPException(status_code=409, detail="Time conflict with another matched activity")

    # Create the match
    db_match = VolunteerMatch(
        volunteer_id=current_user.id,
        activity_id=match.activity_id,
        status=RegistrationStatus.CONFIRMED
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)

    # Send notification (runs in background, doesn't block response)
    from app.services.notification_service import NotificationService
    notification_service = NotificationService(db)
    await notification_service.send_volunteer_match_confirmation(
        volunteer_id=current_user.id,
        activity_id=match.activity_id
    )

    return db_match


@router.get("/user/{user_id}", response_model=List[VolunteerMatchWithActivity])
async def get_volunteer_matches(
    user_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all volunteer matches for a user

    Returns activities the volunteer is matched to
    """
    from app.db.models import VolunteerMatch
    from app.core.enums import Role

    # Get user role from Supabase user metadata
    user_role = current_user.user_metadata.get('role')
    
    # Authorization: can view own matches, or staff can view any
    # Compare as strings since current_user.id is a string UUID
    if str(current_user.id) != str(user_id) and user_role != Role.STAFF.value:
        raise HTTPException(status_code=403, detail="Not authorized to view these matches")

    # Fetch matches with activity details (eager load)
    matches = db.query(VolunteerMatch).filter(
        VolunteerMatch.volunteer_id == user_id
    ).options(
        joinedload(VolunteerMatch.activity)
    ).order_by(VolunteerMatch.matched_at.desc()).all()

    return matches


@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_volunteer_match(
    match_id: UUID,
    current_user = Depends(get_current_volunteer),
    db: Session = Depends(get_db)
):
    """Cancel a volunteer match"""
    from app.db.models import VolunteerMatch
    from app.core.enums import RegistrationStatus

    # Fetch the match
    match = db.query(VolunteerMatch).filter(VolunteerMatch.id == match_id).first()

    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # Verify ownership - compare as strings since current_user.id is a string UUID
    if str(match.volunteer_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this match")

    # Check if already cancelled
    if match.status == RegistrationStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Match already cancelled")

    # Update status to cancelled
    activity_id = match.activity_id  # Store before commit
    match.status = RegistrationStatus.CANCELLED
    db.commit()

    # Send cancellation notification
    from app.services.notification_service import NotificationService
    notification_service = NotificationService(db)
    await notification_service.send_cancellation_notification(
        user_id=current_user.id,
        activity_id=activity_id
    )

    return None
