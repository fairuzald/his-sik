
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.lab.entity.lab import LabOrder, LabTest
from backend.module.visit.entity.visit import Visit
from sqlalchemy import desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload


class LabTestRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, lab_test: LabTest) -> LabTest:
        self.session.add(lab_test)
        await self.session.flush()
        await self.session.refresh(lab_test)
        return lab_test

    async def get_by_id(self, lab_test_id: UUID) -> Optional[LabTest]:
        result = await self.session.execute(select(LabTest).where(LabTest.id == lab_test_id))
        return result.scalars().first()

    async def get_by_code(self, code: str) -> Optional[LabTest]:
        result = await self.session.execute(select(LabTest).where(LabTest.test_code == code))
        return result.scalars().first()

    async def update(self, lab_test: LabTest) -> LabTest:
        await self.session.flush()
        await self.session.refresh(lab_test)
        return lab_test

    async def delete(self, lab_test: LabTest) -> None:
        await self.session.delete(lab_test)
        await self.session.flush()

    async def list_lab_tests(
        self,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Tuple[List[LabTest], int]:
        stmt = select(LabTest)

        if category:
            stmt = stmt.where(LabTest.category == category)

        if is_active is not None:
             stmt = stmt.where(LabTest.is_active == is_active)

        if search:
            stmt = stmt.where(
                or_(
                    LabTest.test_name.ilike(f"%{search}%"),
                    LabTest.test_code.ilike(f"%{search}%")
                )
            )

        stmt = stmt.order_by(LabTest.test_name) # Alphabetical

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total


class LabOrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, lab_order: LabOrder) -> LabOrder:
        self.session.add(lab_order)
        await self.session.flush()
        await self.session.refresh(lab_order)
        return lab_order

    async def get_by_id(self, lab_order_id: UUID) -> Optional[LabOrder]:
        stmt = (
            select(LabOrder)
            .options(
                joinedload(LabOrder.lab_test),
                joinedload(LabOrder.visit),
                joinedload(LabOrder.result)
            )
            .where(LabOrder.id == lab_order_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, lab_order: LabOrder) -> LabOrder:
        await self.session.flush()
        await self.session.refresh(lab_order)
        return lab_order

    async def list_lab_orders(
        self,
        page: int = 1,
        limit: int = 10,
        doctor_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        status: Optional[str] = None,
        visit_id: Optional[UUID] = None
    ) -> Tuple[List[LabOrder], int]:
        stmt = (
            select(LabOrder)
            .join(Visit, LabOrder.visit_id == Visit.id)
            .options(
                joinedload(LabOrder.lab_test),
                joinedload(LabOrder.visit),
                joinedload(LabOrder.result)
            )
        )

        if doctor_id:
            stmt = stmt.where(LabOrder.doctor_id == doctor_id)

        if patient_id:
            stmt = stmt.where(Visit.patient_id == patient_id)

        if visit_id:
            stmt = stmt.where(LabOrder.visit_id == visit_id)

        if status:
            stmt = stmt.where(LabOrder.order_status == status)

        stmt = stmt.order_by(desc(LabOrder.created_at))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
