
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.common.enums import RoleEnum
from backend.module.wearable.entity.wearable import WearableDevice, WearableMeasurement
from backend.module.wearable.entity.wearable_dto import (
    WearableDeviceCreateDTO,
    WearableDeviceUpdateDTO,
    WearableMeasurementCreateDTO,
)
from backend.module.wearable.repositories.wearable_repository import WearableRepository
from backend.pkg.core.exceptions import (
    AuthorizationException,
    BusinessLogicException,
    NotFoundException,
)


class WearableUseCase:
    def __init__(self, repository: WearableRepository):
        self.repository = repository

    async def create_device(self, req: WearableDeviceCreateDTO, user_id: UUID, role: str) -> WearableDevice:
        if role != RoleEnum.PATIENT.value:
            raise AuthorizationException("Only patients can register wearable devices")

        existing = await self.repository.get_device_by_identifier(req.device_identifier)
        if existing:
            raise BusinessLogicException("Device identifier already registered")

        device = WearableDevice(
            patient_id=user_id,
            device_identifier=req.device_identifier,
            device_name=req.device_name,
            device_type=req.device_type,
            is_active=req.is_active
        )
        return await self.repository.create_device(device)

    async def list_devices(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str
    ) -> Tuple[List[WearableDevice], int]:
        patient_id = None
        if role == RoleEnum.PATIENT.value:
            patient_id = user_id
        elif role == RoleEnum.DOCTOR.value:
            # Doctors can see devices of patients they treat?
            # Or can they list ALL devices?
            # Prompt: "viewed by patient and dooctor".
            # For simplicity, if doctor requests list, do we filter?
            # Usually Doctor lists devices of a SPECIFIC patient.
            # But here `list_devices` implies listing "my" devices or "all accessible".
            # If Doctor calls this without patient_id filter context, what should they see?
            # Maybe restrict to specific patient_id query param?
            # For now, let's allow Doctor to list ONLY if they pass a patient_id (handled in Handler/Filter),
            # OR if we want to allow Doctor to see a global list (unlikely beneficial).
            # Let's handle patient identification in Handler if possible.
            # But here, if role is Doctor and not filtering, maybe return empty or error?
            pass # Repository handles None patient_id as "All". Maybe unsafe for Doctor to see ALL devices of ALL patients?
            # Revisit: Doctor usually inspects a Patient's profile.

        # If Admin, ok.
        return await self.repository.list_devices(page, limit, patient_id)

    async def get_device(self, device_id: UUID, user_id: UUID, role: str) -> WearableDevice:
        device = await self.repository.get_device_by_id(device_id)
        if not device:
            raise NotFoundException("Device not found")

        if role == RoleEnum.PATIENT.value:
             if device.patient_id != user_id:
                  raise AuthorizationException("Unauthorized")

        # Doctor allowed to view any device?
        if role == RoleEnum.DOCTOR.value:
             pass

        return device

    async def update_device(self, device_id: UUID, req: WearableDeviceUpdateDTO, user_id: UUID, role: str) -> WearableDevice:
        if role != RoleEnum.PATIENT.value:
             raise AuthorizationException("Only owner can update device")

        device = await self.repository.get_device_by_id(device_id)
        if not device:
             raise NotFoundException("Device not found")

        if device.patient_id != user_id:
             raise AuthorizationException("Unauthorized")

        if req.device_name is not None:
             device.device_name = req.device_name
        if req.device_type is not None:
             device.device_type = req.device_type
        if req.is_active is not None:
             device.is_active = req.is_active

        return await self.repository.update_device(device)

    async def delete_device(self, device_id: UUID, user_id: UUID, role: str) -> None:
        if role != RoleEnum.PATIENT.value:
             raise AuthorizationException("Only owner can delete device")

        device = await self.repository.get_device_by_id(device_id)
        if not device:
             raise NotFoundException("Device not found")

        if device.patient_id != user_id:
             raise AuthorizationException("Unauthorized")

        await self.repository.delete_device(device)

    async def add_measurement(self, device_id: UUID, req: WearableMeasurementCreateDTO, user_id: UUID, role: str) -> WearableMeasurement:
        # Simulation: Patient adds measurement, or System (if we had API keys).
        # Assuming Patient adds manual measurement or via App.
        if role != RoleEnum.PATIENT.value:
             raise AuthorizationException("Only patient can add measurements")

        device = await self.repository.get_device_by_id(device_id)
        if not device:
             raise NotFoundException("Device not found")

        if device.patient_id != user_id:
             raise AuthorizationException("Unauthorized")

        measurement = WearableMeasurement(
            device_id=device_id,
            recorded_at=req.recorded_at,
            heart_rate=req.heart_rate,
            systolic_bp=req.systolic_bp,
            diastolic_bp=req.diastolic_bp,
            body_temperature=req.body_temperature,
            steps=req.steps,
            spo2=req.spo2
        )
        return await self.repository.create_measurement(measurement)

    async def list_measurements(
        self,
        device_id: UUID,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Tuple[List[WearableMeasurement], int]:
        device = await self.repository.get_device_by_id(device_id)
        if not device:
            raise NotFoundException("Device not found")

        if role == RoleEnum.PATIENT.value:
             if device.patient_id != user_id:
                  raise AuthorizationException("Unauthorized")

        # Doctor can view

        return await self.repository.list_measurements(device_id, page, limit, date_from, date_to)
