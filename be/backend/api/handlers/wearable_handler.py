
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.wearable.entity.wearable_dto import (
    WearableDeviceCreateDTO,
    WearableDeviceDTO,
    WearableDeviceUpdateDTO,
    WearableMeasurementCreateDTO,
    WearableMeasurementDTO,
)
from backend.module.wearable.repositories.wearable_repository import WearableRepository
from backend.module.wearable.usecases.wearable_usecase import WearableUseCase
from backend.pkg.core.response import response_factory


class WearableHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = WearableRepository(session)
        self.usecase = WearableUseCase(self.repository)

    async def create_device(self, req: WearableDeviceCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_device(req, profile.id, profile.role)
        return response_factory.success(data=WearableDeviceDTO.model_validate(result), message="Device registered")

    async def list_devices(self, profile: AuthenticatedProfile, page: int = 1, limit: int = 10):
        devices, total = await self.usecase.list_devices(page, limit, profile.id, profile.role)
        return response_factory.success_list(
            data=[WearableDeviceDTO.model_validate(d) for d in devices],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_device(self, device_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_device(device_id, profile.id, profile.role)
        return response_factory.success(data=WearableDeviceDTO.model_validate(result))

    async def update_device(self, device_id: UUID, req: WearableDeviceUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_device(device_id, req, profile.id, profile.role)
        return response_factory.success(data=WearableDeviceDTO.model_validate(result), message="Device updated")

    async def delete_device(self, device_id: UUID, profile: AuthenticatedProfile):
        await self.usecase.delete_device(device_id, profile.id, profile.role)
        return response_factory.success(message="Device deleted")

    async def add_measurement(self, device_id: UUID, req: WearableMeasurementCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.add_measurement(device_id, req, profile.id, profile.role)
        return response_factory.success(data=WearableMeasurementDTO.model_validate(result), message="Measurement created")

    async def list_measurements(
        self,
        device_id: UUID,
        profile: AuthenticatedProfile,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ):
        measurements, total = await self.usecase.list_measurements(
            device_id, page, limit, profile.id, profile.role, date_from, date_to
        )
        return response_factory.success_list(
            data=[WearableMeasurementDTO.model_validate(m) for m in measurements],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )
