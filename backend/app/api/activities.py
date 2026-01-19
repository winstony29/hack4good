from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import date, datetime
from uuid import UUID

from app.core.auth import get_current_user, get_current_staff
from app.core.deps import get_db
from app.models.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse, StaffContactInfo
from app.db.models import Activity, User
from app.services.activity_service import ActivityService

router = APIRouter()


def _build_activity_response(activity: Activity, db: Session) -> ActivityResponse:
    """Helper to build ActivityResponse with POC info and translations"""
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
        "created_by_staff_id": activity.created_by_staff_id,
        "created_at": activity.created_at,
        "point_of_contact": None,
        # Include translations
        "title_zh": activity.title_zh,
        "title_ms": activity.title_ms,
        "title_ta": activity.title_ta,
        "description_zh": activity.description_zh,
        "description_ms": activity.description_ms,
        "description_ta": activity.description_ta,
    }
    
    # Fetch POC information if available
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


@router.get("", response_model=ActivityListResponse)
async def get_activities(
    date_filter: Optional[date] = Query(None, description="Filter by specific date"),
    program_type: Optional[str] = Query(None, description="Filter by program type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get list of activities with optional filters

    - **date_filter**: Filter activities by specific date
    - **program_type**: Filter by program type
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    service = ActivityService(db)
    activities = service.get_with_filters(date_filter, program_type, skip, limit)
    
    # Build responses with POC info
    activity_responses = [_build_activity_response(activity, db) for activity in activities]
    
    # Get total count
    query = db.query(Activity)
    if date_filter:
        query = query.filter(Activity.date == date_filter)
    if program_type:
        query = query.filter(Activity.program_type == program_type)
    total = query.count()
    
    return ActivityListResponse(activities=activity_responses, total=total)


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: UUID,
    db: Session = Depends(get_db)
):
    """Get single activity by ID"""
    service = ActivityService(db)
    activity = service.get_by_id(activity_id)
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return _build_activity_response(activity, db)


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity: ActivityCreate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Create a new activity (Staff only)

    Validates:
    - Start time is before end time
    - Date is in the future
    - Max capacity is positive
    """
    # Validate time range
    if activity.start_time >= activity.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )
    
    # Validate date is not in the past
    if activity.date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activity date cannot be in the past"
        )
    
    # Create activity with staff POC and auto-translate
    service = ActivityService(db)
    
    activity_data = {
        "title": activity.title,
        "description": activity.description,
        "date": activity.date,
        "start_time": activity.start_time,
        "end_time": activity.end_time,
        "location": activity.location,
        "max_capacity": activity.max_capacity,
        "program_type": activity.program_type,
        "created_by_staff_id": current_user.id  # Set POC to current staff user
    }
    
    # Create with automatic translations
    created_activity = service.create_with_translations(activity_data)
    return _build_activity_response(created_activity, db)


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: UUID,
    activity: ActivityUpdate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Update activity (Staff only)"""
    service = ActivityService(db)
    db_activity = service.get_by_id(activity_id)
    
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Validate time range if both times provided
    start_time = activity.start_time if activity.start_time else db_activity.start_time
    end_time = activity.end_time if activity.end_time else db_activity.end_time
    
    if start_time >= end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )
    
    # Update fields
    update_data = activity.model_dump(exclude_unset=True)
    
    # Check if title or description changed - need to re-translate
    needs_retranslation = "title" in update_data or "description" in update_data
    
    for field, value in update_data.items():
        setattr(db_activity, field, value)
    
    # Re-translate if content changed
    if needs_retranslation:
        translations = service.translate_activity_content(
            title=db_activity.title,
            description=db_activity.description
        )
        for field, value in translations.items():
            setattr(db_activity, field, value)
    
    updated_activity = service.update(db_activity)
    return _build_activity_response(updated_activity, db)


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: UUID,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Delete activity (Staff only)"""
    service = ActivityService(db)
    activity = service.get_by_id(activity_id)
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Delete activity (registrations and matches will be cascaded)
    service.delete(activity_id)
    return None
