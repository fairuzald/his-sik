
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ClinicBase(BaseModel):
    name: str

class ClinicCreateDTO(ClinicBase):
    pass

class ClinicUpdateDTO(ClinicBase):
    pass

class ClinicDTO(ClinicBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
