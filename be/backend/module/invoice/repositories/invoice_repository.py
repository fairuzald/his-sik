
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.invoice.entity.invoice import Invoice
from backend.module.visit.entity.visit import Visit
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload


class InvoiceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, invoice: Invoice) -> Invoice:
        self.session.add(invoice)
        await self.session.flush()
        await self.session.refresh(invoice)
        return invoice

    async def get_by_id(self, invoice_id: UUID) -> Optional[Invoice]:
        stmt = (
            select(Invoice)
            .options(
                selectinload(Invoice.items),
                joinedload(Invoice.visit)
            )
            .where(Invoice.id == invoice_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_visit_id(self, visit_id: UUID) -> Optional[Invoice]:
        stmt = (
            select(Invoice)
            .where(Invoice.visit_id == visit_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, invoice: Invoice) -> Invoice:
        await self.session.flush()
        await self.session.refresh(invoice)
        return invoice

    async def delete(self, invoice: Invoice) -> None:
        await self.session.delete(invoice)
        await self.session.flush()

    async def list_invoices(
        self,
        page: int = 1,
        limit: int = 10,
        patient_id: Optional[UUID] = None,
        payment_status: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Tuple[List[Invoice], int]:
        stmt = (
            select(Invoice)
            .join(Visit, Invoice.visit_id == Visit.id)
            .options(
                selectinload(Invoice.items),
                joinedload(Invoice.visit)
            )
        )

        if patient_id:
            stmt = stmt.where(Visit.patient_id == patient_id)

        if payment_status:
            stmt = stmt.where(Invoice.payment_status == payment_status)

        if date_from:
            stmt = stmt.where(Invoice.created_at >= date_from)

        if date_to:
            stmt = stmt.where(Invoice.created_at <= date_to)

        stmt = stmt.order_by(desc(Invoice.created_at))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
