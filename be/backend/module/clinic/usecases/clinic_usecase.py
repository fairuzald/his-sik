
from uuid import UUID

from backend.module.clinic.entity.clinic import Clinic
from backend.module.clinic.entity.clinic_dto import ClinicCreateDTO, ClinicUpdateDTO
from backend.module.clinic.repositories.clinic_repository import ClinicRepository
from backend.pkg.core.exceptions import NotFoundException


class ClinicUseCase:
    def __init__(self, clinic_repository: ClinicRepository):
        self.clinic_repository = clinic_repository

    async def create_clinic(self, req: ClinicCreateDTO) -> Clinic:
        new_clinic = Clinic(
            name=req.name
        )
        return await self.clinic_repository.create(new_clinic)

    async def get_clinic(self, clinic_id: UUID) -> Clinic:
        clinic = await self.clinic_repository.get_by_id(clinic_id)
        if not clinic:
            raise NotFoundException(f"Clinic with id {clinic_id} not found")
        return clinic

    async def update_clinic(self, clinic_id: UUID, req: ClinicUpdateDTO) -> Clinic:
        clinic = await self.get_clinic(clinic_id)
        clinic.name = req.name
        return await self.clinic_repository.update(clinic)

    async def delete_clinic(self, clinic_id: UUID) -> None:
        clinic = await self.get_clinic(clinic_id)
        await self.clinic_repository.delete(clinic)

    async def list_clinics(self, page: int, limit: int, search: str = None) -> tuple[list[Clinic], int]:
        return await self.clinic_repository.list_clinics(page, limit, search)
