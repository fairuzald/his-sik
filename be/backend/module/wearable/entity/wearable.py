
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class WearableMeasurement(Base):
    __tablename__ = "wearable_measurements"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_api_key = Column(PG_UUID(as_uuid=True), ForeignKey("patients.device_api_key", ondelete="CASCADE"), nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False)
    heart_rate = Column(Integer, nullable=True)
    body_temperature = Column(Numeric(4, 1), nullable=True)
    spo2 = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    # patient = relationship("Patient", backref="wearable_measurements")
