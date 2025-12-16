from typing import Any, Generic, TypeVar

from backend.pkg.core.errors import FieldError
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMetaModel(BaseModel):
    limit: int
    total: int
    total_page: int
    current_page: int


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = Field(default=None)
    message: str | None = None


class ErrorResponse(ApiResponse[None]):
    success: bool
    errors: list[FieldError] | None = None


class NotFoundResponse(ApiResponse[None]):
    """Response model for 404 Not Found errors"""

    success: bool = Field(default=False)
    message: str = Field(default="Resource not found")
    errors: list[FieldError] | None = None


class UnauthorizedResponse(ApiResponse[None]):
    """Response model for 401 Unauthorized errors"""

    success: bool = Field(default=False)
    message: str = Field(default="Unauthorized")
    errors: list[FieldError] | None = None


class ForbiddenResponse(ApiResponse[None]):
    """Response model for 403 Forbidden errors"""

    success: bool = Field(default=False)
    message: str = Field(default="Forbidden")
    errors: list[FieldError] | None = None


class BadRequestResponse(ApiResponse[None]):
    """Response model for 400 Bad Request errors"""

    success: bool = Field(default=False)
    message: str = Field(default="Bad Request")
    errors: list[FieldError] | None = None


class PaginatedApiResponse(ApiResponse[T], Generic[T]):
    meta: PaginationMetaModel | dict[str, Any]
