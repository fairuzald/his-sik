import uuid
from uuid import UUID

from backend.module.profile.entity.models import Doctor, Patient, Staff
from sqlalchemy import delete, select
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

    async def regenerate_patient_device_api_key(self, patient: Patient) -> Patient:
        """
        Regenerate device_api_key for a patient.
        This will delete all existing measurements for this patient since
        regenerating the key invalidates the old device.
        """
        # Import here to avoid circular dependency
        from backend.module.wearable.entity.wearable import WearableMeasurement

        # Delete all existing measurements for this patient's old device_api_key
        if patient.device_api_key:
            delete_stmt = delete(WearableMeasurement).where(
                WearableMeasurement.device_api_key == patient.device_api_key
            )
            await self.session.execute(delete_stmt)

        # Generate new device_api_key
        patient.device_api_key = uuid.uuid4()
        await self.session.flush()
        await self.session.refresh(patient)
        return patient
