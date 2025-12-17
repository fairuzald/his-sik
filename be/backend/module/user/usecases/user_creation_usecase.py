from backend.infrastructure.security.password import get_password_hash
from backend.module.common.enums import RoleEnum
from backend.module.profile.entity.models import Doctor, Patient, Staff
from backend.module.profile.repositories.profile_repository import (
    ProfileRepository,
)
from backend.module.user.entity.create_user_dto import (
    CreateDoctorDTO,
    CreatePatientDTO,
    CreateStaffDTO,
)
from backend.module.user.entity.user import User
from backend.module.user.entity.user_dao import UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.exceptions import BusinessLogicException


class UserCreationUseCase:
    """Use case for creating users with their corresponding profile records"""

    def __init__(
        self,
        user_repository: UserRepository,
        profile_repository: ProfileRepository
    ):
        self.user_repository = user_repository
        self.profile_repository = profile_repository

    async def create_patient_user(
        self, req: CreatePatientDTO
    ) -> UserDAO:
        """Create a patient user with patient profile"""
        # Check if username exists
        existing_user = await self.user_repository.get_user_by_username(
            req.username
        )
        if existing_user:
            raise BusinessLogicException(
                f"Username '{req.username}' already exists"
            )

        if req.email:
            existing_email = await self.user_repository.get_user_by_email(
                req.email
            )
            if existing_email:
                raise BusinessLogicException(
                    f"Email '{req.email}' already exists"
                )

        # Create user
        hashed_password = get_password_hash(req.password)
        new_user = User(
            username=req.username,
            password_hash=hashed_password,
            full_name=req.full_name,
            email=req.email,
            phone_number=req.phone_number,
            role=RoleEnum.PATIENT,
            is_active=True
        )
        created_user = await self.user_repository.create_user(new_user)

        # Create patient profile
        patient = Patient(
            user_id=created_user.id,
            nik=req.nik,
            date_of_birth=req.date_of_birth,
            gender=req.gender,
            bpjs_number=req.bpjs_number,
            blood_type=req.blood_type,
            address=req.address,
            emergency_contact_name=req.emergency_contact_name,
            emergency_contact_phone=req.emergency_contact_phone
        )
        await self.profile_repository.create_patient(patient)

        # Flush to ensure all changes are committed
        await self.user_repository.session.flush()

        return UserDAO.model_validate(created_user)

    async def create_doctor_user(
        self, req: CreateDoctorDTO
    ) -> UserDAO:
        """Create a doctor user with doctor profile"""
        # Check if username exists
        existing_user = await self.user_repository.get_user_by_username(
            req.username
        )
        if existing_user:
            raise BusinessLogicException(
                f"Username '{req.username}' already exists"
            )

        if req.email:
            existing_email = await self.user_repository.get_user_by_email(
                req.email
            )
            if existing_email:
                raise BusinessLogicException(
                    f"Email '{req.email}' already exists"
                )

        # Create user
        hashed_password = get_password_hash(req.password)
        new_user = User(
            username=req.username,
            password_hash=hashed_password,
            full_name=req.full_name,
            email=req.email,
            phone_number=req.phone_number,
            role=RoleEnum.DOCTOR,
            is_active=True
        )
        created_user = await self.user_repository.create_user(new_user)

        # Create doctor profile
        doctor = Doctor(
            user_id=created_user.id,
            specialty=req.specialty,
            sip_number=req.sip_number,
            str_number=req.str_number
        )
        await self.profile_repository.create_doctor(doctor)

        # Flush to ensure all changes are committed
        await self.user_repository.session.flush()

        return UserDAO.model_validate(created_user)

    async def create_staff_user(
        self, req: CreateStaffDTO
    ) -> UserDAO:
        """Create a staff user with staff profile"""
        # Check if username exists
        existing_user = await self.user_repository.get_user_by_username(
            req.username
        )
        if existing_user:
            raise BusinessLogicException(
                f"Username '{req.username}' already exists"
            )

        if req.email:
            existing_email = await self.user_repository.get_user_by_email(
                req.email
            )
            if existing_email:
                raise BusinessLogicException(
                    f"Email '{req.email}' already exists"
                )

        # Create user
        hashed_password = get_password_hash(req.password)
        new_user = User(
            username=req.username,
            password_hash=hashed_password,
            full_name=req.full_name,
            email=req.email,
            phone_number=req.phone_number,
            role=RoleEnum.STAFF,
            is_active=True
        )
        created_user = await self.user_repository.create_user(new_user)

        # Create staff profile
        staff = Staff(
            user_id=created_user.id,
            department=req.department
        )
        await self.profile_repository.create_staff(staff)

        # Flush to ensure all changes are committed
        await self.user_repository.session.flush()

        return UserDAO.model_validate(created_user)

