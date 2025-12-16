
from datetime import datetime
from typing import Optional
from uuid import UUID

from backend.module.common.enums import RoleEnum, VisitStatusEnum
from backend.module.visit.entity.visit import Visit
from backend.module.visit.entity.visit_dto import VisitCreateDTO, VisitUpdateDTO
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.exceptions import AuthorizationException, NotFoundException


class VisitUseCase:
    def __init__(self, visit_repository: VisitRepository):
        self.visit_repository = visit_repository

    async def create_visit(self, req: VisitCreateDTO, staff_id: UUID) -> Visit:
        """Create a visit. Authorization handled by middleware."""
        new_visit = Visit(
            patient_id=req.patient_id,
            doctor_id=req.doctor_id,
            registration_staff_id=staff_id,
            clinic_id=req.clinic_id,
            visit_datetime=req.visit_datetime,
            visit_type=req.visit_type,
            chief_complaint=req.chief_complaint,
            visit_status=VisitStatusEnum.REGISTERED
        )
        return await self.visit_repository.create(new_visit)

    async def get_visit(self, visit_id: UUID, user_id: UUID, role: str) -> Visit:
        """Get visit with ownership check for patients/doctors."""
        visit = await self.visit_repository.get_by_id(visit_id)
        if not visit:
            raise NotFoundException(f"Visit with id {visit_id} not found")

        # Ownership check for patients and doctors
        if role == RoleEnum.DOCTOR.value and visit.doctor_id != user_id:
            raise NotFoundException("Visit not found")
        elif role == RoleEnum.PATIENT.value and visit.patient_id != user_id:
            raise NotFoundException("Visit not found")

        return visit

    async def update_visit(self, visit_id: UUID, req: VisitUpdateDTO, user_id: UUID, role: str) -> Visit:
        """Update visit. Authorization handled by middleware, ownership check here."""
        visit = await self.visit_repository.get_by_id(visit_id)
        if not visit:
            raise NotFoundException(f"Visit with id {visit_id} not found")

        # Doctor can only update status of their own visits
        if role == RoleEnum.DOCTOR.value:
            if visit.doctor_id != user_id:
                raise AuthorizationException("Not authorized to update this visit")
            # Doctor can only update status
            if req.visit_status:
                visit.visit_status = req.visit_status
        else:
            # Admin/Staff can update everything
            if req.visit_type:
                visit.visit_type = req.visit_type
            if req.chief_complaint is not None:
                visit.chief_complaint = req.chief_complaint
            if req.visit_datetime:
                visit.visit_datetime = req.visit_datetime
            if req.visit_status:
                visit.visit_status = req.visit_status
            if req.doctor_id:
                visit.doctor_id = req.doctor_id
            if req.clinic_id:
                visit.clinic_id = req.clinic_id

        return await self.visit_repository.update(visit)

    async def delete_visit(self, visit_id: UUID) -> None:
        """Delete visit. Authorization handled by middleware."""
        visit = await self.visit_repository.get_by_id(visit_id)
        if not visit:
            raise NotFoundException(f"Visit with id {visit_id} not found")
        await self.visit_repository.delete(visit)

    async def list_visits(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        clinic_id: Optional[UUID] = None,
        status: Optional[VisitStatusEnum] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> tuple[list[Visit], int]:
        """List visits filtered by role for ownership."""
        filter_patient_id = None
        filter_doctor_id = None

        if role == RoleEnum.DOCTOR.value:
            filter_doctor_id = user_id
        elif role == RoleEnum.PATIENT.value:
            filter_patient_id = user_id
        # Admin/Staff see all

        return await self.visit_repository.list_visits(
            page=page,
            limit=limit,
            patient_id=filter_patient_id,
            doctor_id=filter_doctor_id,
            clinic_id=clinic_id,
            status=status,
            date_from=date_from,
            date_to=date_to
        )
