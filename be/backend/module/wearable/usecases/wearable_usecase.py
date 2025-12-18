
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.wearable.entity.wearable import WearableMeasurement
from backend.module.wearable.entity.wearable_dto import (
    WearableMeasurementCreateDTO,
)
from backend.module.wearable.repositories.wearable_repository import WearableRepository
from backend.pkg.core.exceptions import (
    NotFoundException,
    ValidationException,
)


class WearableUseCase:
    def __init__(self, repository: WearableRepository):
        self.repository = repository

    async def add_measurement(self, req: WearableMeasurementCreateDTO) -> WearableMeasurement:
        """Add a wearable measurement using device_api_key (public endpoint)."""
        # Validate that device_api_key exists
        patient = await self.repository.get_patient_by_device_api_key(req.device_api_key)
        if not patient:
            raise NotFoundException("Invalid device API key")

        measurement = WearableMeasurement(
            device_api_key=req.device_api_key,
            recorded_at=req.recorded_at,
            heart_rate=req.heart_rate,
            body_temperature=req.body_temperature,
            spo2=req.spo2
        )
        return await self.repository.create_measurement(measurement)

    async def list_measurements(
        self,
        page: int,
        limit: int,
        device_api_key: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> Tuple[List[WearableMeasurement], int]:
        """
        List measurements.
        Either device_api_key OR patient_id must be provided.
        - device_api_key: for public API (IoT devices)
        - patient_id: for authenticated users (doctors, staff)
        """
        if not device_api_key and not patient_id:
            raise ValidationException("Either device_api_key or patient_id must be provided")

        if device_api_key and patient_id:
            raise ValidationException("Cannot provide both device_api_key and patient_id")

        if device_api_key:
            # Public API - validate device_api_key exists
            patient = await self.repository.get_patient_by_device_api_key(device_api_key)
            if not patient:
                raise NotFoundException("Invalid device API key")
            return await self.repository.list_measurements(device_api_key, page, limit, date_from, date_to)

        if patient_id:
            # Authenticated API - validate patient_id exists
            patient = await self.repository.get_patient_by_id(patient_id)
            if not patient:
                raise NotFoundException("Patient not found")
            return await self.repository.list_measurements_by_patient_id(patient_id, page, limit, date_from, date_to)
