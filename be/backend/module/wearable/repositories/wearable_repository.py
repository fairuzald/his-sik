
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.wearable.entity.wearable import WearableMeasurement
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession


class WearableRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_measurement(self, measurement: WearableMeasurement) -> WearableMeasurement:
        self.session.add(measurement)
        await self.session.flush()
        await self.session.refresh(measurement)
        return measurement

    async def list_measurements(
        self,
        patient_id: UUID,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Tuple[List[WearableMeasurement], int]:
        stmt = select(WearableMeasurement).where(WearableMeasurement.patient_id == patient_id)

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
