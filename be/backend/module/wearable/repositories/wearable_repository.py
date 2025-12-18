
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.profile.entity.models import Patient
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

    async def get_patient_by_device_api_key(self, device_api_key: UUID) -> Patient | None:
        """Get patient by device_api_key for validation."""
        stmt = select(Patient).where(Patient.device_api_key == device_api_key)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_patient_by_id(self, id_value: UUID) -> Patient | None:
        """
        Get patient by ID - tries both user_id and patient.id.
        This supports both:
        - Patients querying their own data (passes user_id)
        - Doctors querying patient data from visit (passes patient.id)
        """
        # First try user_id (most common case - patient viewing their own data)
        stmt = select(Patient).where(Patient.user_id == id_value)
        result = await self.session.execute(stmt)
        patient = result.scalars().first()

        if patient:
            return patient

        # If not found, try patient.id (doctor viewing patient data from visit)
        stmt = select(Patient).where(Patient.id == id_value)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_measurements(
        self,
        device_api_key: UUID,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Tuple[List[WearableMeasurement], int]:
        """List measurements by device_api_key (for public API)."""
        stmt = select(WearableMeasurement).where(WearableMeasurement.device_api_key == device_api_key)

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

    async def list_measurements_by_patient_id(
        self,
        id_value: UUID,
        page: int = 1,
        limit: int = 10,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Tuple[List[WearableMeasurement], int]:
        """
        List measurements by patient ID - supports both user_id and patient.id.
        This handles both:
        - Patients viewing own data (id_value is user_id)
        - Doctors viewing patient data from visit (id_value is patient.id)
        """
        # Query that matches either user_id OR patient.id
        stmt = (
            select(WearableMeasurement)
            .join(Patient, WearableMeasurement.device_api_key == Patient.device_api_key)
            .where(
                (Patient.user_id == id_value) | (Patient.id == id_value)
            )
        )

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
