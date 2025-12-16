
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.clinic_handler import ClinicHandler
from backend.api.middleware.auth import get_current_profile, require_admin
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.clinic.entity.clinic_dto import (
    ClinicCreateDTO,
    ClinicDTO,
    ClinicUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/clinics",
    tags=["Clinics"]
)


@router.post("", response_model=ApiResponse[ClinicDTO], dependencies=[Depends(require_admin)])
async def create_clinic(
    req: ClinicCreateDTO,
    handler: ClinicHandler = Depends()
):
    """Create a new clinic. Admin only."""
    return await handler.create_clinic(req)


@router.get("", response_model=PaginatedApiResponse[List[ClinicDTO]])
async def list_clinics(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ClinicHandler = Depends()
):
    """List clinics. Any authenticated user."""
    return await handler.list_clinics(page, limit, search)


@router.get("/{clinic_id}", response_model=ApiResponse[ClinicDTO])
async def get_clinic(
    clinic_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ClinicHandler = Depends()
):
    """Get a single clinic. Any authenticated user."""
    return await handler.get_clinic(clinic_id)


@router.put("/{clinic_id}", response_model=ApiResponse[ClinicDTO], dependencies=[Depends(require_admin)])
async def update_clinic(
    clinic_id: UUID,
    req: ClinicUpdateDTO,
    handler: ClinicHandler = Depends()
):
    """Update a clinic. Admin only."""
    return await handler.update_clinic(clinic_id, req)


@router.delete("/{clinic_id}", response_model=ApiResponse, dependencies=[Depends(require_admin)])
async def delete_clinic(
    clinic_id: UUID,
    handler: ClinicHandler = Depends()
):
    """Delete a clinic. Admin only."""
    return await handler.delete_clinic(clinic_id)
