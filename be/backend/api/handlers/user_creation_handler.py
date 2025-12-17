from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.infrastructure.database.session import get_db
from backend.module.profile.repositories.profile_repository import (
    ProfileRepository,
)
from backend.module.user.entity.create_user_dto import (
    CreateDoctorDTO,
    CreatePatientDTO,
    CreateStaffDTO,
)
from backend.module.user.entity.user_dao import UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.module.user.usecases.user_creation_usecase import (
    UserCreationUseCase,
)
from backend.pkg.core.response import response_factory


class UserCreationHandler(BaseHandler):
    """Handler for creating users with their corresponding profile records"""

    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.user_repository = UserRepository(session)
        self.profile_repository = ProfileRepository(session)
        self.usecase = UserCreationUseCase(
            self.user_repository, self.profile_repository
        )

    async def create_patient_user(self, req: CreatePatientDTO):
        """Create a patient user with patient profile"""
        user = await self.usecase.create_patient_user(req)
        return response_factory.success(
            data=UserDAO.model_validate(user),
            message="Patient user created successfully"
        )

    async def create_doctor_user(self, req: CreateDoctorDTO):
        """Create a doctor user with doctor profile"""
        user = await self.usecase.create_doctor_user(req)
        return response_factory.success(
            data=UserDAO.model_validate(user),
            message="Doctor user created successfully"
        )

    async def create_staff_user(self, req: CreateStaffDTO):
        """Create a staff user with staff profile"""
        user = await self.usecase.create_staff_user(req)
        return response_factory.success(
            data=UserDAO.model_validate(user),
            message="Staff user created successfully"
        )

