from uuid import UUID

from backend.pkg.core.base_schema import BaseResponseSchema


class TokenDAO(BaseResponseSchema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserDAO(BaseResponseSchema):
    id: UUID
    username: str
    full_name: str
    email: str | None = None
    phone_number: str | None = None
    role: str
    photo_url: str | None = None
    is_active: bool

    class Config:
        from_attributes = True
