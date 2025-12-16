
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile

from backend.api.handlers.referral_handler import ReferralHandler
from backend.api.middleware.auth import (
    get_current_profile,
    require_admin_or_doctor,
    require_doctor,
)
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.referral.entity.referral_dto import (
    ReferralCreateDTO,
    ReferralDTO,
    ReferralUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/referrals",
    tags=["Referrals"]
)


@router.post("", response_model=ApiResponse[ReferralDTO], dependencies=[Depends(require_doctor)])
async def create_referral(
    req: ReferralCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ReferralHandler = Depends()
):
    """Create a new referral. Doctor only."""
    return await handler.create_referral(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[ReferralDTO]])
async def list_referrals(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ReferralHandler = Depends()
):
    """List referrals. Filtered by role."""
    return await handler.list_referrals(profile, page, limit, search)


@router.get("/{referral_id}", response_model=ApiResponse[ReferralDTO])
async def get_referral(
    referral_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ReferralHandler = Depends()
):
    """Get a specific referral. Authorized by ownership."""
    return await handler.get_referral(referral_id, profile)


@router.put("/{referral_id}", response_model=ApiResponse[ReferralDTO], dependencies=[Depends(require_doctor)])
async def update_referral(
    referral_id: UUID,
    referred_to_facility: Optional[str] = Form(None),
    specialty: Optional[str] = Form(None),
    reason: Optional[str] = Form(None),
    diagnosis: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    referral_status: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ReferralHandler = Depends()
):
    """
    Update a referral and optionally upload attachment.
    Accepts multipart form data with optional file upload. Doctor only.
    """
    req = ReferralUpdateDTO(
        referred_to_facility=referred_to_facility,
        specialty=specialty,
        reason=reason,
        diagnosis=diagnosis,
        notes=notes,
        referral_status=referral_status
    )
    return await handler.update_referral(referral_id, req, profile, file)


@router.delete("/{referral_id}", response_model=ApiResponse, dependencies=[Depends(require_admin_or_doctor)])
async def delete_referral(
    referral_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: ReferralHandler = Depends()
):
    """Delete a referral. Admin or Doctor only."""
    return await handler.delete_referral(referral_id, profile)
