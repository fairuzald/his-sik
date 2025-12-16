
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.wearable.entity.wearable import WearableDevice, WearableMeasurement
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession


class WearableRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Device ---

    async def create_device(self, device: WearableDevice) -> WearableDevice:
        self.session.add(device)
        await self.session.flush()
        await self.session.refresh(device)
        return device

    async def get_device_by_id(self, device_id: UUID) -> Optional[WearableDevice]:
        stmt = select(WearableDevice).where(WearableDevice.id == device_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_device_by_identifier(self, identifier: str) -> Optional[WearableDevice]:
        stmt = select(WearableDevice).where(WearableDevice.device_identifier == identifier)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_devices(
        self,
        page: int = 1,
        limit: int = 10,
        patient_id: Optional[UUID] = None
    ) -> Tuple[List[WearableDevice], int]:
        stmt = select(WearableDevice)

        if patient_id:
            stmt = stmt.where(WearableDevice.patient_id == patient_id)

        stmt = stmt.order_by(desc(WearableDevice.created_at))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total

    async def update_device(self, device: WearableDevice) -> WearableDevice:
        await self.session.flush()
        await self.session.refresh(device)
        return device

    async def delete_device(self, device: WearableDevice) -> None:
        await self.session.delete(device)
        await self.session.flush()

    # --- Measurement ---

    async def create_measurement(self, measurement: WearableMeasurement) -> WearableMeasurement:
        self.session.add(measurement)
        await self.session.flush()
        await self.session.refresh(measurement)
        return measurement

    async def list_measurements(
        self,
        device_id: UUID,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Tuple[List[WearableMeasurement], int]:
        stmt = select(WearableMeasurement).where(WearableMeasurement.device_id == device_id)

        if date_from:
            stmt = stmt.where(WearableMeasurement.recorded_at >= date_from)

        if date_to:
            stmt = stmt.where(WearableMeasurement.recorded_at <= date_to)

        stmt = stmt.order_by(desc(WearableMeasurement.recorded_at))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
