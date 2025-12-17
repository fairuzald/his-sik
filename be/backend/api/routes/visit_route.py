from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.visit_handler import VisitHandler
from backend.api.middleware.auth import (
    get_current_profile,
    require_admin_or_doctor,
    require_registration_access,
)
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.visit.entity.visit_dto import (
    VisitCreateDTO,
    VisitDTO,
    VisitUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/visits",
    tags=["visits"],
)


@router.post("", response_model=ApiResponse[VisitDTO], dependencies=[Depends(require_registration_access)])
async def create_visit(
    req: VisitCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: VisitHandler = Depends()
):
    """Create a new visit. Admin or Registration Staff only."""
    return await handler.create_visit(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[VisitDTO]])
async def list_visits(
    page: int = 1,
    limit: int = 10,
    visit_status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: VisitHandler = Depends()
):
    """List visits. Filtered by role."""
    return await handler.list_visits(profile, page, limit, visit_status, date_from, date_to)


@router.get("/{visit_id}", response_model=ApiResponse[VisitDTO])
async def get_visit(
    visit_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: VisitHandler = Depends()
):
    """Get a specific visit. Authorized by ownership."""
    return await handler.get_visit(visit_id, profile)


@router.patch("/{visit_id}", response_model=ApiResponse[VisitDTO], dependencies=[Depends(require_admin_or_doctor)])
async def update_visit(
    visit_id: UUID,
    req: VisitUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: VisitHandler = Depends()
):
    """Update a visit. Admin or Doctor only."""
    return await handler.update_visit(visit_id, req, profile)


@router.delete("/{visit_id}", response_model=ApiResponse, dependencies=[Depends(require_registration_access)])
async def delete_visit(
    visit_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: VisitHandler = Depends()
):
    """Delete a visit. Admin or Registration Staff only."""
    return await handler.delete_visit(visit_id, profile)
