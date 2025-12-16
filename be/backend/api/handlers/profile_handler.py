from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.session import get_db
from backend.module.profile.entity.dto import (
    UpdateAdminProfileDTO,
    UpdateDoctorProfileDTO,
    UpdatePatientProfileDTO,
    UpdateStaffProfileDTO,
)
from backend.module.profile.repositories.profile_repository import (
    ProfileRepository,
)
from backend.module.profile.usecases.profile_usecase import (
    ProfileUseCase,
)
from backend.module.user.entity.user import User
from backend.module.user.repositories.user_repository import (
    UserRepository,
)
from backend.pkg.core.response import response_factory


class GeneralProfileHandler:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.user_repo = UserRepository(session)
        self.profile_repo = ProfileRepository(session)
        self.usecase = ProfileUseCase(self.user_repo, self.profile_repo)

    async def get_profile(self, user: User):
        result = await self.usecase.get_profile(user)
        return response_factory.success(result)

    async def update_profile(
        self,
        user: User,
        req: UpdateAdminProfileDTO | UpdateDoctorProfileDTO | UpdatePatientProfileDTO | UpdateStaffProfileDTO
    ):
        role_value = user.role.value
        if role_value == "doctor":
            result = await self.usecase.update_doctor_profile(user, req)
        elif role_value == "patient":
            result = await self.usecase.update_patient_profile(user, req)
        elif role_value == "staff":
            result = await self.usecase.update_staff_profile(user, req)
        elif role_value == "admin":
            result = await self.usecase.update_admin_profile(user, req)
        else:
             # Should be unreachable with current enums
             return response_factory.error(
                 status_code=400, message="Invalid role for profile update"
             )

        return response_factory.success(result)

    async def upload_photo(self, user: User, file):
        if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
             return response_factory.error(code=400, message="Invalid file type. Only images are allowed.")

        from backend.infrastructure.storage.s3_service import get_storage_service
        s3 = get_storage_service()

        path = f"users/{user.id}/photo-{file.filename}"
        res = await s3.upload_file(file.file, path, file.content_type)
        if not res.success:
             return response_factory.error(code=500, message=f"Upload failed: {res.error}")

        result = await self.usecase.update_user_photo(user, res.file_url)
        return response_factory.success(result, message="Photo uploaded")
