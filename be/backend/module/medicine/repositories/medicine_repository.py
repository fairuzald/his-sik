
from typing import Optional
from uuid import UUID

from backend.module.medicine.entity.medicine import Medicine
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


class MedicineRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, medicine: Medicine) -> Medicine:
        self.session.add(medicine)
        await self.session.flush()
        await self.session.refresh(medicine)
        return medicine

    async def get_by_id(self, medicine_id: UUID) -> Optional[Medicine]:
        result = await self.session.execute(select(Medicine).where(Medicine.id == medicine_id))
        return result.scalars().first()

    async def get_by_code(self, code: str) -> Optional[Medicine]:
        result = await self.session.execute(select(Medicine).where(Medicine.medicine_code == code))
        return result.scalars().first()

    async def update(self, medicine: Medicine) -> Medicine:
        await self.session.flush()
        await self.session.refresh(medicine)
        return medicine

    async def delete(self, medicine: Medicine) -> None:
        await self.session.delete(medicine)
        await self.session.flush()

    async def list_medicines(
        self,
        page: int = 1,
        limit: int = 10,
        search: str = None,
        is_active: bool = None
    ) -> tuple[list[Medicine], int]:
        stmt = select(Medicine)

        if search:
            stmt = stmt.where(Medicine.medicine_name.ilike(f"%{search}%"))

        if is_active is not None:
            stmt = stmt.where(Medicine.is_active == is_active)

        stmt = stmt.order_by(Medicine.created_at.desc())

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
