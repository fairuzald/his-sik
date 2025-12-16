from backend.infrastructure.database.session import get_db
from backend.module.profile.entity.dto import UpdateStaffProfileDTO
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.profile.usecases.profile_usecase import ProfileUseCase
from backend.module.user.entity.user import User
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.response import response_factory
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


class StaffProfileHandler:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.user_repo = UserRepository(session)
        self.profile_repo = ProfileRepository(session)
        self.usecase = ProfileUseCase(self.user_repo, self.profile_repo)

    async def update_profile(
        self,
        req: UpdateStaffProfileDTO,
        user: User,
    ):
        result = await self.usecase.update_staff_profile(user, req)
        return response_factory.success(result)
