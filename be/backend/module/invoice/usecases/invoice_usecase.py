
from typing import List, Tuple
from uuid import UUID

from backend.module.common.enums import (
    InvoiceItemTypeEnum,
    PaymentStatusEnum,
    RoleEnum,
)
from backend.module.invoice.entity.invoice import Invoice, InvoiceItem
from backend.module.invoice.entity.invoice_dto import (
    InvoiceCreateDTO,
    InvoiceUpdateDTO,
)
from backend.module.invoice.repositories.invoice_repository import InvoiceRepository
from backend.module.lab.repositories.lab_repository import LabOrderRepository
from backend.module.prescription.repositories.prescription_repository import (
    PrescriptionRepository,
)
from backend.module.visit.repositories.visit_repository import VisitRepository
from backend.pkg.core.exceptions import (
    AuthorizationException,
    BusinessLogicException,
    NotFoundException,
)


class InvoiceUseCase:
    def __init__(
        self,
        repository: InvoiceRepository,
        visit_repository: VisitRepository,
        prescription_repository: PrescriptionRepository,
        lab_order_repository: LabOrderRepository
    ):
        self.repository = repository
        self.visit_repository = visit_repository
        self.prescription_repository = prescription_repository
        self.lab_order_repository = lab_order_repository

    async def create_invoice(self, req: InvoiceCreateDTO, user_id: UUID) -> Invoice:
        """Create invoice. Authorization handled by middleware."""
        # Check existing
        existing = await self.repository.get_by_visit_id(req.visit_id)
        if existing:
            raise BusinessLogicException("Invoice already exists for this visit")

        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
            raise NotFoundException("Visit not found")

        invoice = Invoice(
            visit_id=req.visit_id,
            cashier_id=user_id,
            notes=req.notes,
            payment_status=PaymentStatusEnum.UNPAID.value
        )

        generated_items = []

        # Auto-process logic if no manual items provided
        if not req.items:
            # 1. Consultation Fee
            consultation_fee = 50000
            consultation_item = InvoiceItem(
                item_type=InvoiceItemTypeEnum.CONSULTATION.value,
                description="Consultation Fee",
                quantity=1,
                unit_price=consultation_fee,
                subtotal=consultation_fee
            )
            generated_items.append(consultation_item)

            # 2. Prescriptions
            prescription = await self.prescription_repository.get_by_visit_id(req.visit_id)
            if prescription:
                for p_item in prescription.items:
                    price = float(p_item.medicine.unit_price) if p_item.medicine else 0
                    sub = price * p_item.quantity
                    inv_item = InvoiceItem(
                        item_type=InvoiceItemTypeEnum.MEDICINE.value,
                        description=f"{p_item.medicine.medicine_name} ({p_item.dosage})",
                        quantity=p_item.quantity,
                        unit_price=price,
                        subtotal=sub
                    )
                    generated_items.append(inv_item)

            # 3. Lab Orders
            lab_orders, _ = await self.lab_order_repository.list_lab_orders(page=1, limit=100, visit_id=req.visit_id)
            for order in lab_orders:
                price = float(order.lab_test.price) if order.lab_test else 0
                inv_item = InvoiceItem(
                    item_type=InvoiceItemTypeEnum.LAB.value,
                    description=f"{order.lab_test.test_name}",
                    quantity=1,
                    unit_price=price,
                    subtotal=price
                )
                generated_items.append(inv_item)

        else:
            # Use provided items
            for item_dto in req.items:
                sub = float(item_dto.unit_price) * item_dto.quantity
                inv_item = InvoiceItem(
                    item_type=item_dto.item_type,
                    description=item_dto.description,
                    quantity=item_dto.quantity,
                    unit_price=item_dto.unit_price,
                    subtotal=sub
                )
                generated_items.append(inv_item)

        for item in generated_items:
            invoice.items.append(item)

        invoice.total_amount = sum(float(i.subtotal) for i in generated_items)

        return await self.repository.create(invoice)

    async def list_invoices(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str
    ) -> Tuple[List[Invoice], int]:
        """List invoices with ownership filter for patients."""
        patient_id = None

        if role == RoleEnum.PATIENT.value:
            patient_id = user_id
        # Admin/Staff see all

        return await self.repository.list_invoices(
            page=page, limit=limit, patient_id=patient_id
        )

    async def get_invoice(self, invoice_id: UUID, user_id: UUID, role: str) -> Invoice:
        """Get invoice with ownership check for patients."""
        invoice = await self.repository.get_by_id(invoice_id)
        if not invoice:
            raise NotFoundException("Invoice not found")

        if role == RoleEnum.PATIENT.value:
            if invoice.visit.patient_id != user_id:
                raise AuthorizationException("Unauthorized")

        return invoice

    async def update_invoice(self, invoice_id: UUID, req: InvoiceUpdateDTO, user_id: UUID) -> Invoice:
        """Update invoice. Authorization handled by middleware."""
        invoice = await self.repository.get_by_id(invoice_id)
        if not invoice:
            raise NotFoundException("Invoice not found")

        # Update fields
        if req.payment_status:
            invoice.payment_status = req.payment_status
        if req.payment_method:
            invoice.payment_method = req.payment_method
        if req.amount_paid is not None:
            invoice.amount_paid = req.amount_paid
        if req.notes is not None:
            invoice.notes = req.notes

        # If items updated (Re-calc total)
        if req.items:
            invoice.items.clear()
            new_total = 0
            for item_dto in req.items:
                sub = float(item_dto.unit_price) * item_dto.quantity
                inv_item = InvoiceItem(
                    item_type=item_dto.item_type,
                    description=item_dto.description,
                    quantity=item_dto.quantity,
                    unit_price=item_dto.unit_price,
                    subtotal=sub
                )
                invoice.items.append(inv_item)
                new_total += sub
            invoice.total_amount = new_total

        if req.total_amount is not None and not req.items:
            invoice.total_amount = req.total_amount

        return await self.repository.update(invoice)

    async def delete_invoice(self, invoice_id: UUID) -> None:
        """Delete invoice. Authorization handled by middleware."""
        invoice = await self.repository.get_by_id(invoice_id)
        if not invoice:
            raise NotFoundException("Invoice not found")

        await self.repository.delete(invoice)
