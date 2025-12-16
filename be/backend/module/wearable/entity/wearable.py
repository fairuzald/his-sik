
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class WearableDevice(Base):
    __tablename__ = "wearable_devices"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(PG_UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    device_identifier = Column(String(100), unique=True, nullable=False)
    device_name = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    # patient = relationship("Patient", backref="wearable_devices")
    measurements = relationship("WearableMeasurement", back_populates="device", cascade="all, delete-orphan", lazy="selectin")


class WearableMeasurement(Base):
    __tablename__ = "wearable_measurements"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(PG_UUID(as_uuid=True), ForeignKey("wearable_devices.id", ondelete="CASCADE"), nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False)
    heart_rate = Column(Integer, nullable=True)
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    body_temperature = Column(Numeric(4, 1), nullable=True)
    steps = Column(Integer, nullable=True)
    spo2 = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Relationships
    device = relationship("WearableDevice", back_populates="measurements")
