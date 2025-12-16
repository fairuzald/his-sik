
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from sqlalchemy import Boolean, Column, DateTime, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medicine_code = Column(String(20), nullable=False, unique=True)
    medicine_name = Column(String(150), nullable=False)
    unit = Column(String(20), nullable=True)
    unit_price = Column(Numeric(10, 2), nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
