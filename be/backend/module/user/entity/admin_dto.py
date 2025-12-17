from pydantic import EmailStr, Field

from backend.pkg.core.base_schema import BaseRequestSchema


class CreateUserDTO(BaseRequestSchema):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr | None = None
    phone_number: str | None = None
    role: str = Field(..., description="Role: admin, doctor, staff, or patient")


class UpdateUserAdminDTO(BaseRequestSchema):
    full_name: str | None = None
    email: EmailStr | None = None
    phone_number: str | None = None
    is_active: bool | None = None
