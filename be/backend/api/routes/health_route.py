from backend.pkg.core.response import response_factory
from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return response_factory.success(message="Service is healthy")
