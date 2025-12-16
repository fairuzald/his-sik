
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from backend.module.common.enums import PrescriptionStatusEnum
from backend.module.medicine.entity.medicine_dto import MedicineDTO
from backend.module.visit.entity.visit_dto import VisitDTO
from pydantic import BaseModel, ConfigDict, Field


class PrescriptionItemBase(BaseModel):
    medicine_id: UUID
    quantity: int = Field(..., gt=0)
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    instructions: Optional[str] = None


class PrescriptionItemCreateDTO(PrescriptionItemBase):
    pass


class PrescriptionItemDTO(PrescriptionItemBase):
    id: UUID
    prescription_id: UUID
    medicine: Optional[MedicineDTO] = None

    model_config = ConfigDict(from_attributes=True)


class PrescriptionBase(BaseModel):
    notes: Optional[str] = None


class PrescriptionCreateDTO(PrescriptionBase):
    visit_id: UUID
    items: List[PrescriptionItemCreateDTO]


class PrescriptionUpdateStatusDTO(BaseModel):
    prescription_status: PrescriptionStatusEnum
    pharmacy_staff_id: Optional[UUID] = None # Optional usually inferred from logged in staff


class PrescriptionUpdateDTO(BaseModel):
    # Doctor can update notes or items.
    # For simplicity, let's say they can update notes and maybe replace items?
    # Or strict CRUD on items separately?
    # Let's support updating notes and replacing items list for now in PUT.
    notes: Optional[str] = None
    items: Optional[List[PrescriptionItemCreateDTO]] = None


class PrescriptionDTO(PrescriptionBase):
    id: UUID
    visit_id: UUID
    doctor_id: UUID
    pharmacy_staff_id: Optional[UUID] = None
    prescription_status: str
    created_at: datetime
    updated_at: datetime
    items: List[PrescriptionItemDTO] = []
    visit: Optional[VisitDTO] = None

    model_config = ConfigDict(from_attributes=True)
