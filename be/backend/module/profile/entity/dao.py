from datetime import date
from typing import Optional, Union
from uuid import UUID

from backend.module.common.enums import (
    BloodTypeEnum,
    GenderEnum,
    StaffDepartmentEnum,
)
from backend.module.user.entity.user_dao import UserDAO
from backend.pkg.core.base_schema import BaseResponseSchema


class StaffProfileDAO(BaseResponseSchema):
    department: StaffDepartmentEnum


class DoctorProfileDAO(BaseResponseSchema):
    id: UUID  # Doctor table ID (not user ID)
    specialty: Optional[str] = None
    sip_number: Optional[str] = None
    str_number: Optional[str] = None


class PatientProfileDAO(BaseResponseSchema):
    nik: str
    device_api_key: Optional[UUID] = None
    bpjs_number: Optional[str] = None
    date_of_birth: date
    gender: GenderEnum
    blood_type: Optional[BloodTypeEnum] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class UserProfileDAO(UserDAO):
    details: Optional[Union[StaffProfileDAO, DoctorProfileDAO, PatientProfileDAO]] = None
