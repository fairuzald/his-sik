
from fastapi import APIRouter, Body, Depends

from backend.api.handlers.auth_handler import AuthHandler
from backend.module.user.entity.auth_dto import LoginDTO, RegisterDTO
from backend.module.user.entity.user_dao import TokenDAO, UserDAO
from backend.pkg.core.response_models import ApiResponse

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/login", response_model=ApiResponse[TokenDAO])
async def login(req: LoginDTO, handler: AuthHandler = Depends()):
    return await handler.login(req)

@router.post("/logout", response_model=ApiResponse[None])
async def logout(
    refresh_token: str = Body(..., embed=True),
    handler: AuthHandler = Depends()
):
    return await handler.logout(refresh_token)

@router.post("/refresh", response_model=ApiResponse[TokenDAO])
async def refresh_token(
    refresh_token: str = Body(..., embed=True),
    handler: AuthHandler = Depends()
):
    return await handler.refresh_token(refresh_token)

@router.post("/register", response_model=ApiResponse[UserDAO])
async def register(req: RegisterDTO, handler: AuthHandler = Depends()):
    return await handler.register(req)
