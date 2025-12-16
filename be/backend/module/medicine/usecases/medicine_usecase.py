
from uuid import UUID

from backend.module.medicine.entity.medicine import Medicine
from backend.module.medicine.entity.medicine_dto import (
    MedicineCreateDTO,
    MedicineUpdateDTO,
)
from backend.module.medicine.repositories.medicine_repository import MedicineRepository
from backend.pkg.core.exceptions import BusinessLogicException, NotFoundException


class MedicineUseCase:
    def __init__(self, repository: MedicineRepository):
        self.repository = repository

    async def create_medicine(self, req: MedicineCreateDTO) -> Medicine:
        """Create a medicine. Authorization handled by middleware."""
        existing = await self.repository.get_by_code(req.medicine_code)
        if existing:
            raise BusinessLogicException(f"Medicine with code {req.medicine_code} already exists")

        new_medicine = Medicine(
            medicine_code=req.medicine_code,
            medicine_name=req.medicine_name,
            unit=req.unit,
            unit_price=req.unit_price,
            is_active=req.is_active
        )
        return await self.repository.create(new_medicine)

    async def get_medicine(self, medicine_id: UUID) -> Medicine:
        """Get a single medicine by ID."""
        medicine = await self.repository.get_by_id(medicine_id)
        if not medicine:
            raise NotFoundException("Medicine not found")
        return medicine

    async def update_medicine(self, medicine_id: UUID, req: MedicineUpdateDTO) -> Medicine:
        """Update a medicine. Authorization handled by middleware."""
        medicine = await self.repository.get_by_id(medicine_id)
        if not medicine:
            raise NotFoundException("Medicine not found")

        if req.medicine_code:
            # Check unique if changed
            if req.medicine_code != medicine.medicine_code:
                existing = await self.repository.get_by_code(req.medicine_code)
                if existing:
                    raise BusinessLogicException(f"Medicine code {req.medicine_code} already exists")
            medicine.medicine_code = req.medicine_code

        if req.medicine_name:
            medicine.medicine_name = req.medicine_name
        if req.unit:
            medicine.unit = req.unit
        if req.unit_price is not None:
            medicine.unit_price = req.unit_price
        if req.is_active is not None:
            medicine.is_active = req.is_active

        return await self.repository.update(medicine)

    async def delete_medicine(self, medicine_id: UUID) -> None:
        """Delete a medicine. Authorization handled by middleware."""
        medicine = await self.repository.get_by_id(medicine_id)
        if not medicine:
            raise NotFoundException("Medicine not found")

        await self.repository.delete(medicine)

    async def list_medicines(self, page: int, limit: int, search: str = None) -> tuple[list[Medicine], int]:
        """List medicines. Any authenticated user can access."""
        return await self.repository.list_medicines(page, limit, search)
