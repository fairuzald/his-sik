from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.infrastructure.database.session import get_db
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.profile.usecases.profile_usecase import ProfileUseCase
from backend.module.user.entity.admin_dto import CreateUserDTO
from backend.module.user.entity.user_dao import UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.module.user.usecases.admin_usecase import AdminUseCase
from backend.pkg.core.response import response_factory


class AdminUserHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.user_repository = UserRepository(session)
        self.profile_repository = ProfileRepository(session)
        self.usecase = AdminUseCase(self.user_repository)
        self.profile_usecase = ProfileUseCase(self.user_repository, self.profile_repository)

    async def create_user(self, req: CreateUserDTO):
        user = await self.usecase.create_user(req)
        return response_factory.success(data=UserDAO.model_validate(user), message="User created successfully")

    async def list_users(self, page: int, limit: int, search: str = None, roles: str = None):
        # Parse roles from comma separated string if provided
        role_list = roles.split(",") if roles else None
        users, total = await self.usecase.list_users(page, limit, search, role_list)
        return response_factory.success_list(
            data=[UserDAO.model_validate(u) for u in users],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def update_profile(self, user, req):
        result = await self.profile_usecase.update_admin_profile(user, req)
        return response_factory.success(result)
