
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import ReferralStatusEnum
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visit_id = Column(PG_UUID(as_uuid=True), ForeignKey("visits.id", ondelete="CASCADE"), nullable=False)
    patient_id = Column(PG_UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    referring_doctor_id = Column(PG_UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    referred_to_facility = Column(String(150), nullable=False)
    specialty = Column(String(100), nullable=True)
    reason = Column(Text, nullable=False)
    diagnosis = Column(Text, nullable=True)
    referral_status = Column(String, default=ReferralStatusEnum.PENDING.value, nullable=False)
    notes = Column(Text, nullable=True)
    attachment_url = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    visit = relationship("Visit", backref="referrals", lazy="joined")
    # patient = relationship("Patient", backref="referrals") # Keeping simple
    # doctor = relationship("Doctor", backref="referrals_made")
