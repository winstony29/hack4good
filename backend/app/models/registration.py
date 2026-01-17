from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.enums import RegistrationStatus
from app.models.base import BaseSchema
from app.models.activity import ActivityResponse


class RegistrationCreate(BaseModel):
    activity_id: UUID


class RegistrationResponse(BaseSchema):
    id: UUID
    user_id: UUID
    activity_id: UUID
    status: RegistrationStatus
    created_at: datetime


class RegistrationWithActivity(BaseSchema):
    id: UUID
    user_id: UUID
    activity: ActivityResponse
    status: RegistrationStatus
    created_at: datetime


class VolunteerMatchCreate(BaseModel):
    activity_id: UUID


class VolunteerMatchResponse(BaseSchema):
    id: UUID
    volunteer_id: UUID
    activity_id: UUID
    status: RegistrationStatus
    matched_at: datetime


class VolunteerMatchWithActivity(BaseSchema):
    id: UUID
    volunteer_id: UUID
    activity: ActivityResponse
    status: RegistrationStatus
    matched_at: datetime
