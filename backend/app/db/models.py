from sqlalchemy import Column, String, Integer, DateTime, Date, Time, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.core.enums import Role, MembershipType, RegistrationStatus


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(Role), nullable=False)
    membership_type = Column(SQLEnum(MembershipType), nullable=True)
    preferred_language = Column(String(5), default='en')
    phone = Column(String(20), nullable=True)
    caregiver_phone = Column(String(20), nullable=True)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    registrations = relationship("Registration", back_populates="user")
    volunteer_matches = relationship("VolunteerMatch", back_populates="volunteer")
    notifications = relationship("Notification", back_populates="user")


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    location = Column(String(255))
    max_capacity = Column(Integer, nullable=False)
    current_participants = Column(Integer, default=0)
    program_type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    registrations = relationship("Registration", back_populates="activity")
    volunteer_matches = relationship("VolunteerMatch", back_populates="activity")


class Registration(Base):
    __tablename__ = "registrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(SQLEnum(RegistrationStatus), default=RegistrationStatus.CONFIRMED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="registrations")
    activity = relationship("Activity", back_populates="registrations")


class VolunteerMatch(Base):
    __tablename__ = "volunteer_matches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(SQLEnum(RegistrationStatus), default=RegistrationStatus.CONFIRMED)
    matched_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    volunteer = relationship("User", back_populates="volunteer_matches")
    activity = relationship("Activity", back_populates="volunteer_matches")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    channel = Column(String(20), nullable=False)  # 'sms' or 'whatsapp'
    status = Column(String(20), nullable=False, default='pending')  # 'pending', 'sent', 'failed'
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")
