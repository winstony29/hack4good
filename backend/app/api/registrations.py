from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.auth import get_current_user
from app.core.deps import get_db
from app.models.registration import (
    RegistrationCreate, 
    RegistrationResponse, 
    RegistrationWithActivity
)

router = APIRouter()


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
    # TODO: Implement registration logic
    # 1. Check activity exists and has capacity
    # 2. Check for existing registration
    # 3. Validate membership limits (call registration_service)
    # 4. Check time conflicts
    # 5. Create registration
    # 6. Increment activity participant count
    # 7. Trigger notification
    raise HTTPException(status_code=501, detail="Not implemented")


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
    # TODO: Check authorization (user can only see own registrations)
    # Fetch registrations with activity details
    # Return list
    return []


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
    # TODO: Fetch registrations for activity
    return []


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
    # TODO: Fetch registration
    # Check user owns it
    # Update status
    # Decrement count
    # Notify user
    pass
