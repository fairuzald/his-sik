from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.medical_record.entity.medical_record_dto import (
    MedicalRecordCreateDTO,
    MedicalRecordDTO,
    MedicalRecordUpdateDTO,
)
from backend.module.medical_record.repositories.medical_record_repository import (
    MedicalRecordRepository,
)
from backend.module.medical_record.usecases.medical_record_usecase import (
    MedicalRecordUseCase,
)
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.response import response_factory


class MedicalRecordHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.profile_repository = ProfileRepository(session)
        self.repository = MedicalRecordRepository(session)
        self.visit_repository = VisitRepository(session)
        self.usecase = MedicalRecordUseCase(self.repository, self.visit_repository, self.profile_repository)

    async def create_medical_record(self, req: MedicalRecordCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_medical_record(req, profile.user_id)
        return response_factory.success(data=MedicalRecordDTO.model_validate(result), message="Medical record created successfully")

    async def list_medical_records(
        self,
        profile: AuthenticatedProfile,
        page: int = 1,
        limit: int = 10,
        patient_id: Optional[UUID] = None,
        doctor_id: Optional[UUID] = None,
        visit_id: Optional[UUID] = None
    ):
        records, total = await self.usecase.list_medical_records(
            page=page,
            limit=limit,
            user_id=profile.user_id,
            role=profile.role,
            patient_id=patient_id,
            doctor_id=doctor_id,
            visit_id=visit_id
        )
        return response_factory.success_list(
            data=[MedicalRecordDTO.model_validate(r) for r in records],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_medical_record(self, record_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_medical_record(record_id, profile.user_id, profile.role)
        return response_factory.success(data=MedicalRecordDTO.model_validate(result))

    async def update_medical_record(self, record_id: UUID, req: MedicalRecordUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_medical_record(record_id, req, profile.user_id)
        return response_factory.success(data=MedicalRecordDTO.model_validate(result), message="Medical record updated successfully")

    async def delete_medical_record(self, record_id: UUID, profile: AuthenticatedProfile):
        await self.usecase.delete_medical_record(record_id, profile.user_id)
        return response_factory.success(message="Medical record deleted successfully")
