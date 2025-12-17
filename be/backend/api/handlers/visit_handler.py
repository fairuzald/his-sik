from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.common.enums import VisitStatusEnum
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.visit.entity.visit_dto import (
    VisitCreateDTO,
    VisitDTO,
    VisitUpdateDTO,
)
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.module.visit.usecases.visit_usecase import VisitUseCase
from backend.pkg.core.response import response_factory


class VisitHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = VisitRepository(session)
        self.profile_repository = ProfileRepository(session)
        self.usecase = VisitUseCase(
            self.repository, self.profile_repository
        )

    async def create_visit(
        self, req: VisitCreateDTO, profile: AuthenticatedProfile
    ):
        result = await self.usecase.create_visit(req, profile.id)
        return response_factory.success(
            data=VisitDTO.model_validate(result),
            message="Visit created successfully"
        )

    async def list_visits(
        self,
        profile: AuthenticatedProfile,
        page: int = 1,
        limit: int = 10,
        visit_status: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
    ):
        # Convert string dates to datetime objects
        parsed_date_from = None
        parsed_date_to = None

        if date_from:
            try:
                parsed_date_from = datetime.fromisoformat(
                    date_from.replace('Z', '+00:00')
                )
            except (ValueError, AttributeError):
                pass

        if date_to:
            try:
                parsed_date_to = datetime.fromisoformat(
                    date_to.replace('Z', '+00:00')
                )
            except (ValueError, AttributeError):
                pass

        # Convert status string to enum if provided
        parsed_status = None
        if visit_status:
            try:
                parsed_status = VisitStatusEnum(visit_status)
            except (ValueError, KeyError):
                pass

        visits, total = await self.usecase.list_visits(
            page=page,
            limit=limit,
            user_id=profile.id,
            role=profile.role,
            status=parsed_status,
            date_from=parsed_date_from,
            date_to=parsed_date_to
        )
        return response_factory.success_list(
            data=[VisitDTO.model_validate(v) for v in visits],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_visit(
        self, visit_id: UUID, profile: AuthenticatedProfile
    ):
        result = await self.usecase.get_visit(
            visit_id, profile.user_id, profile.role
        )
        return response_factory.success(
            data=VisitDTO.model_validate(result)
        )

    async def update_visit(
        self,
        visit_id: UUID,
        req: VisitUpdateDTO,
        profile: AuthenticatedProfile
    ):
        result = await self.usecase.update_visit(
            visit_id, req, profile.user_id, profile.role
        )
        return response_factory.success(
            data=VisitDTO.model_validate(result),
            message="Visit updated successfully"
        )

    async def delete_visit(
        self, visit_id: UUID, profile: AuthenticatedProfile
    ):
        await self.usecase.delete_visit(visit_id)
        return response_factory.success(
            message="Visit deleted successfully"
        )
