
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.lab_handler import LabHandler
from backend.api.middleware.auth import (
    get_current_profile,
    require_doctor,
    require_lab_access,
)
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.lab.entity.lab_dto import (
    LabOrderCreateDTO,
    LabOrderDTO,
    LabOrderUpdateStatusDTO,
    LabTestCreateDTO,
    LabTestDTO,
    LabTestUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/lab",
    tags=["Lab"]
)

# =============================================================================
# Lab Tests (Master Data)
# =============================================================================

@router.post("/tests", response_model=ApiResponse[LabTestDTO], dependencies=[Depends(require_lab_access)])
async def create_lab_test(
    req: LabTestCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Create a new lab test. Admin or Lab Staff only."""
    return await handler.create_lab_test(req, profile)


@router.get("/tests", response_model=PaginatedApiResponse[List[LabTestDTO]])
async def list_lab_tests(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    category: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """List all lab tests. Any authenticated user."""
    return await handler.list_lab_tests(page, limit, search, category)


@router.get("/tests/{test_id}", response_model=ApiResponse[LabTestDTO])
async def get_lab_test(
    test_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Get a specific lab test. Any authenticated user."""
    return await handler.get_lab_test(test_id)


@router.patch("/tests/{test_id}", response_model=ApiResponse[LabTestDTO], dependencies=[Depends(require_lab_access)])
async def update_lab_test(
    test_id: UUID,
    req: LabTestUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Update a lab test. Admin or Lab Staff only."""
    return await handler.update_lab_test(test_id, req, profile)


@router.delete("/tests/{test_id}", response_model=ApiResponse, dependencies=[Depends(require_lab_access)])
async def delete_lab_test(
    test_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Delete a lab test. Admin or Lab Staff only."""
    return await handler.delete_lab_test(test_id, profile)


# =============================================================================
# Lab Orders (Transactional)
# =============================================================================

@router.post("/orders", response_model=ApiResponse[LabOrderDTO], dependencies=[Depends(require_doctor)])
async def create_lab_order(
    req: LabOrderCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Create a lab order. Doctor only."""
    return await handler.create_lab_order(req, profile)


@router.get("/orders", response_model=PaginatedApiResponse[List[LabOrderDTO]])
async def list_lab_orders(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """List lab orders. Filtered by role (Doctor sees own, Staff sees all)."""
    return await handler.list_lab_orders(profile, page, limit, status)


@router.get("/orders/{order_id}", response_model=ApiResponse[LabOrderDTO])
async def get_lab_order(
    order_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """Get a specific lab order. Authorized by ownership."""
    return await handler.get_lab_order(order_id, profile)


@router.patch("/orders/{order_id}", response_model=ApiResponse[LabOrderDTO], dependencies=[Depends(require_lab_access)])
async def update_lab_order(
    order_id: UUID,
    req: LabOrderUpdateStatusDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: LabHandler = Depends()
):
    """
    Update lab order status and optionally result.
    """
    return await handler.update_lab_order(order_id, req, profile)
