from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.enums import Role, MembershipType, Language
from app.models.base import BaseSchema


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Role
    membership_type: Optional[MembershipType] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    caregiver_phone: Optional[str] = None
    preferred_language: Language = Language.ENGLISH
    wheelchair_required: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseSchema):
    id: UUID
    email: EmailStr
    role: Role
    membership_type: Optional[MembershipType] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: str
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    caregiver_phone: Optional[str] = None
    preferred_language: Optional[Language] = None
    membership_type: Optional[MembershipType] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
