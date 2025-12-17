from typing import List, Optional
from uuid import UUID

from backend.module.common.enums import RoleEnum
from backend.module.medical_record.entity.medical_record import MedicalRecord
from backend.module.medical_record.entity.medical_record_dto import (
    MedicalRecordCreateDTO,
    MedicalRecordUpdateDTO,
)
from backend.module.medical_record.repositories.medical_record_repository import (
    MedicalRecordRepository,
)
from backend.module.profile.repositories.profile_repository import (
    ProfileRepository,
)
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.exceptions import (
    AuthorizationException,
    BusinessLogicException,
    NotFoundException,
)


class MedicalRecordUseCase:
    def __init__(
        self,
        repository: MedicalRecordRepository,
        visit_repository: VisitRepository,
        profile_repository: ProfileRepository
    ):
        self.repository = repository
        self.visit_repository = visit_repository
        self.profile_repository = profile_repository

    async def create_medical_record(self, req: MedicalRecordCreateDTO, user_id: UUID) -> MedicalRecord:
        """Create medical record. Authorization handled by middleware."""
        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
            raise NotFoundException(f"Visit with id {req.visit_id} not found")

        # Ownership check: doctor must be assigned to this visit
        doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
        if not doctor:
             raise BusinessLogicException("Doctor profile not found")

        if visit.doctor_id != doctor.id:
            raise AuthorizationException("You are not the assigned doctor for this visit")

        # Check if record already exists (1-to-1)
        existing = await self.repository.get_by_visit_id(req.visit_id)
        if existing:
            raise BusinessLogicException("Medical record already exists for this visit")

        new_record = MedicalRecord(
            visit_id=req.visit_id,
            anamnesis=req.anamnesis,
            physical_exam=req.physical_exam,
            diagnosis=req.diagnosis,
            treatment_plan=req.treatment_plan,
            doctor_notes=req.doctor_notes,
            outcome=req.outcome
        )
        return await self.repository.create(new_record)

    async def get_medical_record(self, record_id: UUID, user_id: UUID, role: str) -> MedicalRecord:
        """Get medical record with ownership check."""
        record = await self.repository.get_by_id(record_id)
        if not record:
            raise NotFoundException("Medical record not found")

        # Ownership checks
        if role == RoleEnum.DOCTOR.value:
            doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
            if not doctor or record.visit.doctor_id != doctor.id:
                raise NotFoundException("Medical record not found")
        elif role == RoleEnum.PATIENT.value:
            patient = await self.profile_repository.get_patient_by_user_id(user_id)
            if not patient or record.visit.patient_id != patient.id:
                raise NotFoundException("Medical record not found")

        return record

    async def update_medical_record(
        self, record_id: UUID, req: MedicalRecordUpdateDTO, user_id: UUID
    ) -> MedicalRecord:
        """Update medical record. Authorization handled by middleware, ownership check here."""
        record = await self.repository.get_by_id(record_id)
        if not record:
            raise NotFoundException("Medical record not found")

        # Ownership check
        doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
        if not doctor:
             raise AuthorizationException("Doctor profile not found")
        if record.visit.doctor_id != doctor.id:
            raise AuthorizationException("You are not the assigned doctor for this visit")

        if req.anamnesis is not None:
            record.anamnesis = req.anamnesis
        if req.physical_exam is not None:
            record.physical_exam = req.physical_exam
        if req.diagnosis is not None:
            record.diagnosis = req.diagnosis
        if req.treatment_plan is not None:
            record.treatment_plan = req.treatment_plan
        if req.doctor_notes is not None:
            record.doctor_notes = req.doctor_notes
        if req.outcome is not None:
            record.outcome = req.outcome

        return await self.repository.update(record)

    async def delete_medical_record(self, record_id: UUID, user_id: UUID) -> None:
        """Delete medical record. Authorization handled by middleware, ownership check here."""
        record = await self.repository.get_by_id(record_id)
        if not record:
            raise NotFoundException("Medical record not found")

        # Ownership check
        doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
        if not doctor:
             raise AuthorizationException("Doctor profile not found")
        if record.visit.doctor_id != doctor.id:
            raise AuthorizationException("You are not the assigned doctor")

        await self.repository.delete(record)

    async def list_medical_records(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        patient_id: Optional[UUID] = None,
        doctor_id: Optional[UUID] = None,
        visit_id: Optional[UUID] = None
    ) -> tuple[List[MedicalRecord], int]:
        """List medical records with ownership filter."""
        filter_patient_id = patient_id
        filter_doctor_id = doctor_id

        if role == RoleEnum.PATIENT.value:
            patient = await self.profile_repository.get_patient_by_user_id(user_id)
            if patient:
                filter_patient_id = patient.id
        elif role == RoleEnum.DOCTOR.value and not patient_id:
            doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
            if doctor:
                filter_doctor_id = doctor.id
        # Admin/Staff see all

        return await self.repository.list_medical_records(
            page=page,
            limit=limit,
            patient_id=filter_patient_id,
            doctor_id=filter_doctor_id,
            visit_id=visit_id
        )
