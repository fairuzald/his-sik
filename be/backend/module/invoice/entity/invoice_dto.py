
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from backend.module.visit.entity.visit_dto import VisitDTO
from pydantic import BaseModel, ConfigDict, Field


class InvoiceItemBase(BaseModel):
    item_type: str
    description: str
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., ge=0)


class InvoiceItemCreateDTO(InvoiceItemBase):
    pass


class InvoiceItemDTO(InvoiceItemBase):
    id: UUID
    invoice_id: UUID
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class InvoiceBase(BaseModel):
    notes: Optional[str] = None
    payment_method: str = 'cash'


class InvoiceCreateDTO(BaseModel):
    visit_id: UUID
    # Optional Items usually auto-generated, but allowing manual override implies we might pass them?
    # Requirement: "process automatically".
    # We will exclude manual items in CreateDTO for now, OR make them optional.
    # If explicit items are passed, we use them. If not, we auto-generate.
    items: Optional[List[InvoiceItemCreateDTO]] = None
    notes: Optional[str] = None


class InvoiceUpdateDTO(BaseModel):
    # Only Allow updating Payment info or Notes or Items?
    total_amount: Optional[float] = None
    amount_paid: Optional[float] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None
    items: Optional[List[InvoiceItemCreateDTO]] = None


class InvoiceDTO(InvoiceBase):
    id: UUID
    visit_id: UUID
    cashier_id: UUID
    total_amount: float
    amount_paid: float
    payment_status: str
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemDTO] = []
    visit: Optional[VisitDTO] = None

    model_config = ConfigDict(from_attributes=True)
