
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.infrastructure.database.session import get_db
from backend.module.clinic.entity.clinic_dto import (
    ClinicCreateDTO,
    ClinicDTO,
    ClinicUpdateDTO,
)
from backend.module.clinic.repositories.clinic_repository import ClinicRepository
from backend.module.clinic.usecases.clinic_usecase import ClinicUseCase
from backend.pkg.core.response import response_factory


class ClinicHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = ClinicRepository(session)
        self.usecase = ClinicUseCase(self.repository)

    async def create_clinic(self, req: ClinicCreateDTO):
        clinic = await self.usecase.create_clinic(req)
        return response_factory.success(data=ClinicDTO.model_validate(clinic), message="Clinic created successfully")

    async def list_clinics(self, page: int = 1, limit: int = 10, search: str = None):
        clinics, total = await self.usecase.list_clinics(page, limit, search)
        return response_factory.success_list(
            data=[ClinicDTO.model_validate(c) for c in clinics],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_clinic(self, clinic_id: UUID):
        clinic = await self.usecase.get_clinic(clinic_id)
        return response_factory.success(data=ClinicDTO.model_validate(clinic))

    async def update_clinic(self, clinic_id: UUID, req: ClinicUpdateDTO):
        clinic = await self.usecase.update_clinic(clinic_id, req)
        return response_factory.success(data=ClinicDTO.model_validate(clinic), message="Clinic updated successfully")

    async def delete_clinic(self, clinic_id: UUID):
        await self.usecase.delete_clinic(clinic_id)
        return response_factory.success(message="Clinic deleted successfully")
