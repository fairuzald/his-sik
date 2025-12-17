
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.prescription.entity.prescription import (
    Prescription,
    PrescriptionItem,
)
from backend.module.visit.entity.visit import Visit
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload


class PrescriptionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, prescription: Prescription) -> Prescription:
        self.session.add(prescription)
        await self.session.flush()
        await self.session.refresh(prescription)
        
        # Eagerly load relationships to prevent lazy loading issues
        stmt = (
            select(Prescription)
            .options(
                selectinload(Prescription.items).joinedload(PrescriptionItem.medicine),
                joinedload(Prescription.visit)
            )
            .where(Prescription.id == prescription.id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id(self, prescription_id: UUID) -> Optional[Prescription]:
        # Eager load items and visit
        stmt = (
            select(Prescription)
            .options(
                selectinload(Prescription.items).joinedload(PrescriptionItem.medicine),
                joinedload(Prescription.visit)
            )
            .where(Prescription.id == prescription_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_visit_id(self, visit_id: UUID) -> Optional[Prescription]:
        stmt = (
            select(Prescription)
            .options(selectinload(Prescription.items))
            .where(Prescription.visit_id == visit_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, prescription: Prescription) -> Prescription:
        await self.session.flush()
        await self.session.refresh(prescription)
        
        # Eagerly load relationships to prevent lazy loading issues
        stmt = (
            select(Prescription)
            .options(
                selectinload(Prescription.items).joinedload(PrescriptionItem.medicine),
                joinedload(Prescription.visit)
            )
            .where(Prescription.id == prescription.id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def delete(self, prescription: Prescription) -> None:
        await self.session.delete(prescription)
        await self.session.flush()

    async def list_prescriptions(
        self,
        page: int = 1,
        limit: int = 10,
        doctor_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        visit_id: Optional[UUID] = None
    ) -> Tuple[List[Prescription], int]:
        stmt = (
            select(Prescription)
            .join(Visit, Prescription.visit_id == Visit.id)
            .options(
                selectinload(Prescription.items).joinedload(PrescriptionItem.medicine),
                joinedload(Prescription.visit)
            )
        )

        if doctor_id:
            stmt = stmt.where(Prescription.doctor_id == doctor_id)

        if patient_id:
            stmt = stmt.where(Visit.patient_id == patient_id)

        if visit_id:
            stmt = stmt.where(Prescription.visit_id == visit_id)

        if status:
            stmt = stmt.where(Prescription.prescription_status == status)

        if search:
            # Search by patient name (via Visit -> Patient (Profile?) -> or just generic search?)
            # Since we joined Visit, let's assume we can search by something visible?
            # Maybe search medicine name in items?
            # Or notes?
            # User requirement: "each list must have search query"
            # Let's search notes or patient name?
            # Note: Checking patient name requires joining Patient Profile.
            # Let's do a simple search on notes for now, or if Patient name is critical we need another join.
            # Assuming 'visit' has relation to 'patient' (Profile) which has 'name'.
            # But 'Visit' refers to 'patient_id' (User ID or Profile ID?).
            # In Visit entity: patient_id is UUID.
            # Let's implement search on notes for simplicity unless specific requirment.
            stmt = stmt.where(Prescription.notes.ilike(f"%{search}%"))

        stmt = stmt.order_by(desc(Prescription.created_at))

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
