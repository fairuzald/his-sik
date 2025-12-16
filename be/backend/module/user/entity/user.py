import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import RoleEnum


class User(Base):
    __tablename__ = "users"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    phone_number = Column(String(20), nullable=True)
    photo_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(
        Enum(RoleEnum, name="role_enum", create_type=False),
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    sessions = relationship(
        "UserSession", back_populates="user", lazy="select"
    )
