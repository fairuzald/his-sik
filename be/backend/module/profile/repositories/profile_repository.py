from uuid import UUID

from backend.module.profile.entity.models import Doctor, Patient, Staff
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class ProfileRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_staff_by_user_id(self, user_id: UUID) -> Staff | None:
        stmt = select(Staff).where(Staff.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_doctor_by_user_id(self, user_id: UUID) -> Doctor | None:
        stmt = select(Doctor).where(Doctor.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_patient_by_user_id(self, user_id: UUID) -> Patient | None:
        stmt = select(Patient).where(Patient.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def create_staff(self, staff: Staff):
        self.session.add(staff)
        await self.session.flush()
        return staff

    async def create_doctor(self, doctor: Doctor):
        self.session.add(doctor)
        await self.session.flush()
        return doctor

    async def create_patient(self, patient: Patient):
        self.session.add(patient)
        await self.session.flush()
        return patient
