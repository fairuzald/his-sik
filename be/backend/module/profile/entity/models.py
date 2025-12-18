import uuid

from backend.infrastructure.database.connection import Base
from backend.module.common.enums import (
    BloodTypeEnum,
    GenderEnum,
    StaffDepartmentEnum,
)
from backend.module.user.entity.user import User
from sqlalchemy import Column, Date, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship


class Staff(Base):
    __tablename__ = "staff"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    department = Column(
        Enum(StaffDepartmentEnum, name="staff_department_enum", create_type=False),
        nullable=False
    )

    user = relationship(User, backref="staff_profile", uselist=False)

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialty = Column(String(100))
    sip_number = Column(String(50))
    str_number = Column(String(50))

    user = relationship(User, backref="doctor_profile", uselist=False)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    device_api_key = Column(PG_UUID(as_uuid=True), unique=True, nullable=True, default=None)
    nik = Column(String(16), unique=True, nullable=False)
    bpjs_number = Column(String(20))
    date_of_birth = Column(Date, nullable=False)
    gender = Column(
        Enum(GenderEnum, name="gender_enum", create_type=False),
        nullable=False
    )
    blood_type = Column(
        Enum(BloodTypeEnum, name="blood_type_enum", create_type=False),
        nullable=True
    )
    address = Column(Text)
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))

    user = relationship(User, backref="patient_profile", uselist=False)
