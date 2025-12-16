from backend.module.profile.entity.dao import (
    DoctorProfileDAO,
    PatientProfileDAO,
    StaffProfileDAO,
    UserProfileDAO,
)
from backend.module.profile.entity.dto import (
    UpdateAdminProfileDTO,
    UpdateDoctorProfileDTO,
    UpdatePatientProfileDTO,
    UpdateStaffProfileDTO,
)
from backend.module.profile.entity.models import Doctor, Patient, Staff
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.user.entity.user import RoleEnum, User
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.exceptions import BusinessLogicException, NotFoundException


class ProfileUseCase:
    def __init__(
        self, user_repo: UserRepository, profile_repo: ProfileRepository
    ):
        self.user_repo = user_repo
        self.profile_repo = profile_repo

    async def get_profile(self, user: User) -> UserProfileDAO:
        profile_dao = None
        role_value = user.role.value

        if role_value in [RoleEnum.STAFF.value, RoleEnum.ADMIN.value]:
            # Admin is technically staff-like or has no extra profile?
            # Schema separates 'staff' table. Admin might not have an entry there unless created.
            staff = await self.profile_repo.get_staff_by_user_id(user.id)
            if staff:
                profile_dao = StaffProfileDAO.model_validate(staff)

        elif role_value == RoleEnum.DOCTOR.value:
            doctor = await self.profile_repo.get_doctor_by_user_id(user.id)
            if doctor:
                profile_dao = DoctorProfileDAO.model_validate(doctor)

        elif role_value == RoleEnum.PATIENT.value:
            patient = await self.profile_repo.get_patient_by_user_id(user.id)
            if patient:
                profile_dao = PatientProfileDAO.model_validate(patient)

        return UserProfileDAO(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            email=user.email,
            phone_number=user.phone_number,
            role=user.role.value,  # Use enum value
            photo_url=user.photo_url,
            is_active=user.is_active,
            details=profile_dao,
        )

    async def _update_common_fields(self, user: User, req: any):
        if req.full_name:
            user.full_name = req.full_name
        if req.email:
            # Check unique email usage if changed (omitted for brevity, assume repository handles or integrity error)
            user.email = req.email
        if req.phone_number:
            user.phone_number = req.phone_number

    async def update_staff_profile(
        self, user: User, req: UpdateStaffProfileDTO
    ) -> UserProfileDAO:
        if user.role != RoleEnum.STAFF and user.role != RoleEnum.ADMIN:
            raise BusinessLogicException("User is not a staff member")

        await self._update_common_fields(user, req)

        staff = await self.profile_repo.get_staff_by_user_id(user.id)
        if not staff:
            if not req.department:
                if user.role == RoleEnum.ADMIN:
                    # Admin might not need staff profile, but if they try to update it?
                    pass
                else:
                    raise NotFoundException("Staff profile not found")
            else:
                staff = Staff(user_id=user.id, department=req.department)
                await self.profile_repo.create_staff(staff)
        else:
            if req.department:
                staff.department = req.department

        await self.user_repo.session.flush()
        return await self.get_profile(user)

    async def update_admin_profile(
        self, user: User, req: UpdateAdminProfileDTO
    ) -> UserProfileDAO:
        if user.role != RoleEnum.ADMIN:
            raise BusinessLogicException("User is not an admin")

        await self._update_common_fields(user, req)
        await self.user_repo.session.flush()
        return await self.get_profile(user)

    async def update_doctor_profile(
        self, user: User, req: UpdateDoctorProfileDTO
    ) -> UserProfileDAO:
        if user.role != RoleEnum.DOCTOR:
            raise BusinessLogicException("User is not a doctor")

        await self._update_common_fields(user, req)

        doctor = await self.profile_repo.get_doctor_by_user_id(user.id)
        if not doctor:
            # Create if not exists (upsert logic)
            doctor = Doctor(user_id=user.id)
            await self.profile_repo.create_doctor(doctor)

        if req.specialty:
            doctor.specialty = req.specialty
        if req.sip_number:
            doctor.sip_number = req.sip_number
        if req.str_number:
            doctor.str_number = req.str_number

        await self.user_repo.session.flush()
        return await self.get_profile(user)

    async def update_patient_profile(
        self, user: User, req: UpdatePatientProfileDTO
    ) -> UserProfileDAO:
        if user.role != RoleEnum.PATIENT:
            raise BusinessLogicException("User is not a patient")

        await self._update_common_fields(user, req)

        patient = await self.profile_repo.get_patient_by_user_id(user.id)
        if not patient:
            # Creation requires mandatory fields
            if not (req.nik and req.date_of_birth and req.gender):
                 raise BusinessLogicException("NIK, ID, and Gender required for new patient")

            patient = Patient(
                user_id=user.id,
                nik=req.nik,
                date_of_birth=req.date_of_birth,
                gender=req.gender,
                bpjs_number=req.bpjs_number,
                blood_type=req.blood_type,
                address=req.address,
                emergency_contact_name=req.emergency_contact_name,
                emergency_contact_phone=req.emergency_contact_phone
            )
            await self.profile_repo.create_patient(patient)
        else:
            if req.nik:
                patient.nik = req.nik
            if req.bpjs_number:
                patient.bpjs_number = req.bpjs_number
            if req.date_of_birth:
                patient.date_of_birth = req.date_of_birth
            if req.gender:
                patient.gender = req.gender
            if req.blood_type:
                patient.blood_type = req.blood_type
            if req.address:
                patient.address = req.address
            if req.emergency_contact_name:
                patient.emergency_contact_name = req.emergency_contact_name
            if req.emergency_contact_phone:
                patient.emergency_contact_phone = req.emergency_contact_phone

        await self.user_repo.session.flush()
        return await self.get_profile(user)

    async def update_user_photo(self, user: User, photo_url: str) -> UserProfileDAO:
        user.photo_url = photo_url
        await self.user_repo.session.flush()
        return await self.get_profile(user)
