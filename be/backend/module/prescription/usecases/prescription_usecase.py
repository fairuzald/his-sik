
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
        visit_repository: VisitRepository
    ):
        self.repository = repository
        self.visit_repository = visit_repository

    async def create_prescription(self, req: PrescriptionCreateDTO, doctor_id: UUID) -> Prescription:
        """Create prescription. Authorization handled by middleware."""
        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
            raise NotFoundException("Visit not found")

        # Ownership check: doctor must be assigned to this visit
        if visit.doctor_id != doctor_id:
            raise AuthorizationException("You are not the doctor for this visit")

        # Check existing
        existing = await self.repository.get_by_visit_id(req.visit_id)
        if existing:
            raise BusinessLogicException("Prescription already exists for this visit")

        prescription = Prescription(
            visit_id=req.visit_id,
            doctor_id=doctor_id,
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
        if role == RoleEnum.DOCTOR.value and prescription.doctor_id != user_id:
            raise AuthorizationException("Not authorized to view this prescription")
        elif role == RoleEnum.PATIENT.value and prescription.visit.patient_id != user_id:
            raise AuthorizationException("Not authorized to view this prescription")

        return prescription

    async def update_prescription(
        self, prescription_id: UUID, req: PrescriptionUpdateDTO, doctor_id: UUID
    ) -> Prescription:
        """Update prescription. Authorization handled by middleware, ownership check here."""
        prescription = await self.repository.get_by_id(prescription_id)
        if not prescription:
            raise NotFoundException("Prescription not found")

        if prescription.doctor_id != doctor_id:
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
        prescription.pharmacy_staff_id = staff_id

        return await self.repository.update(prescription)

    async def list_prescriptions(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> tuple[List[Prescription], int]:
        """List prescriptions with ownership filter."""
        doctor_id = None
        patient_id = None

        if role == RoleEnum.DOCTOR.value:
            doctor_id = user_id
        elif role == RoleEnum.PATIENT.value:
            patient_id = user_id
        # Staff/Admin see all

        return await self.repository.list_prescriptions(
            page=page,
            limit=limit,
            doctor_id=doctor_id,
            patient_id=patient_id,
            status=status,
            search=search
        )
