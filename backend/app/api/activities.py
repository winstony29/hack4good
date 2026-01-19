from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from uuid import UUID

from app.core.auth import get_current_user, get_current_staff
from app.core.deps import get_db
from app.models.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse
from app.services.activity_service import ActivityService

router = APIRouter()


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
    activities = service.get_with_filters(
        date_filter=date_filter,
        program_type=program_type,
        skip=skip,
        limit=limit
    )
    total = service.count()
    return ActivityListResponse(activities=activities, total=total)


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
    return activity


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
    # Validate time order
    if activity.start_time >= activity.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    service = ActivityService(db)
    db_activity = service.create(activity.model_dump())
    return db_activity


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: UUID,
    activity: ActivityUpdate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Update activity (Staff only)"""
    service = ActivityService(db)

    # Check activity exists
    existing = service.get_by_id(activity_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Activity not found")

    # Update with non-None fields only
    update_data = activity.model_dump(exclude_unset=True)

    # Validate time order if both times provided
    start = update_data.get('start_time', existing.start_time)
    end = update_data.get('end_time', existing.end_time)
    if start >= end:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    updated = service.update(activity_id, update_data)
    return updated


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: UUID,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Delete activity (Staff only)"""
    service = ActivityService(db)

    # Check activity exists
    existing = service.get_by_id(activity_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Activity not found")

    service.delete(activity_id)
    return None
