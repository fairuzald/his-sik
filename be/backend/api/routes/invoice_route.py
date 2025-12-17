
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.invoice_handler import InvoiceHandler
from backend.api.middleware.auth import get_current_profile, require_cashier_access
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.invoice.entity.invoice_dto import (
    InvoiceCreateDTO,
    InvoiceDTO,
    InvoiceUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)


@router.post("", response_model=ApiResponse[InvoiceDTO], dependencies=[Depends(require_cashier_access)])
async def create_invoice(
    req: InvoiceCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: InvoiceHandler = Depends()
):
    """Create a new invoice. Admin or Cashier Staff only."""
    return await handler.create_invoice(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[InvoiceDTO]])
async def list_invoices(
    page: int = 1,
    limit: int = 10,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: InvoiceHandler = Depends()
):
    """List invoices. Filtered by role (Patient sees own, Staff sees all)."""
    return await handler.list_invoices(profile, page, limit)


@router.get("/{invoice_id}", response_model=ApiResponse[InvoiceDTO])
async def get_invoice(
    invoice_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: InvoiceHandler = Depends()
):
    """Get a specific invoice. Authorized by ownership."""
    return await handler.get_invoice(invoice_id, profile)


@router.patch("/{invoice_id}", response_model=ApiResponse[InvoiceDTO], dependencies=[Depends(require_cashier_access)])
async def update_invoice(
    invoice_id: UUID,
    req: InvoiceUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: InvoiceHandler = Depends()
):
    """Update an invoice. Admin or Cashier Staff only."""
    return await handler.update_invoice(invoice_id, req, profile)


@router.delete("/{invoice_id}", response_model=ApiResponse, dependencies=[Depends(require_cashier_access)])
async def delete_invoice(
    invoice_id: UUID,
    handler: InvoiceHandler = Depends()
):
    """Delete an invoice. Admin or Cashier Staff only."""
    return await handler.delete_invoice(invoice_id)
