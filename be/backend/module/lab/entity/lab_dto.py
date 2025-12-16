
from datetime import datetime
from typing import Optional
from uuid import UUID

from backend.module.visit.entity.visit_dto import VisitDTO
from pydantic import BaseModel, ConfigDict, Field

# --- Lab Test DTOs ---

class LabTestBase(BaseModel):
    test_code: str
    test_name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    price: float = Field(0, ge=0)
    is_active: bool = True


class LabTestCreateDTO(LabTestBase):
    pass


class LabTestUpdateDTO(BaseModel):
    test_code: Optional[str] = None
    test_name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None


class LabTestDTO(LabTestBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Lab Result DTOs ---

class LabResultBase(BaseModel):
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    interpretation: Optional[str] = None


class LabResultDTO(LabResultBase):
    id: UUID
    lab_order_id: UUID
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Lab Order DTOs ---

class LabOrderBase(BaseModel):
    lab_test_id: UUID
    notes: Optional[str] = None


class LabOrderCreateDTO(LabOrderBase):
    visit_id: UUID


class LabOrderUpdateStatusDTO(BaseModel):
    order_status: str # OrderStatusEnum
    result: Optional[LabResultBase] = None # Optional result when completing


class LabOrderDTO(LabOrderBase):
    id: UUID
    visit_id: UUID
    doctor_id: UUID
    lab_staff_id: Optional[UUID] = None
    order_status: str
    created_at: datetime
    updated_at: datetime
    lab_test: Optional[LabTestDTO] = None
    visit: Optional[VisitDTO] = None
    result: Optional[LabResultDTO] = None

    model_config = ConfigDict(from_attributes=True)
