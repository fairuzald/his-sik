from typing import List, Optional

from fastapi import APIRouter, Depends

from backend.api.handlers.user_handler import AdminUserHandler
from backend.api.middleware.auth import (
    require_admin,
    require_registration_access,
)
from backend.module.user.entity.admin_dto import CreateUserDTO
from backend.module.user.entity.user_dao import UserDAO
from backend.pkg.core.response_models import ApiResponse, PaginatedApiResponse

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)


@router.post("", response_model=ApiResponse[UserDAO], dependencies=[Depends(require_admin)])
async def create_user(
    req: CreateUserDTO,
    handler: AdminUserHandler = Depends()
):
    """Create a new user. Admin only."""
    return await handler.create_user(req)


@router.get("", response_model=PaginatedApiResponse[List[UserDAO]], dependencies=[Depends(require_registration_access)])
async def list_users(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    roles: Optional[str] = None,
    handler: AdminUserHandler = Depends()
):
    """List users. Admin or Registration Staff only."""
    return await handler.list_users(page, limit, search, roles)
