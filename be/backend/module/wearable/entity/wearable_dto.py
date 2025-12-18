
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

# --- Measurement DTOs ---

class WearableMeasurementBase(BaseModel):
    recorded_at: datetime
    heart_rate: Optional[int] = None
    body_temperature: Optional[float] = None
    spo2: Optional[int] = None


class WearableMeasurementCreateDTO(WearableMeasurementBase):
    pass


class WearableMeasurementDTO(WearableMeasurementBase):
    id: UUID
    patient_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
