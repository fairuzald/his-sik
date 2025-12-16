"""
Standardized API response utilities
"""

from dataclasses import dataclass
from typing import Any, TypeVar

from backend.pkg.core.errors import FieldError, new_from_field_errors
from backend.pkg.core.response_models import (
    ApiResponse,
    ErrorResponse,
    PaginatedApiResponse,
    PaginationMetaModel,
)
from fastapi import Response, status

T = TypeVar("T")


@dataclass
class PaginationMeta:
    """Pagination metadata"""

    limit: int
    total: int
    total_page: int
    current_page: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "limit": self.limit,
            "total": self.total,
            "totalPage": self.total_page,
            "currentPage": self.current_page,
        }


class ResponseFactory:
    """Standardized response factory"""

    def success(
        self,
        data: T | None = None,
        message: str | None = None,
        code: int = status.HTTP_200_OK,
        response: Response | None = None,
    ) -> ApiResponse[T]:
        """Create typed success response envelope without meta"""
        if response is not None and hasattr(response, "status_code"):
            response.status_code = code
        final_message = message if message is not None else "OK"
        return ApiResponse[T](success=True, data=data, message=final_message)

    def success_paginated(
        self,
        data: T | None = None,
        message: str | None = None,
        meta: PaginationMetaModel | dict[str, Any] | None = None,
        code: int = status.HTTP_200_OK,
        response: Response | None = None,
    ) -> PaginatedApiResponse[T]:
        """Create typed success response envelope with meta"""
        if response is not None and hasattr(response, "status_code"):
            response.status_code = code
        if meta is None:
            meta = {}
        final_message = message if message is not None else "OK"
        return PaginatedApiResponse[T](
            success=True, data=data, message=final_message, meta=meta
        )

    def success_list(
        self,
        data: list[Any] | None = None,
        message: str | None = None,
        limit: int = 100,
        offset: int = 0,
        total: int | None = None,
        code: int = status.HTTP_200_OK,
        response: Response | None = None,
    ) -> PaginatedApiResponse[list[Any]]:
        """Create paginated response for list data automatically"""
        if response is not None and hasattr(response, "status_code"):
            response.status_code = code

        # Calculate pagination metadata
        if data is None:
            data = []

        if total is None:
            total = len(data)

        current_page = (offset // limit) + 1 if limit > 0 else 1
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        if total_pages < 1:
            total_pages = 1
        if current_page > total_pages:
            current_page = total_pages

        meta = PaginationMetaModel(
            limit=limit,
            total=total,
            total_page=total_pages,
            current_page=current_page,
        )

        final_message = message if message is not None else f"Found {len(data)} item(s)"

        return PaginatedApiResponse[list[Any]](
            success=True, data=data, message=final_message, meta=meta
        )

    def error(
        self,
        code: int = status.HTTP_400_BAD_REQUEST,
        message: str = "An error occurred",
        errors: list[FieldError] | None = None,
        response: Any | None = None,
    ) -> ErrorResponse:
        """Error response standard"""
        if response is not None and hasattr(response, "status_code"):
            response.status_code = code
        return ErrorResponse(
            success=False,
            message=message,
            errors=errors,
            data=None,
        )

    def validation_error(
        self, field_errors: list[dict[str, str]], response: Response | None = None
    ) -> ErrorResponse:
        """Typed validation error as ErrorResponse with message summarizing issues"""
        errors = [
            FieldError(field=fe["field"], message=fe["message"], tag=fe.get("tag", ""))
            for fe in field_errors
        ]
        http_error = new_from_field_errors(errors)
        if response is not None and hasattr(response, "status_code"):
            try:
                response.status_code = http_error.code
            except Exception:
                pass
        return ErrorResponse(
            success=False,
            message=http_error.message,
            errors=errors,
            data=None,
        )


response_factory = ResponseFactory()
