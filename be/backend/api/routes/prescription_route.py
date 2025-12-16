
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.prescription_handler import PrescriptionHandler
from backend.api.middleware.auth import (
    get_current_profile,
    require_doctor,
    require_pharmacy_access,
)
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.prescription.entity.prescription_dto import (
    PrescriptionCreateDTO,
    PrescriptionDTO,
    PrescriptionUpdateDTO,
    PrescriptionUpdateStatusDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)


@router.post("", response_model=ApiResponse[PrescriptionDTO], dependencies=[Depends(require_doctor)])
async def create_prescription(
    req: PrescriptionCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: PrescriptionHandler = Depends()
):
    """Create a new prescription. Doctor only."""
    return await handler.create_prescription(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[PrescriptionDTO]])
async def list_prescriptions(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    status: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: PrescriptionHandler = Depends()
):
    """List prescriptions. Filtered by role."""
    return await handler.list_prescriptions(profile, page, limit, search, status)


@router.get("/{prescription_id}", response_model=ApiResponse[PrescriptionDTO])
async def get_prescription(
    prescription_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: PrescriptionHandler = Depends()
):
    """Get a specific prescription. Authorized by ownership."""
    return await handler.get_prescription(prescription_id, profile)


@router.put("/{prescription_id}", response_model=ApiResponse[PrescriptionDTO], dependencies=[Depends(require_doctor)])
async def update_prescription(
    prescription_id: UUID,
    req: PrescriptionUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: PrescriptionHandler = Depends()
):
    """Update a prescription. Doctor only."""
    return await handler.update_prescription(prescription_id, req, profile)


@router.patch("/{prescription_id}/status", response_model=ApiResponse[PrescriptionDTO], dependencies=[Depends(require_pharmacy_access)])
async def update_prescription_status(
    prescription_id: UUID,
    req: PrescriptionUpdateStatusDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: PrescriptionHandler = Depends()
):
    """Update prescription status (dispense). Admin or Pharmacy Staff only."""
    return await handler.update_prescription_status(prescription_id, req, profile)
