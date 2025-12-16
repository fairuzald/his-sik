import time
import uuid
from collections.abc import Awaitable, Callable

from fastapi import HTTPException, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from backend.infrastructure.logging.logger import (
    clear_request_context,
    get_logger,
    set_request_context,
)
from backend.infrastructure.security.hmac_utils import decode_access_token

logger = get_logger(__name__)


class RequestMiddleware(BaseHTTPMiddleware):
    """Unified middleware for request context, tracing, and logging"""

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Generate or extract request ID
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

        # Parse authorization header for user context
        user_id = None
        role = None
        authorization = request.headers.get("authorization")
        if authorization:
            token = authorization
            if token.lower().startswith("bearer "):
                token = token[7:].strip()
            if token:
                try:
                    # Using existing decode_access_token util instead of JWTService class
                    payload = decode_access_token(token)
                    user_id = payload.get("sub")
                    role = payload.get("role")
                except Exception:
                    # logger.warning(f"JWT decode failed: {e}")
                    pass

        # Set logging context
        set_request_context(
            request_id=request_id, user_id=str(user_id) if user_id else None
        )

        # Add to request state
        request.state.request_id = request_id
        request.state.start_time = time.time()
        if user_id:
            request.state.user_id = str(user_id)
        if role:
            request.state.role = str(role)

        # Log request start with Dozzle-style structured format
        logger.info(
            f"Request: {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "user_id": user_id,
                "method": request.method,
                "path": request.url.path,
                "remote_ip": request.client.host if request.client else None,
                "host": request.headers.get("host", "unknown"),
                "user_agent": request.headers.get("user-agent", "unknown"),
                "request": f"{request.method} {request.url.path}",
            },
        )

        try:
            response = await call_next(request)

            # Calculate duration
            duration = time.time() - request.state.start_time

            # Add response headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration:.3f}s"

            # Log completion with Dozzle-style structured format
            latency_ms = duration * 1000  # Convert to milliseconds
            response_size = response.headers.get("content-length", 0)

            # Determine log level based on status code
            if response.status_code >= 500:
                log_level = "error"
            elif response.status_code >= 400:
                log_level = "warn"
            else:
                log_level = "info"

            # Create structured log entry
            log_entry = {
                "request_id": request_id,
                "user_id": user_id,
                "remote_ip": request.client.host if request.client else None,
                "latency": f"{latency_ms:.3f}ms",
                "host": request.headers.get("host", "unknown"),
                "request": f"{request.method} {request.url.path}",
                "status": response.status_code,
                "size": int(response_size) if response_size else 0,
                "user_agent": request.headers.get("user-agent", "unknown"),
            }

            # Log with appropriate level
            if log_level == "error":
                logger.error("Server error", extra=log_entry)
            elif log_level == "warn":
                logger.warning("Client error", extra=log_entry)
            else:
                 # Just standard info log is usually generic, but can add if needed.
                 # The user code sample seemed to rely on the 'Request: ...' log for info.
                 # But logging completion is good practice.
                 logger.info("Request completed", extra=log_entry)

            # Log slow requests
            if duration > 1.0:
                logger.warning(
                    f"Slow request: {request.method} {request.url.path} ({duration:.3f}s)",
                    extra={
                        "request_id": request_id,
                        "duration_seconds": duration,
                        "slow_request": True,
                    },
                )

            return response

        except Exception as exc:
            duration = time.time() - request.state.start_time
            latency_ms = duration * 1000  # Convert to milliseconds

            # Create structured error log entry
            status_code = 500
            if isinstance(exc, HTTPException):
                status_code = exc.status_code
            error_log_entry = {
                "request_id": request_id,
                "user_id": user_id,
                "remote_ip": request.client.host if request.client else None,
                "latency": f"{latency_ms:.3f}ms",
                "host": request.headers.get("host", "unknown"),
                "request": f"{request.method} {request.url.path}",
                "status": status_code,
                "size": 0,
                "user_agent": request.headers.get("user-agent", "unknown"),
                "error": f"code=500, message={str(exc)}",
                "error_type": type(exc).__name__,
            }

            if 400 <= status_code < 500:
                logger.warning(
                    f"Client error: {exc}", extra=error_log_entry, exc_info=False
                )
            else:
                logger.error(
                    f"Server error: {exc}", extra=error_log_entry, exc_info=True
                )
            raise
        finally:
            clear_request_context()

request_middleware = RequestMiddleware
