"""
Centralized exception handling system (single source of truth)

This module provides a unified set of exception classes used across the backend,
following the standardized error shape in backend.pkg.core.errors.HttpError
(code, message, success, errors: list[FieldError], and optional detail/context).
"""

import sys

from backend.pkg.core.errors import FieldError
from fastapi import status


class BaseAPIException(Exception):
    """Base exception class with standardized shape"""

    def __init__(
        self,
        message: str,
        code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        errors: list[FieldError] | None = None,
        error_context: Exception | None = None,
    ):
        self.message = message
        self.code = code
        self.success = False
        self.errors = errors
        self.error_context = error_context
        super().__init__(self.message)


class ValidationException(BaseAPIException):
    """Exception for validation errors"""

    def __init__(
        self,
        message: str = "Validation error",
        errors: list[FieldError] | None = None,
    ):
        super().__init__(
            message=message,
            code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            errors=errors,
        )


class AuthenticationException(BaseAPIException):
    """Exception for authentication errors"""

    def __init__(
        self,
        message: str = "Authentication failed",
    ):
        super().__init__(message=message, code=status.HTTP_401_UNAUTHORIZED)


class AuthorizationException(BaseAPIException):
    """Exception for authorization errors"""

    def __init__(
        self,
        message: str = "Access denied",
    ):
        super().__init__(message=message, code=status.HTTP_403_FORBIDDEN)


class NotFoundException(BaseAPIException):
    """Exception for resource not found errors"""

    def __init__(
        self,
        message: str = "Resource not found",
        tag: str = "not_found",
    ):
        errors = (
            [
                FieldError(field="tag", message=tag, tag=tag),
            ]
            if tag
            else None
        )
        super().__init__(
            message=message,
            code=status.HTTP_404_NOT_FOUND,
            errors=errors if errors else None,
        )


class BusinessLogicException(BaseAPIException):
    """Exception for business logic errors"""

    def __init__(
        self,
        message: str = "Business logic error",
    ):

        super().__init__(
            message=message,
            code=status.HTTP_400_BAD_REQUEST,
        )


class ExternalServiceException(BaseAPIException):
    """Exception for external service errors"""

    def __init__(
        self,
        message: str = "External service error",
        service_name: str | None = None,
    ):
        errors = (
            [
                FieldError(field="service_name", message=message, tag=service_name),
            ]
            if service_name
            else None
        )
        super().__init__(
            message=message,
            code=status.HTTP_502_BAD_GATEWAY,
            errors=errors if errors else None,
        )


class DatabaseException(BaseAPIException):
    """Exception for database errors"""

    def __init__(
        self,
        message: str = "Database error",
        operation: str | None = None,
        table: str | None = None,
    ):
        errors = []
        # capture original exception
        exc = sys.exc_info()[1]
        if operation and table:
            errors.append(
                FieldError(
                    field="operation",
                    message=f"Database operation: {operation}",
                    tag=table,
                )
            )
        elif operation:
            errors.append(
                FieldError(
                    field="operation",
                    message=f"Database operation: {operation}",
                    tag=operation,
                )
            )
        if table:
            errors.append(
                FieldError(
                    field="table", message=f"Affected table: {table}", tag="db_table"
                )
            )

        if exc is not None:
            original_msg = str(exc) or exc.__class__.__name__
            errors.append(
                FieldError(
                    field="exception",
                    message=original_msg,
                    tag=exc.__class__.__name__,
                )
            )

        super().__init__(
            message=message,
            code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            errors=errors if errors else None,
            error_context=exc if isinstance(exc, Exception) else None,
        )


class RateLimitException(BaseAPIException):
    """Exception for rate limit errors"""

    def __init__(
        self,
        message: str = "Rate limit exceeded",
    ):
        super().__init__(
            message=message,
            code=status.HTTP_429_TOO_MANY_REQUESTS,
        )


class CacheException(BaseAPIException):
    """Cache operation error exception"""

    def __init__(
        self,
        message: str = "Cache operation failed",
    ):
        exc = sys.exc_info()[1]
        if exc is not None:
            original_msg = str(exc) or exc.__class__.__name__
            if original_msg not in message:
                message = f"{message}: {original_msg}"
        super().__init__(
            message=message,
            code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_context=exc if isinstance(exc, Exception) else None,
        )


class StorageException(BaseAPIException):
    """File storage error exception"""

    def __init__(
        self,
        message: str = "Storage operation failed",
    ):
        exc = sys.exc_info()[1]
        if exc is not None:
            original_msg = str(exc) or exc.__class__.__name__
            if original_msg not in message:
                message = f"{message}: {original_msg}"
        super().__init__(
            message=message,
            code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_context=exc if isinstance(exc, Exception) else None,
        )


class LegalyBaseException(BaseAPIException):
    pass
