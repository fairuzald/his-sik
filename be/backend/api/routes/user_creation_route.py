from fastapi import APIRouter, Depends

from backend.api.handlers.user_creation_handler import UserCreationHandler
from backend.api.middleware.auth import require_registration_access
from backend.module.user.entity.create_user_dto import (
    CreateDoctorDTO,
    CreatePatientDTO,
    CreateStaffDTO,
)
from backend.module.user.entity.user_dao import UserDAO
from backend.pkg.core.response_models import ApiResponse

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)


@router.post(
    "/patients",
    response_model=ApiResponse[UserDAO],
    dependencies=[Depends(require_registration_access)]
)
async def create_patient_user(
    req: CreatePatientDTO,
    handler: UserCreationHandler = Depends()
):
    """
    Create a new patient user with patient profile.
    Registration staff or Admin only.
    """
    return await handler.create_patient_user(req)


@router.post(
    "/doctors",
    response_model=ApiResponse[UserDAO],
    dependencies=[Depends(require_registration_access)]
)
async def create_doctor_user(
    req: CreateDoctorDTO,
    handler: UserCreationHandler = Depends()
):
    """
    Create a new doctor user with doctor profile.
    Registration staff or Admin only.
    """
    return await handler.create_doctor_user(req)


@router.post(
    "/staff",
    response_model=ApiResponse[UserDAO],
    dependencies=[Depends(require_registration_access)]
)
async def create_staff_user(
    req: CreateStaffDTO,
    handler: UserCreationHandler = Depends()
):
    """
    Create a new staff user with staff profile.
    Registration staff or Admin only.
    """
    return await handler.create_staff_user(req)

