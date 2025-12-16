
from datetime import datetime
from typing import Optional
from uuid import UUID

from backend.module.common.enums import OutcomeEnum
from pydantic import BaseModel, ConfigDict


class MedicalRecordBase(BaseModel):
    anamnesis: Optional[str] = None
    physical_exam: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    doctor_notes: Optional[str] = None
    outcome: Optional[OutcomeEnum] = None


class MedicalRecordCreateDTO(MedicalRecordBase):
    visit_id: UUID


class MedicalRecordUpdateDTO(MedicalRecordBase):
    pass


class MedicalRecordDTO(MedicalRecordBase):
    id: UUID
    visit_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
