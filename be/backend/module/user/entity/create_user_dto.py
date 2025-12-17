from datetime import date

from pydantic import EmailStr, Field

from backend.module.common.enums import (
    BloodTypeEnum,
    GenderEnum,
    StaffDepartmentEnum,
)
from backend.pkg.core.base_schema import BaseRequestSchema


class BaseCreateUserDTO(BaseRequestSchema):
    """Base DTO for creating users with common fields"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr | None = None
    phone_number: str | None = None


class CreatePatientDTO(BaseCreateUserDTO):
    """DTO for creating a patient user with patient profile fields"""
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


class CreateDoctorDTO(BaseCreateUserDTO):
    """DTO for creating a doctor user with doctor profile fields"""
    # Doctor-specific fields (all optional for now, can be filled later)
    specialty: str | None = Field(None, max_length=100,
                                   description="Medical specialty")
    sip_number: str | None = Field(None, max_length=50,
                                    description="Surat Izin Praktek number")
    str_number: str | None = Field(
        None,
        max_length=50,
        pattern=r'^[0-9]{16}$',
        description="Surat Tanda Registrasi (16 digits)"
    )


class CreateStaffDTO(BaseCreateUserDTO):
    """DTO for creating a staff user with staff profile fields"""
    # Staff-specific required field
    department: StaffDepartmentEnum = Field(
        ...,
        description="Staff department: Registration/Pharmacy/Laboratory/Cashier"
    )

