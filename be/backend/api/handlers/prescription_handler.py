
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.prescription.entity.prescription_dto import (
    PrescriptionCreateDTO,
    PrescriptionDTO,
    PrescriptionUpdateDTO,
    PrescriptionUpdateStatusDTO,
)
from backend.module.prescription.repositories.prescription_repository import (
    PrescriptionRepository,
)
from backend.module.prescription.usecases.prescription_usecase import (
    PrescriptionUseCase,
)
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.response import response_factory


class PrescriptionHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = PrescriptionRepository(session)
        self.visit_repository = VisitRepository(session)
        self.usecase = PrescriptionUseCase(self.repository, self.visit_repository)

    async def create_prescription(self, req: PrescriptionCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_prescription(req, profile.id)
        return response_factory.success(data=PrescriptionDTO.model_validate(result), message="Prescription created successfully")

    async def list_prescriptions(
        self,
        profile: AuthenticatedProfile,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        status: Optional[str] = None
    ):
        prescriptions, total = await self.usecase.list_prescriptions(
            page=page,
            limit=limit,
            user_id=profile.id,
            role=profile.role,
            search=search,
            status=status
        )
        return response_factory.success_list(
            data=[PrescriptionDTO.model_validate(p) for p in prescriptions],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_prescription(self, prescription_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_prescription(prescription_id, profile.id, profile.role)
        return response_factory.success(data=PrescriptionDTO.model_validate(result))

    async def update_prescription(self, prescription_id: UUID, req: PrescriptionUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_prescription(prescription_id, req, profile.id)
        return response_factory.success(data=PrescriptionDTO.model_validate(result), message="Prescription updated successfully")

    async def update_prescription_status(self, prescription_id: UUID, req: PrescriptionUpdateStatusDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_status(prescription_id, req, profile.id)
        return response_factory.success(data=PrescriptionDTO.model_validate(result), message="Prescription status updated successfully")
