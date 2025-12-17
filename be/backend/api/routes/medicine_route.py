
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.handlers.base import BaseHandler
from backend.api.middleware.auth import get_current_profile, require_pharmacy_access
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.database.session import get_db
from backend.module.medicine.entity.medicine_dto import (
    MedicineCreateDTO,
    MedicineDTO,
    MedicineUpdateDTO,
)
from backend.module.medicine.repositories.medicine_repository import MedicineRepository
from backend.module.medicine.usecases.medicine_usecase import MedicineUseCase
from backend.pkg.core.response import response_factory
from backend.pkg.core.response_models import ApiResponse, PaginatedApiResponse


class MedicineHandler(BaseHandler):
    def __init__(self, session: AsyncSession = Depends(get_db)):
        super().__init__(session)
        self.repository = MedicineRepository(session)
        self.usecase = MedicineUseCase(self.repository)

    async def create_medicine(self, req: MedicineCreateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.create_medicine(req)
        return response_factory.success(data=MedicineDTO.model_validate(result), message="Medicine created successfully")

    async def list_medicines(self, page: int = 1, limit: int = 10, search: str = None):
        medicines, total = await self.usecase.list_medicines(page, limit, search)
        return response_factory.success_list(
            data=[MedicineDTO.model_validate(m) for m in medicines],
            total=total,
            limit=limit,
            offset=(page - 1) * limit
        )

    async def get_medicine(self, medicine_id: UUID):
        result = await self.usecase.get_medicine(medicine_id)
        return response_factory.success(data=MedicineDTO.model_validate(result))

    async def update_medicine(self, medicine_id: UUID, req: MedicineUpdateDTO, profile: AuthenticatedProfile):
        result = await self.usecase.update_medicine(medicine_id, req)
        return response_factory.success(data=MedicineDTO.model_validate(result), message="Medicine updated successfully")

    async def delete_medicine(self, medicine_id: UUID, profile: AuthenticatedProfile):
        await self.usecase.delete_medicine(medicine_id)
        return response_factory.success(message="Medicine deleted successfully")


# Router
router = APIRouter(
    prefix="/medicines",
    tags=["Medicines"]
)


@router.post("", response_model=ApiResponse[MedicineDTO], dependencies=[Depends(require_pharmacy_access)])
async def create_medicine(
    req: MedicineCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicineHandler = Depends()
):
    """Create a new medicine. Admin or Pharmacy Staff only."""
    return await handler.create_medicine(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[MedicineDTO]])
async def list_medicines(
    page: int = 1,
    limit: int = 10,
    search: str = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicineHandler = Depends()
):
    """List medicines. Any authenticated user."""
    return await handler.list_medicines(page, limit, search)


@router.get("/{medicine_id}", response_model=ApiResponse[MedicineDTO])
async def get_medicine(
    medicine_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicineHandler = Depends()
):
    """Get a specific medicine. Any authenticated user."""
    return await handler.get_medicine(medicine_id)


@router.patch("/{medicine_id}", response_model=ApiResponse[MedicineDTO], dependencies=[Depends(require_pharmacy_access)])
async def update_medicine(
    medicine_id: UUID,
    req: MedicineUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicineHandler = Depends()
):
    """Update a medicine. Admin or Pharmacy Staff only."""
    return await handler.update_medicine(medicine_id, req, profile)


@router.delete("/{medicine_id}", response_model=ApiResponse, dependencies=[Depends(require_pharmacy_access)])
async def delete_medicine(
    medicine_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicineHandler = Depends()
):
    """Delete a medicine. Admin or Pharmacy Staff only."""
    return await handler.delete_medicine(medicine_id, profile)
