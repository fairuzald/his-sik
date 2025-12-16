
from datetime import datetime
from typing import Optional
from uuid import UUID

from backend.module.visit.entity.visit_dto import VisitDTO
from pydantic import BaseModel, ConfigDict


class ReferralBase(BaseModel):
    referred_to_facility: str
    specialty: Optional[str] = None
    reason: str
    diagnosis: Optional[str] = None
    notes: Optional[str] = None


class ReferralCreateDTO(ReferralBase):
    visit_id: UUID
    # Patient ID can be inferred from Visit, but maybe explicit?
    # Usually Visit has patient_id. We should rely on Visit for consistency.
    # But schema requires patient_id. UseCase will extract it from Visit.


class ReferralUpdateDTO(BaseModel):
    referred_to_facility: Optional[str] = None
    specialty: Optional[str] = None
    reason: Optional[str] = None
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    referral_status: Optional[str] = None


class ReferralDTO(ReferralBase):
    id: UUID
    visit_id: UUID
    patient_id: UUID
    referring_doctor_id: UUID
    referral_status: str
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    visit: Optional[VisitDTO] = None

    model_config = ConfigDict(from_attributes=True)
