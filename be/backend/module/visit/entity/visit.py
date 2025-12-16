
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import VisitStatusEnum, VisitTypeEnum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class Visit(Base):
    __tablename__ = "visits"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(PG_UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(PG_UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    registration_staff_id = Column(PG_UUID(as_uuid=True), ForeignKey("staff.id"), nullable=False)
    clinic_id = Column(PG_UUID(as_uuid=True), ForeignKey("clinic.id"), nullable=False)

    queue_number = Column(Integer, nullable=True) # Serial in DB, but integer here. Maybe need to handle generation if not auto-incrementing in older postgres with simple insert
    visit_datetime = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    visit_type = Column(
        Enum(VisitTypeEnum, name="visit_type_enum", create_type=False),
        nullable=False,
        default=VisitTypeEnum.GENERAL
    )

    chief_complaint = Column(Text, nullable=True)

    visit_status = Column(
        Enum(VisitStatusEnum, name="visit_status_enum", create_type=False),
        nullable=False,
        default=VisitStatusEnum.REGISTERED
    )

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships (Optional but good for eager loading)
    patient = relationship("Patient", backref="visits", lazy="select")
    doctor = relationship("Doctor", backref="visits", lazy="select")
    # staff = relationship("Staff", foreign_keys=[registration_staff_id])
    clinic = relationship("Clinic", backref="visits", lazy="select")
