from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.auth import get_current_user, get_current_staff
from app.core.deps import get_db
from app.models.notification import (
    NotificationCreate,
    NotificationResponse,
    BulkNotificationCreate,
    BulkNotificationResponse
)
from app.services.notification_service import NotificationService

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
    service = NotificationService(db)

    try:
        result = await service.send_notification(
            user_id=notification.user_id,
            message=notification.message,
            channel=notification.channel
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/send-bulk", response_model=BulkNotificationResponse, status_code=status.HTTP_202_ACCEPTED)
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
    service = NotificationService(db)

    successful = 0
    failed = 0

    for user_id in notification.user_ids:
        try:
            await service.send_notification(
                user_id=user_id,
                message=notification.message,
                channel=notification.channel
            )
            successful += 1
        except ValueError:
            failed += 1

    total = len(notification.user_ids)
    return BulkNotificationResponse(
        total=total,
        successful=successful,
        failed=failed,
        message=f"Sent {successful}/{total} notifications ({failed} failed)"
    )


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
