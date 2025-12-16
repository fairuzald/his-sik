
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MedicineBase(BaseModel):
    medicine_code: str
    medicine_name: str
    unit: Optional[str] = None
    unit_price: float = 0
    is_active: bool = True


class MedicineCreateDTO(MedicineBase):
    pass


class MedicineUpdateDTO(BaseModel):
    medicine_code: Optional[str] = None
    medicine_name: Optional[str] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    is_active: Optional[bool] = None


class MedicineDTO(MedicineBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
