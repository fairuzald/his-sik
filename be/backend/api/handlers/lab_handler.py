
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.lab.entity.lab_dto import (
    LabOrderCreateDTO,
    LabOrderDTO,
    LabOrderUpdateStatusDTO,
    LabTestCreateDTO,
    LabTestDTO,
    LabTestUpdateDTO,
)
from backend.module.lab.repositories.lab_repository import (
    LabOrderRepository,
    LabTestRepository,
)
from backend.module.lab.usecases.lab_usecase import LabUseCase
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.response import response_factory


class LabHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.test_repo = LabTestRepository(session)
        self.order_repo = LabOrderRepository(session)
        self.visit_repo = VisitRepository(session)
        self.usecase = LabUseCase(self.test_repo, self.order_repo, self.visit_repo)

    # --- Tests ---
    async def create_lab_test(self, req: LabTestCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_lab_test(req)
        return response_factory.success(data=LabTestDTO.model_validate(result), message="Lab test created")

    async def list_lab_tests(
        self, page: int = 1, limit: int = 10, search: Optional[str] = None, category: Optional[str] = None
    ):
        tests, total = await self.usecase.list_lab_tests(page, limit, search, category)
        return response_factory.success_list(
            data=[LabTestDTO.model_validate(t) for t in tests],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_lab_test(self, test_id: UUID):
        result = await self.usecase.get_lab_test(test_id)
        return response_factory.success(data=LabTestDTO.model_validate(result))

    async def update_lab_test(self, test_id: UUID, req: LabTestUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_lab_test(test_id, req)
        return response_factory.success(data=LabTestDTO.model_validate(result), message="Lab test updated")

    async def delete_lab_test(self, test_id: UUID, profile: AuthenticatedProfile):
        await self.usecase.delete_lab_test(test_id)
        return response_factory.success(message="Lab test deleted")

    # --- Orders ---
    async def create_lab_order(self, req: LabOrderCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_lab_order(req, profile.id)
        return response_factory.success(data=LabOrderDTO.model_validate(result), message="Lab order created")

    async def list_lab_orders(self, profile: AuthenticatedProfile, page: int = 1, limit: int = 10, status: Optional[str] = None):
        orders, total = await self.usecase.list_lab_orders(page, limit, profile.id, profile.role, status)
        return response_factory.success_list(
            data=[LabOrderDTO.model_validate(o) for o in orders],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_lab_order(self, order_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_lab_order(order_id, profile.id, profile.role)
        return response_factory.success(data=LabOrderDTO.model_validate(result))

    async def update_lab_order(
        self, order_id: UUID, req: LabOrderUpdateStatusDTO, profile: AuthenticatedProfile
    ):
        result = await self.usecase.update_lab_order(order_id, req, profile.id)
        return response_factory.success(data=LabOrderDTO.model_validate(result), message="Lab order updated")
