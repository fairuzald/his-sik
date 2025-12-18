
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.wearable_handler import WearableHandler
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


@router.post("/measurements", response_model=ApiResponse[WearableMeasurementDTO])
async def add_measurement(
    req: WearableMeasurementCreateDTO,
    handler: WearableHandler = Depends()
):
    """Add a measurement using device API key. Public endpoint."""
    return await handler.add_measurement(req)


@router.get("/measurements", response_model=PaginatedApiResponse[List[WearableMeasurementDTO]])
async def list_measurements(
    page: int = 1,
    limit: int = 10,
    device_api_key: Optional[UUID] = None,
    patient_id: Optional[UUID] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    handler: WearableHandler = Depends()
):
    """
    List measurements.
    Either device_api_key OR patient_id must be provided.
    - device_api_key: for public API (IoT devices)
    - patient_id: for authenticated users (doctors, staff)
    """
    return await handler.list_measurements(page, limit, device_api_key, patient_id, date_from, date_to)
