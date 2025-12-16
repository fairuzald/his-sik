
from uuid import UUID

from backend.module.clinic.entity.clinic import Clinic
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class ClinicRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, clinic: Clinic) -> Clinic:
        self.session.add(clinic)
        await self.session.flush()
        return clinic

    async def get_by_id(self, clinic_id: UUID) -> Clinic | None:
        stmt = select(Clinic).where(Clinic.id == clinic_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, clinic: Clinic) -> Clinic:
        self.session.add(clinic)
        await self.session.flush()
        return clinic

    async def delete(self, clinic: Clinic) -> None:
        await self.session.delete(clinic)
        await self.session.flush()

    async def list_clinics(self, page: int = 1, limit: int = 10, search: str = None) -> tuple[list[Clinic], int]:
        stmt = select(Clinic)

        filters = []
        if search:
            filters.append(Clinic.name.ilike(f"%{search}%"))

        if filters:
            for f in filters:
                stmt = stmt.where(f)

        # Total count
        count_stmt = select(func.count()).select_from(Clinic)
        if filters:
            for f in filters:
                count_stmt = count_stmt.where(f)

        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        clinics = result.scalars().all()

        return clinics, total
