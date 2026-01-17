from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.auth import get_current_user, get_current_staff
from app.core.deps import get_db
from app.models.notification import (
    NotificationCreate,
    NotificationResponse,
    BulkNotificationCreate
)

router = APIRouter()


@router.post("/send", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def send_notification(
    notification: NotificationCreate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Send notification to a user (Staff only)
    
    - **channel**: 'sms' or 'whatsapp'
    - **message**: Notification text
    """
    # TODO: Fetch user details
    # Send via Twilio (SMS or WhatsApp)
    # Log notification
    # Return status
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/send-bulk", status_code=status.HTTP_202_ACCEPTED)
async def send_bulk_notifications(
    notification: BulkNotificationCreate,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Send notifications to multiple users (Staff only)
    
    Useful for:
    - Activity reminders
    - Announcements
    - Emergency notifications
    """
    # TODO: Queue notifications for each user
    # Send asynchronously
    # Return acceptance status
    return {"message": f"Queued {len(notification.user_ids)} notifications"}


@router.get("/user/{user_id}", response_model=List[NotificationResponse])
async def get_user_notifications(
    user_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get notification history for a user
    
    Users can only see their own notifications
    """
    # TODO: Check authorization
    # Fetch notification log
    return []
