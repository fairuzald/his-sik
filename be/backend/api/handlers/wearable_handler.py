
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
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

    async def add_measurement(self, req: WearableMeasurementCreateDTO):
        """Public endpoint - no authentication required."""
        result = await self.usecase.add_measurement(req)
        return response_factory.success(data=WearableMeasurementDTO.model_validate(result), message="Measurement created")

    async def list_measurements(
        self,
        page: int = 1,
        limit: int = 10,
        device_api_key: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ):
        """List measurements. Supports both device_api_key (public) and patient_id (authenticated)."""
        measurements, total = await self.usecase.list_measurements(
            page=page,
            limit=limit,
            device_api_key=device_api_key,
            patient_id=patient_id,
            date_from=date_from,
            date_to=date_to
        )
        return response_factory.success_list(
            data=[WearableMeasurementDTO.model_validate(m) for m in measurements],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )
