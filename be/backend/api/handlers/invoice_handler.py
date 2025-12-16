
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.invoice.entity.invoice_dto import (
    InvoiceCreateDTO,
    InvoiceDTO,
    InvoiceUpdateDTO,
)
from backend.module.invoice.repositories.invoice_repository import InvoiceRepository
from backend.module.invoice.usecases.invoice_usecase import InvoiceUseCase
from backend.module.lab.repositories.lab_repository import LabOrderRepository
from backend.module.prescription.repositories.prescription_repository import (
    PrescriptionRepository,
)
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.response import response_factory


class InvoiceHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = InvoiceRepository(session)
        self.visit_repo = VisitRepository(session)
        self.presc_repo = PrescriptionRepository(session)
        self.lab_repo = LabOrderRepository(session)
        self.usecase = InvoiceUseCase(self.repository, self.visit_repo, self.presc_repo, self.lab_repo)

    async def create_invoice(self, req: InvoiceCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_invoice(req, profile.id)
        return response_factory.success(data=InvoiceDTO.model_validate(result), message="Invoice created")

    async def list_invoices(self, profile: AuthenticatedProfile, page: int = 1, limit: int = 10):
        invoices, total = await self.usecase.list_invoices(page, limit, profile.id, profile.role)
        return response_factory.success_list(
            data=[InvoiceDTO.model_validate(i) for i in invoices],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_invoice(self, invoice_id: UUID, profile: AuthenticatedProfile):
        result = await self.usecase.get_invoice(invoice_id, profile.id, profile.role)
        return response_factory.success(data=InvoiceDTO.model_validate(result))

    async def update_invoice(self, invoice_id: UUID, req: InvoiceUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_invoice(invoice_id, req, profile.id)
        return response_factory.success(data=InvoiceDTO.model_validate(result), message="Invoice updated")

    async def delete_invoice(self, invoice_id: UUID):
        await self.usecase.delete_invoice(invoice_id)
        return response_factory.success(message="Invoice deleted")
