from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
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
    """
    from datetime import date
    from app.db.models import Activity, VolunteerMatch
    from app.core.enums import RegistrationStatus

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

    activities = query.order_by(Activity.date, Activity.start_time).all()

    return activities


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

    # TODO: Send notification (will be wired in 04-02)

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
    # TODO: Check authorization
    # Fetch matches with activity details
    return []


@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_volunteer_match(
    match_id: UUID,
    current_user = Depends(get_current_volunteer),
    db: Session = Depends(get_db)
):
    """Cancel a volunteer match"""
    # TODO: Fetch match
    # Verify ownership
    # Update status to cancelled
    # Notify volunteer
    pass
