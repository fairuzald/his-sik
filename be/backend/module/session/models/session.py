import uuid

from backend.infrastructure.database.connection import Base
from sqlalchemy import Column, DateTime, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import INET, UUID
from sqlalchemy.orm import relationship


class UserSession(Base):
    """
    User session database model for tracking the session
    relationship between users and their sessions.
    """
    __tablename__ = "user_sessions"

    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    # Relationship to user
    user = relationship("User", back_populates="sessions")
