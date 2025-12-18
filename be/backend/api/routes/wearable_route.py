
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.wearable_handler import WearableHandler
from backend.api.middleware.auth import get_current_profile, require_patient
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.wearable.entity.wearable_dto import (
    WearableMeasurementCreateDTO,
    WearableMeasurementDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/wearables",
    tags=["Wearables"]
)


@router.post("/measurements", response_model=ApiResponse[WearableMeasurementDTO], dependencies=[Depends(require_patient)])
async def add_measurement(
    req: WearableMeasurementCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Add a measurement. Patient only."""
    return await handler.add_measurement(req, profile)


@router.get("/measurements", response_model=PaginatedApiResponse[List[WearableMeasurementDTO]])
async def list_measurements(
    page: int = 1,
    limit: int = 10,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    patient_id: Optional[UUID] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """List measurements. Authorized by ownership."""
    return await handler.list_measurements(profile, page, limit, date_from, date_to, patient_id)
