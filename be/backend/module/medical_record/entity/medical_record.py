
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import OutcomeEnum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visit_id = Column(PG_UUID(as_uuid=True), ForeignKey("visits.id", ondelete="CASCADE"), unique=True, nullable=False)

    anamnesis = Column(Text, nullable=True)
    physical_exam = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    treatment_plan = Column(Text, nullable=True)
    doctor_notes = Column(Text, nullable=True)

    outcome = Column(
        Enum(OutcomeEnum, name="outcome_enum", create_type=False),
        nullable=True
    )

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    visit = relationship("Visit", backref="medical_record", lazy="select")
