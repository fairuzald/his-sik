
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.referral.entity.referral import Referral
from backend.module.visit.entity.visit import Visit
from sqlalchemy import desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload


class ReferralRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, referral: Referral) -> Referral:
        self.session.add(referral)
        await self.session.flush()
        await self.session.refresh(referral)
        return referral

    async def get_by_id(self, referral_id: UUID) -> Optional[Referral]:
        stmt = (
            select(Referral)
            .options(joinedload(Referral.visit))
            .where(Referral.id == referral_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, referral: Referral) -> Referral:
        await self.session.flush()
        await self.session.refresh(referral)
        return referral

    async def delete(self, referral: Referral) -> None:
        await self.session.delete(referral)
        await self.session.flush()

    async def list_referrals(
        self,
        page: int = 1,
        limit: int = 10,
        doctor_id: Optional[UUID] = None,
        patient_id: Optional[UUID] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[Referral], int]:
        stmt = (
            select(Referral)
            .join(Visit, Referral.visit_id == Visit.id)
            .options(joinedload(Referral.visit))
        )

        if doctor_id:
            stmt = stmt.where(Referral.referring_doctor_id == doctor_id)

        if patient_id:
            stmt = stmt.where(Referral.patient_id == patient_id)

        if search:
            # Search by facility name, diagnosis, or reason
            stmt = stmt.where(
                or_(
                    Referral.referred_to_facility.ilike(f"%{search}%"),
                    Referral.diagnosis.ilike(f"%{search}%"),
                    Referral.reason.ilike(f"%{search}%")
                )
            )

        stmt = stmt.order_by(desc(Referral.created_at))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
