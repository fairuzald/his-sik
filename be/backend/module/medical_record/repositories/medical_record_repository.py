
from uuid import UUID

from backend.module.medical_record.entity.medical_record import MedicalRecord
from backend.module.visit.entity.visit import Visit
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload


class MedicalRecordRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, record: MedicalRecord) -> MedicalRecord:
        self.session.add(record)
        await self.session.flush()
        await self.session.refresh(record)
        return record

    async def get_by_id(self, record_id: UUID) -> MedicalRecord | None:
        stmt = select(MedicalRecord).options(joinedload(MedicalRecord.visit)).where(MedicalRecord.id == record_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_visit_id(self, visit_id: UUID) -> MedicalRecord | None:
        stmt = select(MedicalRecord).where(MedicalRecord.visit_id == visit_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, record: MedicalRecord) -> MedicalRecord:
        self.session.add(record)
        await self.session.flush()
        await self.session.refresh(record)
        return record

    async def delete(self, record: MedicalRecord) -> None:
        await self.session.delete(record)
        await self.session.flush()

    async def list_medical_records(
        self,
        page: int = 1,
        limit: int = 10,
        patient_id: UUID = None,
        doctor_id: UUID = None,
        visit_id: UUID = None
    ) -> tuple[list[MedicalRecord], int]:
        stmt = select(MedicalRecord).join(Visit, MedicalRecord.visit_id == Visit.id)

        filters = []
        if visit_id:
            filters.append(MedicalRecord.visit_id == visit_id)
        if patient_id:
            filters.append(Visit.patient_id == patient_id)
        if doctor_id:
            filters.append(Visit.doctor_id == doctor_id)

        if filters:
            for f in filters:
                stmt = stmt.where(f)

        # Order by created_at desc
        stmt = stmt.order_by(MedicalRecord.created_at.desc())

        # Total count
        count_stmt = select(func.count()).select_from(MedicalRecord).join(Visit, MedicalRecord.visit_id == Visit.id)
        if filters:
            for f in filters:
                count_stmt = count_stmt.where(f)

        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        records = result.scalars().all()

        return records, total
