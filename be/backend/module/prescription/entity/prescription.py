
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import PrescriptionStatusEnum
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visit_id = Column(PG_UUID(as_uuid=True), ForeignKey("visits.id", ondelete="CASCADE"), unique=True, nullable=False)
    doctor_id = Column(PG_UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    pharmacy_staff_id = Column(PG_UUID(as_uuid=True), ForeignKey("staff.id"), nullable=True)
    prescription_status = Column(String, nullable=False, default=PrescriptionStatusEnum.PENDING.value)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    visit = relationship("Visit", backref="prescription", lazy="joined")
    # doctor = relationship("Doctor", backref="prescriptions") # Keeping simple for now to avoid circular imports if generic User used
    # pharmacy_staff = relationship("Staff", backref="processed_prescriptions")
    items = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan", lazy="selectin")


class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prescription_id = Column(PG_UUID(as_uuid=True), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False)
    medicine_id = Column(PG_UUID(as_uuid=True), ForeignKey("medicines.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    dosage = Column(String(50), nullable=True)
    frequency = Column(String(50), nullable=True)
    duration = Column(String(30), nullable=True)
    instructions = Column(Text, nullable=True)

    # Relationships
    prescription = relationship("Prescription", back_populates="items")
    medicine = relationship("Medicine", lazy="joined")
