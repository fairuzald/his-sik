
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.common.enums import ReferralStatusEnum, RoleEnum
from backend.module.referral.entity.referral import Referral
from backend.module.referral.entity.referral_dto import (
    ReferralCreateDTO,
    ReferralUpdateDTO,
)
from backend.module.referral.repositories.referral_repository import ReferralRepository
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.exceptions import (
    AuthorizationException,
    BusinessLogicException,
    NotFoundException,
)


class ReferralUseCase:
    def __init__(
        self,
        repository: ReferralRepository,
        visit_repository: VisitRepository
    ):
        self.repository = repository
        self.visit_repository = visit_repository

    async def create_referral(self, req: ReferralCreateDTO, doctor_id: UUID) -> Referral:
        """Create referral. Authorization handled by middleware."""
        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
            raise NotFoundException("Visit not found")

        # Ownership check: doctor must be assigned to this visit
        if visit.doctor_id != doctor_id:
            raise AuthorizationException("You are not the doctor for this visit")

        if not visit.patient_id:
            raise BusinessLogicException("Visit has no patient associated")

        referral = Referral(
            visit_id=req.visit_id,
            patient_id=visit.patient_id,
            referring_doctor_id=doctor_id,
            referred_to_facility=req.referred_to_facility,
            specialty=req.specialty,
            reason=req.reason,
            diagnosis=req.diagnosis,
            notes=req.notes,
            referral_status=ReferralStatusEnum.PENDING.value
        )
        return await self.repository.create(referral)

    async def list_referrals(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        search: Optional[str] = None
    ) -> Tuple[List[Referral], int]:
        """List referrals with ownership filter."""
        doctor_id = None
        patient_id = None

        if role == RoleEnum.DOCTOR.value:
            doctor_id = user_id
        elif role == RoleEnum.PATIENT.value:
            patient_id = user_id
        # Admin/Staff see all

        return await self.repository.list_referrals(
            page=page, limit=limit, doctor_id=doctor_id, patient_id=patient_id, search=search
        )

    async def get_referral(self, referral_id: UUID, user_id: UUID, role: str) -> Referral:
        """Get referral with ownership check."""
        referral = await self.repository.get_by_id(referral_id)
        if not referral:
            raise NotFoundException("Referral not found")

        # Ownership checks
        if role == RoleEnum.DOCTOR.value and referral.referring_doctor_id != user_id:
            raise AuthorizationException("Unauthorized")
        elif role == RoleEnum.PATIENT.value and referral.patient_id != user_id:
            raise AuthorizationException("Unauthorized")

        return referral

    async def update_referral(
        self,
        referral_id: UUID,
        req: ReferralUpdateDTO,
        doctor_id: UUID,
        attachment_url: Optional[str] = None
    ) -> Referral:
        """
        Update referral with optional attachment from file upload.
        Combines the functionality of updating referral data and uploading attachments.
        """
        referral = await self.repository.get_by_id(referral_id)
        if not referral:
            raise NotFoundException("Referral not found")

        # Ownership check
        if referral.referring_doctor_id != doctor_id:
            raise AuthorizationException("Unauthorized")

        # Apply updates from request
        for key, value in req.model_dump(exclude_unset=True).items():
            setattr(referral, key, value)

        # Override attachment_url if file was uploaded
        if attachment_url:
            referral.attachment_url = attachment_url

        return await self.repository.update(referral)

    async def delete_referral(self, referral_id: UUID, doctor_id: UUID) -> None:
        """Delete referral. Authorization handled by middleware, ownership check here."""
        referral = await self.repository.get_by_id(referral_id)
        if not referral:
            raise NotFoundException("Referral not found")

        # Ownership check
        if referral.referring_doctor_id != doctor_id:
            raise AuthorizationException("Unauthorized")

        await self.repository.delete(referral)
