from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from uuid import UUID

from app.core.auth import get_current_user, get_current_staff
from app.core.deps import get_db
from app.models.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse

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
    # TODO: Implement activity fetching logic with filters
    # Query activities from database
    # Apply filters if provided
    # Return paginated results
    return ActivityListResponse(activities=[], total=0)


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: UUID,
    db: Session = Depends(get_db)
):
    """Get single activity by ID"""
    # TODO: Fetch activity from database
    # Return 404 if not found
    raise HTTPException(status_code=404, detail="Activity not found")


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
    # TODO: Validate activity data
    # Create activity in database
    # Return created activity
    raise HTTPException(status_code=501, detail="Not implemented")


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: UUID,
    activity: ActivityUpdate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Update activity (Staff only)"""
    # TODO: Fetch existing activity
    # Update fields
    # Validate constraints
    # Save to database
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: UUID,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """Delete activity (Staff only)"""
    # TODO: Check if activity has registrations
    # If yes, prevent deletion or cascade
    # Delete activity
    pass
