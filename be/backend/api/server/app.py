from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.middleware.request_middleware import request_middleware
from backend.api.middleware.security_middleware import SecurityMiddleware
from backend.api.routes.router import api_router
from backend.infrastructure.config.settings import settings
from backend.pkg.core.exceptions import BaseAPIException
from backend.pkg.core.response import response_factory
from backend.pkg.core.response_models import ErrorResponse


def get_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        responses={
            422: {
                "model": ErrorResponse,
                "description": "Validation Error"
            }
        }
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom Middleware
    app.add_middleware(request_middleware)
    app.add_middleware(SecurityMiddleware)

    # Router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Exception Handlers
    @app.exception_handler(BaseAPIException)
    async def api_exception_handler(request: Request, exc: BaseAPIException):
        return JSONResponse(
            status_code=exc.code,
            content=response_factory.error(
                code=exc.code,
                message=exc.message,
                errors=exc.errors
            ).model_dump(exclude_none=True)
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        # Always expose the error for now for debugging
        return JSONResponse(
            status_code=500,
            content=response_factory.error(
                code=500,
                message=f"Internal Server Error: {str(exc)}"
            ).model_dump(exclude_none=True)
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        field_errors = []
        for error in exc.errors():
            # Get location (e.g., ["body", "username"] -> "username")
            loc = error.get("loc", [])
            field = str(loc[-1]) if loc else "unknown"

            # Create field error dict
            field_errors.append({
                "field": field,
                "message": error.get("msg", "Invalid value"),
                "tag": error.get("type", "validation_error")
            })

        return JSONResponse(
            status_code=422,
            content=response_factory.validation_error(
                field_errors=field_errors
            ).model_dump(exclude_none=True)
        )

    return app


app = get_application()
