from datetime import date
from typing import Optional

from backend.module.common.enums import (
    BloodTypeEnum,
    GenderEnum,
    StaffDepartmentEnum,
)
from backend.pkg.core.base_schema import BaseRequestSchema
from pydantic import Field


class BaseUpdateProfileDTO(BaseRequestSchema):
    full_name: Optional[str] = Field(None, min_length=1, max_length=150)
    email: Optional[str] = Field(None, pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    phone_number: Optional[str] = Field(None, max_length=20)


class UpdateStaffProfileDTO(BaseUpdateProfileDTO):
    department: Optional[StaffDepartmentEnum] = None


class UpdateAdminProfileDTO(BaseUpdateProfileDTO):
    pass


class UpdateDoctorProfileDTO(BaseUpdateProfileDTO):
    specialty: Optional[str] = None
    sip_number: Optional[str] = None
    str_number: Optional[str] = None


class UpdatePatientProfileDTO(BaseUpdateProfileDTO):
    nik: Optional[str] = Field(None, min_length=16, max_length=16)
    bpjs_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    blood_type: Optional[BloodTypeEnum] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
