
from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.referral.entity.referral_dto import (
    ReferralCreateDTO,
    ReferralDTO,
    ReferralUpdateDTO,
)
from backend.module.referral.repositories.referral_repository import ReferralRepository
from backend.module.referral.usecases.referral_usecase import ReferralUseCase
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.response import response_factory


class ReferralHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = ReferralRepository(session)
        self.visit_repo = VisitRepository(session)
        self.usecase = ReferralUseCase(self.repository, self.visit_repo)

    async def create_referral(self, req: ReferralCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_referral(req, profile.id)
        return response_factory.success(data=ReferralDTO.model_validate(result), message="Referral created")

    async def list_referrals(self, profile: AuthenticatedProfile, page: int = 1, limit: int = 10, search: Optional[str] = None):
        referrals, total = await self.usecase.list_referrals(page, limit, profile.id, profile.role, search)
        return response_factory.success_list(
            data=[ReferralDTO.model_validate(r) for r in referrals],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_referral(self, referral_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_referral(referral_id, profile.id, profile.role)
        return response_factory.success(data=ReferralDTO.model_validate(result))

    async def update_referral(
        self, referral_id: UUID, req: ReferralUpdateDTO, profile: AuthenticatedProfile, file=None
    ):
        """
        Update referral and optionally upload an attachment in a single request.
        If a file is provided, it will be uploaded and the attachment_url will be updated.
        """
        attachment_url = None

        # Handle file upload if provided
        if file:
            if file.content_type not in ["application/pdf", "image/png", "image/jpeg", "image/jpg"]:
                return response_factory.error(code=400, message="Invalid file type. Only PDF and images are allowed.")

            from backend.infrastructure.storage.s3_service import get_storage_service
            s3 = get_storage_service()

            path = f"referrals/{referral_id}/{file.filename}"
            res = await s3.upload_file(file.file, path, file.content_type)
            if not res.success:
                return response_factory.error(code=500, message=f"Upload failed: {res.error}")

            attachment_url = res.file_url

        result = await self.usecase.update_referral(referral_id, req, profile.id, attachment_url)
        return response_factory.success(data=ReferralDTO.model_validate(result), message="Referral updated")

    async def delete_referral(self, referral_id: UUID, profile: AuthenticatedProfile):
        await self.usecase.delete_referral(referral_id, profile.id)
        return response_factory.success(message="Referral deleted")
