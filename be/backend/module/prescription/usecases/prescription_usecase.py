
from typing import List, Optional
from uuid import UUID

from backend.module.common.enums import PrescriptionStatusEnum, RoleEnum
from backend.module.prescription.entity.prescription import (
    Prescription,
    PrescriptionItem,
)
from backend.module.prescription.entity.prescription_dto import (
    PrescriptionCreateDTO,
    PrescriptionUpdateDTO,
    PrescriptionUpdateStatusDTO,
)
from backend.module.prescription.repositories.prescription_repository import (
    PrescriptionRepository,
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


class PrescriptionUseCase:
    def __init__(
        self,
        repository: PrescriptionRepository,
        visit_repository: VisitRepository,
        profile_repository: ProfileRepository
    ):
        self.repository = repository
        self.visit_repository = visit_repository
        self.profile_repository = profile_repository

    async def create_prescription(self, req: PrescriptionCreateDTO, user_id: UUID) -> Prescription:
        """Create prescription. Authorization handled by middleware."""
        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
            raise NotFoundException("Visit not found")

        # Ownership check: doctor must be assigned to this visit
        # Ownership check: doctor must be assigned to this visit
        doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
        if not doctor or visit.doctor_id != doctor.id:
            raise AuthorizationException("You are not the doctor for this visit")

        # Check existing
        existing = await self.repository.get_by_visit_id(req.visit_id)
        if existing:
            raise BusinessLogicException("Prescription already exists for this visit")

        prescription = Prescription(
            visit_id=req.visit_id,
            doctor_id=doctor.id, # Use doctor ID from profile
            notes=req.notes,
            prescription_status=PrescriptionStatusEnum.PENDING.value
        )

        for item_dto in req.items:
            item = PrescriptionItem(
                medicine_id=item_dto.medicine_id,
                quantity=item_dto.quantity,
                dosage=item_dto.dosage,
                frequency=item_dto.frequency,
                duration=item_dto.duration,
                instructions=item_dto.instructions
            )
            prescription.items.append(item)

        return await self.repository.create(prescription)

    async def get_prescription(self, prescription_id: UUID, user_id: UUID, role: str) -> Prescription:
        """Get prescription with ownership check."""
        prescription = await self.repository.get_by_id(prescription_id)
        if not prescription:
            raise NotFoundException("Prescription not found")

        # Ownership checks
        # Ownership checks
        if role == RoleEnum.DOCTOR.value:
            doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
            if not doctor or prescription.doctor_id != doctor.id:
                 raise AuthorizationException("Not authorized to view this prescription")
        elif role == RoleEnum.PATIENT.value:
            patient = await self.profile_repository.get_patient_by_user_id(user_id)
            if not patient or prescription.visit.patient_id != patient.id:
                 raise AuthorizationException("Not authorized to view this prescription")

        return prescription

    async def update_prescription(
        self, prescription_id: UUID, req: PrescriptionUpdateDTO, user_id: UUID
    ) -> Prescription:
        """Update prescription. Authorization handled by middleware, ownership check here."""
        prescription = await self.repository.get_by_id(prescription_id)
        if not prescription:
            raise NotFoundException("Prescription not found")

        doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
        if not doctor or prescription.doctor_id != doctor.id:
            raise AuthorizationException("Not authorized to update this prescription")

        if prescription.prescription_status != PrescriptionStatusEnum.PENDING.value:
            raise BusinessLogicException("Cannot update processed prescription")

        if req.notes is not None:
            prescription.notes = req.notes

        if req.items is not None:
            prescription.items.clear()
            for item_dto in req.items:
                item = PrescriptionItem(
                    medicine_id=item_dto.medicine_id,
                    quantity=item_dto.quantity,
                    dosage=item_dto.dosage,
                    frequency=item_dto.frequency,
                    duration=item_dto.duration,
                    instructions=item_dto.instructions
                )
                prescription.items.append(item)

        return await self.repository.update(prescription)

    async def update_status(
        self, prescription_id: UUID, req: PrescriptionUpdateStatusDTO, staff_id: UUID
    ) -> Prescription:
        """Update prescription status. Authorization handled by middleware."""
        prescription = await self.repository.get_by_id(prescription_id)
        if not prescription:
            raise NotFoundException("Prescription not found")

        prescription.prescription_status = req.prescription_status.value
        
        # Get staff profile to set pharmacy_staff_id (staff table ID, not user ID)
        staff = await self.profile_repository.get_staff_by_user_id(staff_id)
        if staff:
            prescription.pharmacy_staff_id = staff.id

        return await self.repository.update(prescription)

    async def list_prescriptions(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        search: Optional[str] = None,
        status: Optional[str] = None,
        visit_id: Optional[UUID] = None
    ) -> tuple[List[Prescription], int]:
        """List prescriptions with ownership filter."""
        doctor_id = None
        patient_id = None

        if role == RoleEnum.DOCTOR.value:
            doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
            if doctor:
                doctor_id = doctor.id
        elif role == RoleEnum.PATIENT.value:
            patient = await self.profile_repository.get_patient_by_user_id(user_id)
            if patient:
                patient_id = patient.id
        # Staff/Admin see all

        return await self.repository.list_prescriptions(
            page=page,
            limit=limit,
            doctor_id=doctor_id,
            patient_id=patient_id,
            status=status,
            search=search,
            visit_id=visit_id
        )
