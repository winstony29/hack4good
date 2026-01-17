from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, time, datetime
from uuid import UUID

from app.models.base import BaseSchema


class ActivityCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    date: date
    start_time: time
    end_time: time
    location: Optional[str] = None
    max_capacity: int = Field(..., gt=0)
    program_type: Optional[str] = None


class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    max_capacity: Optional[int] = Field(None, gt=0)
    program_type: Optional[str] = None


class ActivityResponse(BaseSchema):
    id: UUID
    title: str
    description: Optional[str]
    date: date
    start_time: time
    end_time: time
    location: Optional[str]
    max_capacity: int
    current_participants: int
    program_type: Optional[str]
    created_at: datetime
    
    @property
    def is_full(self) -> bool:
        return self.current_participants >= self.max_capacity
    
    @property
    def available_spots(self) -> int:
        return max(0, self.max_capacity - self.current_participants)


class ActivityListResponse(BaseModel):
    activities: list[ActivityResponse]
    total: int
