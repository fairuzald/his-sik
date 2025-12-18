
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.wearable.entity.wearable_dto import (
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

    async def add_measurement(self, req: WearableMeasurementCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.add_measurement(req, profile.id, profile.role)
        return response_factory.success(data=WearableMeasurementDTO.model_validate(result), message="Measurement created")

    async def list_measurements(
        self,
        profile: AuthenticatedProfile,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        patient_id: Optional[UUID] = None
    ):
        measurements, total = await self.usecase.list_measurements(
            page, limit, profile.id, profile.role, date_from, date_to, patient_id
        )
        return response_factory.success_list(
            data=[WearableMeasurementDTO.model_validate(m) for m in measurements],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )
