
from datetime import datetime
from typing import Optional
from uuid import UUID

from backend.module.common.enums import VisitStatusEnum, VisitTypeEnum
from pydantic import BaseModel, ConfigDict, Field


class VisitBase(BaseModel):
    visit_type: VisitTypeEnum = VisitTypeEnum.GENERAL
    chief_complaint: Optional[str] = None
    visit_datetime: datetime = Field(default_factory=datetime.utcnow)


class VisitCreateDTO(VisitBase):
    patient_user_id: UUID  # User ID of the patient, will be converted to patient table ID
    doctor_user_id: UUID  # User ID of the doctor, will be converted to doctor table ID
    clinic_id: UUID
    # registration_staff_id will be taken from the authenticated user


class VisitUpdateDTO(BaseModel):
    visit_type: Optional[VisitTypeEnum] = None
    chief_complaint: Optional[str] = None
    visit_datetime: Optional[datetime] = None
    visit_status: Optional[VisitStatusEnum] = None
    doctor_id: Optional[UUID] = None
    clinic_id: Optional[UUID] = None


class VisitDTO(VisitBase):
    id: UUID
    patient_id: UUID
    doctor_id: UUID
    registration_staff_id: UUID
    clinic_id: UUID
    queue_number: Optional[int]
    visit_status: VisitStatusEnum
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
