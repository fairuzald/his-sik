
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

# --- Measurement DTOs ---

class WearableMeasurementBase(BaseModel):
    recorded_at: datetime
    heart_rate: Optional[int] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    body_temperature: Optional[float] = None
    steps: Optional[int] = None
    spo2: Optional[int] = None


class WearableMeasurementCreateDTO(WearableMeasurementBase):
    pass


class WearableMeasurementDTO(WearableMeasurementBase):
    id: UUID
    device_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Device DTOs ---

class WearableDeviceBase(BaseModel):
    device_identifier: str
    device_name: Optional[str] = None
    device_type: Optional[str] = None
    is_active: bool = True


class WearableDeviceCreateDTO(WearableDeviceBase):
    pass


class WearableDeviceUpdateDTO(BaseModel):
    device_name: Optional[str] = None
    device_type: Optional[str] = None
    is_active: Optional[bool] = None


class WearableDeviceDTO(WearableDeviceBase):
    id: UUID
    patient_id: UUID
    created_at: datetime
    updated_at: datetime
    # We might not need to embed all measurements in the device list view.
    # measurements: List[WearableMeasurementDTO] = []

    model_config = ConfigDict(from_attributes=True)
