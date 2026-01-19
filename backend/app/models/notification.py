from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class NotificationCreate(BaseModel):
    user_id: UUID
    message: str
    channel: str  # 'sms' or 'whatsapp'


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    message: str
    channel: str
    status: str
    sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BulkNotificationCreate(BaseModel):
    user_ids: list[UUID]
    message: str
    channel: str = 'sms'


class BulkNotificationResponse(BaseModel):
    total: int
    successful: int
    failed: int
    message: str
