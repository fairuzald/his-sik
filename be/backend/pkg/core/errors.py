"""
Standardized error handling system with flexible detail support
"""

from typing import Any

from backend.infrastructure.logging.logger import get_logger
from fastapi import status
from pydantic import BaseModel
from pydantic import Field as PydField


class FieldError(BaseModel):
    """field validation error"""

    field: str
    message: str
    tag: str
    details: dict[str, Any] = PydField(default_factory=dict)


class HttpError:
    """Standardized HTTP error response"""

    def __init__(
        self,
        code: int,
        message: str,
        success: bool = False,
        errors: list[FieldError] | None = None,
        error_context: Exception | None = None,
    ):
        self.code = code
        self.message = message
        self.success = success
        self.errors = errors
        self.error_context = error_context

    def log(self) -> None:
        """Log the error with context"""
        logger = get_logger(__name__)
        log_data = {
            "http_code": self.code,
            "message": self.message,
        }

        if self.error_context:
            log_data.update(
                {
                    "error": str(self.error_context),
                    "error_type": type(self.error_context).__name__,
                }
            )

        logger.error("An error occurred", extra=log_data)

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for JSON response"""
        result = {
            "message": self.message,
            "code": self.code,
            "success": self.success,
        }

        if self.errors:
            result["errors"] = [
                {
                    "field": error.field,
                    "message": error.message,
                    "tag": error.tag,
                    **error.details,
                }
                for error in self.errors
            ]

        return result


def new_from_field_errors(
    errors: list[FieldError],
    code: int = status.HTTP_422_UNPROCESSABLE_ENTITY,
    message: str = "Input validation error",
) -> HttpError:
    """Create HttpError from a list of FieldError objects"""
    return HttpError(code=code, message=message, success=False, errors=errors)
