
import uuid
from datetime import datetime

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import PaymentMethodEnum, PaymentStatusEnum
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visit_id = Column(PG_UUID(as_uuid=True), ForeignKey("visits.id", ondelete="CASCADE"), unique=True, nullable=False)
    cashier_id = Column(PG_UUID(as_uuid=True), ForeignKey("staff.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), default=0, nullable=False)
    amount_paid = Column(Numeric(10, 2), default=0, nullable=False)
    payment_status = Column(String, default=PaymentStatusEnum.UNPAID.value, nullable=False)
    payment_method = Column(String, default=PaymentMethodEnum.CASH.value, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    visit = relationship("Visit", backref="invoice", lazy="joined")
    # cashier = relationship("Staff", backref="processed_invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan", lazy="selectin")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = Column(PG_UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String, nullable=False) # items from InvoiceItemTypeEnum
    description = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(10, 2), default=0, nullable=False)
    subtotal = Column(Numeric(10, 2), default=0, nullable=False)

    # Relationships
    invoice = relationship("Invoice", back_populates="items")
