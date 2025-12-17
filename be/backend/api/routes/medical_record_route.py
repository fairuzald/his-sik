from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from backend.api.handlers.medical_record_handler import MedicalRecordHandler
from backend.api.middleware.auth import (
    get_current_profile,
    require_admin_or_doctor,
    require_doctor,
)
from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.module.medical_record.entity.medical_record_dto import (
    MedicalRecordCreateDTO,
    MedicalRecordDTO,
    MedicalRecordUpdateDTO,
)
from backend.pkg.core.response import ApiResponse
from backend.pkg.core.response_models import PaginatedApiResponse

router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"]
)


@router.post("", response_model=ApiResponse[MedicalRecordDTO], dependencies=[Depends(require_doctor)])
async def create_medical_record(
    req: MedicalRecordCreateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicalRecordHandler = Depends()
):
    """Create a medical record. Doctor only."""
    return await handler.create_medical_record(req, profile)


@router.get("", response_model=PaginatedApiResponse[List[MedicalRecordDTO]])
async def list_medical_records(
    page: int = 1,
    limit: int = 10,
    patient_id: Optional[UUID] = None,
    doctor_id: Optional[UUID] = None,
    visit_id: Optional[UUID] = None,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicalRecordHandler = Depends()
):
    """List medical records. Filtered by role."""
    return await handler.list_medical_records(profile, page, limit, patient_id, doctor_id, visit_id)


@router.get("/{record_id}", response_model=ApiResponse[MedicalRecordDTO])
async def get_medical_record(
    record_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicalRecordHandler = Depends()
):
    """Get a specific medical record. Authorized by ownership."""
    return await handler.get_medical_record(record_id, profile)


@router.patch("/{record_id}", response_model=ApiResponse[MedicalRecordDTO], dependencies=[Depends(require_doctor)])
async def update_medical_record(
    record_id: UUID,
    req: MedicalRecordUpdateDTO,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicalRecordHandler = Depends()
):
    """Update a medical record. Doctor only."""
    return await handler.update_medical_record(record_id, req, profile)


@router.delete("/{record_id}", response_model=ApiResponse, dependencies=[Depends(require_admin_or_doctor)])
async def delete_medical_record(
    record_id: UUID,
    profile: AuthenticatedProfile = Depends(get_current_profile),
    handler: MedicalRecordHandler = Depends()
):
    """Delete a medical record. Admin or Doctor only."""
    return await handler.delete_medical_record(record_id, profile)
