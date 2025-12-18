
from datetime import datetime
from typing import List, Optional, Tuple
from uuid import UUID

from backend.module.common.enums import RoleEnum
from backend.module.wearable.entity.wearable import WearableMeasurement
from backend.module.wearable.entity.wearable_dto import (
    WearableMeasurementCreateDTO,
)
from backend.module.wearable.repositories.wearable_repository import WearableRepository
from backend.pkg.core.exceptions import (
    AuthorizationException,
)


class WearableUseCase:
    def __init__(self, repository: WearableRepository):
        self.repository = repository

    async def add_measurement(self, req: WearableMeasurementCreateDTO, user_id: UUID, role: str) -> WearableMeasurement:
        if role != RoleEnum.PATIENT.value and role != RoleEnum.DOCTOR.value:
             # Assuming purely manual entry or system.
             # If role is patient, user_id is the patient.
             pass

        target_patient_id = user_id
        # TODO: If Doctor adds measurement for patient, we need patient_id in request or params.
        # For now, let's assume this endpoint is "Add MY measurement" for Patient.
        if role == RoleEnum.DOCTOR.value:
             raise AuthorizationException("Doctors cannot add wearable measurements via this endpoint yet.") # Simplify for now

        measurement = WearableMeasurement(
            patient_id=target_patient_id,
            recorded_at=req.recorded_at,
            heart_rate=req.heart_rate,
            body_temperature=req.body_temperature,
            spo2=req.spo2
        )
        return await self.repository.create_measurement(measurement)

    async def list_measurements(
        self,
        page: int,
        limit: int,
        user_id: UUID,
        role: str,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        patient_id_param: Optional[UUID] = None
    ) -> Tuple[List[WearableMeasurement], int]:

        target_patient_id = user_id

        if role == RoleEnum.PATIENT.value:
             target_patient_id = user_id
        elif role == RoleEnum.DOCTOR.value:
             if patient_id_param:
                  target_patient_id = patient_id_param
             else:
                  # If Doctor queries without patient_id, usually error or invalid.
                  # But `user_id` is doctor's ID.
                  # Let's enforce patient_id_param for Doctors.
                  if not patient_id_param:
                       raise AuthorizationException("Doctor must specify patient_id")
                  target_patient_id = patient_id_param

        return await self.repository.list_measurements(target_patient_id, page, limit, date_from, date_to)
