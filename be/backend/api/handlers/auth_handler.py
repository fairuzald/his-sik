from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.session import get_db
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.session.repositories.session_repository import (
    SessionRepository,
)
from backend.module.user.entity.auth_dto import LoginDTO, RegisterDTO
from backend.module.user.entity.user_dao import TokenDAO, UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.module.user.usecases.auth_usecase import AuthUseCase
from backend.pkg.core.response import response_factory


class AuthHandler:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.user_repository = UserRepository(session)
        self.session_repository = SessionRepository(session)
        self.profile_repository = ProfileRepository(session)
        self.usecase = AuthUseCase(
            self.user_repository,
            self.session_repository,
            self.profile_repository
        )

    async def login(self, req: LoginDTO):
        token = await self.usecase.login(req)
        return response_factory.success(data=TokenDAO.model_validate(token), message="Login successful")

    async def register(self, req: RegisterDTO):
        user = await self.usecase.register(req)
        return response_factory.success(data=UserDAO.model_validate(user), message="User registered successfully")

    async def logout(self, refresh_token: str):
        await self.usecase.logout(refresh_token)
        return response_factory.success(message="Logout successful")

    async def refresh_token(self, refresh_token: str):
        token = await self.usecase.refresh_token(refresh_token)
        return response_factory.success(data=TokenDAO.model_validate(token), message="Token refreshed successfully")
