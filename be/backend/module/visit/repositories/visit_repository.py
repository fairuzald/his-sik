
from datetime import datetime
from uuid import UUID

from backend.module.common.enums import VisitStatusEnum
from backend.module.visit.entity.visit import Visit
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class VisitRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, visit: Visit) -> Visit:
        # Check for queue number generation if logic is needed here
        # For now relying on DB sequence or we can query max

        # If queue_number is SERIAL in Postgres, we don't need to pass it, it auto-increments
        # But commonly in mapped classes we might want to ensure it's fetched back

        self.session.add(visit)
        await self.session.flush()
        await self.session.refresh(visit)
        return visit

    async def get_by_id(self, visit_id: UUID) -> Visit | None:
        stmt = select(Visit).where(Visit.id == visit_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, visit: Visit) -> Visit:
        self.session.add(visit)
        await self.session.flush()
        await self.session.refresh(visit)
        return visit

    async def delete(self, visit: Visit) -> None:
        await self.session.delete(visit)
        await self.session.flush()

    async def list_visits(
        self,
        page: int = 1,
        limit: int = 10,
        patient_id: UUID = None,
        doctor_id: UUID = None,
        clinic_id: UUID = None,
        status: VisitStatusEnum = None,
        date_from: datetime = None,
        date_to: datetime = None
    ) -> tuple[list[Visit], int]:
        stmt = select(Visit)

        filters = []
        if patient_id:
            filters.append(Visit.patient_id == patient_id)
        if doctor_id:
            filters.append(Visit.doctor_id == doctor_id)
        if clinic_id:
            filters.append(Visit.clinic_id == clinic_id)
        if status:
            filters.append(Visit.visit_status == status)
        if date_from:
            filters.append(Visit.visit_datetime >= date_from)
        if date_to:
            filters.append(Visit.visit_datetime <= date_to)

        if filters:
            for f in filters:
                stmt = stmt.where(f)

        # Order by datetime desc
        stmt = stmt.order_by(Visit.visit_datetime.desc())

        # Total count
        count_stmt = select(func.count()).select_from(Visit)
        if filters:
            for f in filters:
                count_stmt = count_stmt.where(f)

        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        visits = result.scalars().all()

        return visits, total
