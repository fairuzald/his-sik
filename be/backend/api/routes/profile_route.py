
from fastapi import APIRouter, Depends

from backend.api.handlers.doctor_profile_handler import DoctorProfileHandler
from backend.api.handlers.patient_profile_handler import PatientProfileHandler
from backend.api.handlers.profile_handler import GeneralProfileHandler
from backend.api.handlers.staff_profile_handler import StaffProfileHandler
from backend.api.handlers.user_handler import AdminUserHandler
from backend.api.middleware.auth import (
    get_current_user,
    require_admin,
    require_doctor,
    require_patient,
    require_staff,
)
from backend.module.profile.entity.dao import UserProfileDAO
from backend.module.profile.entity.dto import (
    UpdateAdminProfileDTO,
    UpdateDoctorProfileDTO,
    UpdatePatientProfileDTO,
    UpdateStaffProfileDTO,
)
from backend.module.user.entity.user import User
from backend.pkg.core.response_models import ApiResponse

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/me", response_model=ApiResponse[UserProfileDAO])
async def get_my_profile(
    user: User = Depends(get_current_user),
    handler: GeneralProfileHandler = Depends()
):
    """Get current user's profile. Any authenticated user."""
    return await handler.get_profile(user)


@router.put("/admin", response_model=ApiResponse, dependencies=[Depends(require_admin)])
async def update_admin_profile(
    req: UpdateAdminProfileDTO,
    user: User = Depends(get_current_user),
    handler: AdminUserHandler = Depends()
):
    """Update admin profile. Admin only."""
    return await handler.update_profile(user, req)


@router.put("/staff", response_model=ApiResponse[UserProfileDAO], dependencies=[Depends(require_staff)])
async def update_staff_profile(
    req: UpdateStaffProfileDTO,
    user: User = Depends(get_current_user),
    handler: StaffProfileHandler = Depends()
):
    """Update staff profile. Staff only."""
    return await handler.update_profile(req, user)


@router.put("/doctor", response_model=ApiResponse[UserProfileDAO], dependencies=[Depends(require_doctor)])
async def update_doctor_profile(
    req: UpdateDoctorProfileDTO,
    user: User = Depends(get_current_user),
    handler: DoctorProfileHandler = Depends()
):
    """Update doctor profile. Doctor only."""
    return await handler.update_profile(req, user)


@router.put("/patient", response_model=ApiResponse[UserProfileDAO], dependencies=[Depends(require_patient)])
async def update_patient_profile(
    req: UpdatePatientProfileDTO,
    user: User = Depends(get_current_user),
    handler: PatientProfileHandler = Depends()
):
    """Update patient profile. Patient only."""
    return await handler.update_profile(req, user)
