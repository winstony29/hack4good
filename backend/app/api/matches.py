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
    # TODO: Validate activity exists
    # Check for conflicts
    # Create volunteer_match record
    # Send notification
    raise HTTPException(status_code=501, detail="Not implemented")


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
