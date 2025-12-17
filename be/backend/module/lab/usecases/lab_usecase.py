
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.common.enums import OrderStatusEnum, RoleEnum
from backend.module.lab.entity.lab import LabOrder, LabResult, LabTest
from backend.module.lab.entity.lab_dto import (
    LabOrderCreateDTO,
    LabOrderUpdateStatusDTO,
    LabTestCreateDTO,
    LabTestUpdateDTO,
)
from backend.module.lab.repositories.lab_repository import (
    LabOrderRepository,
    LabTestRepository,
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


class LabUseCase:
    def __init__(
        self,
        test_repository: LabTestRepository,
        order_repository: LabOrderRepository,
        visit_repository: VisitRepository,
        profile_repository: ProfileRepository
    ):
        self.test_repository = test_repository
        self.order_repository = order_repository
        self.visit_repository = visit_repository
        self.profile_repository = profile_repository

    # --- Lab Test Management ---

    async def create_lab_test(self, req: LabTestCreateDTO) -> LabTest:

        existing = await self.test_repository.get_by_code(req.test_code)
        if existing:
            raise BusinessLogicException(f"Lab test with code {req.test_code} already exists")

        lab_test = LabTest(**req.model_dump())
        return await self.test_repository.create(lab_test)

    async def list_lab_tests(
        self, page: int, limit: int, search: Optional[str] = None, category: Optional[str] = None
    ) -> Tuple[List[LabTest], int]:
        # Authenticated users (any) can list active tests
        return await self.test_repository.list_lab_tests(page, limit, search, category, is_active=True)

    async def get_lab_test(self, test_id: UUID) -> LabTest:
        lab_test = await self.test_repository.get_by_id(test_id)
        if not lab_test:
            raise NotFoundException("Lab test not found")
        return lab_test

    async def update_lab_test(self, test_id: UUID, req: LabTestUpdateDTO) -> LabTest:

        lab_test = await self.test_repository.get_by_id(test_id)
        if not lab_test:
             raise NotFoundException("Lab test not found")

        for key, value in req.model_dump(exclude_unset=True).items():
            setattr(lab_test, key, value)

        return await self.test_repository.update(lab_test)

    async def delete_lab_test(self, test_id: UUID) -> None:

        lab_test = await self.test_repository.get_by_id(test_id)
        if not lab_test:
             raise NotFoundException("Lab test not found")

        await self.test_repository.delete(lab_test)

    # --- Lab Order Management ---

    async def create_lab_order(
        self,
        req: LabOrderCreateDTO,
        user_id: UUID
    ) -> LabOrder:

        visit = await self.visit_repository.get_by_id(req.visit_id)
        if not visit:
             raise NotFoundException("Visit not found")

        if visit.doctor_id != user_id:
             # Need to verify if the user_id (User UUID) maps to visit.doctor_id (Doctor UUID)
             # NOTE: visit.doctor_id is DOCTOR TABLE ID. user_id is USER TABLE ID.
             doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
             if not doctor or visit.doctor_id != doctor.id:
                  raise AuthorizationException("You are not the doctor for this visit")

        lab_test = await self.test_repository.get_by_id(req.lab_test_id)
        if not lab_test:
             raise NotFoundException("Lab test not found")

        lab_order = LabOrder(
            visit_id=req.visit_id,
            doctor_id=doctor.id if doctor else req.doctor_user_id, # Wait, req doesn't have doctor_user_id, we just resolved 'doctor'
            # LabOrder likely stores doctor_id (Doctor UUID).
            # The original code: doctor_id=user_id was WRONG if user_id was User UUID.
            lab_test_id=req.lab_test_id,
            notes=req.notes,
            order_status=OrderStatusEnum.PENDING.value
        )

        return await self.order_repository.create(lab_order)

    async def list_lab_orders(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        status: Optional[str] = None,
        visit_id: Optional[UUID] = None
    ) -> Tuple[List[LabOrder], int]:
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
        # Staff see all

        return await self.order_repository.list_lab_orders(
            page=page, limit=limit, doctor_id=doctor_id, patient_id=patient_id, status=status, visit_id=visit_id
        )

    async def get_lab_order(self, order_id: UUID, user_id: UUID, role: str) -> LabOrder:
        order = await self.order_repository.get_by_id(order_id)
        if not order:
             raise NotFoundException("Lab order not found")

        if role == RoleEnum.DOCTOR.value:
             doctor = await self.profile_repository.get_doctor_by_user_id(user_id)
             if not doctor or order.doctor_id != doctor.id:
                  raise AuthorizationException("Unauthorized")
        elif role == RoleEnum.PATIENT.value:
             # Patient checks visit patient id
             patient = await self.profile_repository.get_patient_by_user_id(user_id)
             if not patient or order.visit.patient_id != patient.id:
                  raise AuthorizationException("Unauthorized")

        return order

    async def update_lab_order(
        self,
        order_id: UUID,
        req: LabOrderUpdateStatusDTO,
        user_id: UUID
    ) -> LabOrder:
        """
        Update lab order status and optionally attach a file result.
        """
        order = await self.order_repository.get_by_id(order_id)
        if not order:
            raise NotFoundException("Lab order not found")

        order.order_status = req.order_status
        
        # Get staff profile to set lab_staff_id (staff table ID, not user ID)
        staff = await self.profile_repository.get_staff_by_user_id(user_id)
        if staff:
            order.lab_staff_id = staff.id

        # Handle result data from request
        result_data = req.result.model_dump(exclude_unset=True) if req.result else {}

        # Create or update result if we have any result data
        if result_data:
            if order.result:
                # Update existing result
                for key, value in result_data.items():
                    if value is not None:
                        setattr(order.result, key, value)
            else:
                # Create new result
                order.result = LabResult(
                    lab_order_id=order.id,
                    result_value=result_data.get("result_value"),
                    result_unit=result_data.get("result_unit"),
                    interpretation=result_data.get("interpretation"),
                    attachment_url=result_data.get("attachment_url"),
                    attachment_type=result_data.get("attachment_type")
                )

        return await self.order_repository.update(order)
