
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

# --- Measurement DTOs ---

class WearableMeasurementBase(BaseModel):
    recorded_at: datetime
    heart_rate: Optional[float] = None
    body_temperature: Optional[float] = None
    spo2: Optional[float] = None


class WearableMeasurementCreateDTO(WearableMeasurementBase):
    device_api_key: UUID


class WearableMeasurementDTO(WearableMeasurementBase):
    id: UUID
    device_api_key: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
