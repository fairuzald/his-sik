from datetime import date

from pydantic import EmailStr, Field

from backend.module.common.enums import BloodTypeEnum, GenderEnum
from backend.pkg.core.base_schema import BaseRequestSchema


class LoginDTO(BaseRequestSchema):
    username: str
    password: str


class RegisterDTO(BaseRequestSchema):
    """Patient self-registration DTO with patient profile fields"""
    # User fields
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr | None = None
    phone_number: str | None = None

    # Patient-specific required fields
    nik: str = Field(..., min_length=16, max_length=16,
                     description="NIK Indonesia (16 digits)")
    date_of_birth: date = Field(..., description="Date of birth")
    gender: GenderEnum = Field(..., description="Gender (L/P)")

    # Patient-specific optional fields
    bpjs_number: str | None = Field(None, max_length=20,
                                     description="BPJS number (optional)")
    blood_type: BloodTypeEnum | None = Field(None,
                                              description="Blood type")
    address: str | None = Field(None, description="Full address")
    emergency_contact_name: str | None = Field(
        None, max_length=100, description="Emergency contact name"
    )
    emergency_contact_phone: str | None = Field(
        None, max_length=20, description="Emergency contact phone"
    )
