
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import OrderStatusEnum
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class LabTest(Base):
    __tablename__ = "lab_tests"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_code = Column(String(20), unique=True, nullable=False)
    test_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=True)
    unit = Column(String(20), nullable=True)
    reference_range = Column(String(50), nullable=True)
    price = Column(Numeric(10, 2), default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class LabOrder(Base):
    __tablename__ = "lab_orders"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visit_id = Column(PG_UUID(as_uuid=True), ForeignKey("visits.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(PG_UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    lab_staff_id = Column(PG_UUID(as_uuid=True), ForeignKey("staff.id"), nullable=True)
    lab_test_id = Column(PG_UUID(as_uuid=True), ForeignKey("lab_tests.id"), nullable=False)
    order_status = Column(String, default=OrderStatusEnum.PENDING.value, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    visit = relationship("Visit", backref="lab_orders", lazy="joined")
    # doctor = relationship("Doctor", backref="lab_orders")
    # lab_staff = relationship("Staff", backref="processed_lab_orders")
    lab_test = relationship("LabTest", lazy="joined")
    result = relationship("LabResult", uselist=False, back_populates="lab_order", cascade="all, delete-orphan", lazy="joined")


class LabResult(Base):
    __tablename__ = "lab_results"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lab_order_id = Column(PG_UUID(as_uuid=True), ForeignKey("lab_orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    result_value = Column(String(100), nullable=True)
    result_unit = Column(String(20), nullable=True)
    interpretation = Column(Text, nullable=True)
    attachment_url = Column(Text, nullable=True)
    attachment_type = Column(String, nullable=True) # 'pdf' or 'image'

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    lab_order = relationship("LabOrder", back_populates="result")
