from pydantic import EmailStr, Field

from backend.pkg.core.base_schema import BaseRequestSchema


class LoginDTO(BaseRequestSchema):
    username: str
    password: str


class RegisterDTO(BaseRequestSchema):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr | None = None
    phone_number: str | None = None
