
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.wearable_handler import WearableHandler
from backend.api.middleware.auth import get_current_profile, require_patient
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.wearable.entity.wearable_dto import (
    WearableDeviceCreateDTO,
    WearableDeviceDTO,
    WearableDeviceUpdateDTO,
    WearableMeasurementCreateDTO,
    WearableMeasurementDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/wearables",
    tags=["Wearables"]
)


@router.post("/devices", response_model=ApiResponse[WearableDeviceDTO], dependencies=[Depends(require_patient)])
async def create_device(
    req: WearableDeviceCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Register a wearable device. Patient only."""
    return await handler.create_device(req, profile)


@router.get("/devices", response_model=PaginatedApiResponse[List[WearableDeviceDTO]])
async def list_devices(
    page: int = 1,
    limit: int = 10,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """List wearable devices. Filtered by ownership."""
    return await handler.list_devices(profile, page, limit)


@router.get("/devices/{device_id}", response_model=ApiResponse[WearableDeviceDTO])
async def get_device(
    device_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Get a specific device. Authorized by ownership."""
    return await handler.get_device(device_id, profile)


@router.put("/devices/{device_id}", response_model=ApiResponse[WearableDeviceDTO], dependencies=[Depends(require_patient)])
async def update_device(
    device_id: UUID,
    req: WearableDeviceUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Update a wearable device. Patient only."""
    return await handler.update_device(device_id, req, profile)


@router.delete("/devices/{device_id}", response_model=ApiResponse, dependencies=[Depends(require_patient)])
async def delete_device(
    device_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Delete a wearable device. Patient only."""
    return await handler.delete_device(device_id, profile)


@router.post("/devices/{device_id}/measurements", response_model=ApiResponse[WearableMeasurementDTO], dependencies=[Depends(require_patient)])
async def add_measurement(
    device_id: UUID,
    req: WearableMeasurementCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """Add a measurement from device. Patient only."""
    return await handler.add_measurement(device_id, req, profile)


@router.get("/devices/{device_id}/measurements", response_model=PaginatedApiResponse[List[WearableMeasurementDTO]])
async def list_measurements(
    device_id: UUID,
    page: int = 1,
    limit: int = 10,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: WearableHandler = Depends()
):
    """List measurements for a device. Authorized by ownership."""
    return await handler.list_measurements(device_id, profile, page, limit, date_from, date_to)
