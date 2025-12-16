
from typing import Optional
from uuid import UUID

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.middleware.auth_dto import AuthenticatedProfile
from backend.infrastructure.config.settings import settings
from backend.infrastructure.database.session import get_db
from backend.infrastructure.security.hmac_utils import decode_access_token
from backend.module.common.enums import RoleEnum, StaffDepartmentEnum
from backend.module.user.entity.user import User
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.exceptions import AuthenticationException, AuthorizationException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


# =============================================================================
# Core Authentication
# =============================================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_db),
) -> User:
    """Extracts and validates the current user from the JWT token."""
    payload = decode_access_token(token)
    if payload is None:
        raise AuthenticationException("Could not validate credentials")

    user_id: str = payload.get("sub")
    if user_id is None:
        raise AuthenticationException("Could not validate credentials")

    # Check session validity
    from backend.module.session.repositories.session_repository import SessionRepository
    session_repo = SessionRepository(session)
    user_session = await session_repo.get_session_by_access_token(token)
    if not user_session:
        raise AuthenticationException("Session expired or invalid")

    repository = UserRepository(session)
    user = await repository.get_user_by_id(user_id)
    if not user:
        raise AuthenticationException("User not found")

    if not user.is_active:
        raise AuthenticationException("User is inactive")

    return user


async def get_current_profile(
    token: str = Depends(oauth2_scheme),
    user: User = Depends(get_current_user),
) -> AuthenticatedProfile:
    """
    Dependency to get the current user's profile context.
    Reads profile_id and department directly from JWT token - no additional DB query needed.
    """
    payload = decode_access_token(token)
    if payload is None:
        raise AuthenticationException("Could not validate credentials")

    role = payload.get("role", "")
    profile_id_str = payload.get("profile_id")
    department = payload.get("department")

    # Parse profile_id
    profile_id = UUID(profile_id_str) if profile_id_str else user.id

    return AuthenticatedProfile(
        id=profile_id,
        role=role,
        user_id=user.id,
        department=department
    )


# =============================================================================
# Authorization Checkers (Middleware Dependencies)
# =============================================================================

class RoleChecker:
    """
    Role-based authorization checker.
    Usage: dependencies=[Depends(RoleChecker([RoleEnum.ADMIN.value, RoleEnum.STAFF.value]))]
    """
    def __init__(self, allowed_roles: str | list[str]):
        if isinstance(allowed_roles, str):
            self.allowed_roles = [allowed_roles]
        else:
            self.allowed_roles = allowed_roles

    async def __call__(self, user: User = Depends(get_current_user)) -> User:
        if user.role.value not in self.allowed_roles:
            raise AuthorizationException(
                f"Role '{user.role.value}' is not authorized. Required: {self.allowed_roles}"
            )
        return user


class DepartmentChecker:
    """
    Department-based authorization checker for Staff members.
    Non-staff roles will be rejected unless allow_other_roles is True.
    Usage: dependencies=[Depends(DepartmentChecker([StaffDepartmentEnum.PHARMACY.value]))]
    """
    def __init__(
        self,
        allowed_departments: str | list[str],
        allow_other_roles: Optional[list[str]] = None
    ):
        if isinstance(allowed_departments, str):
            self.allowed_departments = [allowed_departments]
        else:
            self.allowed_departments = allowed_departments
        self.allow_other_roles = allow_other_roles or []

    async def __call__(
        self,
        profile: AuthenticatedProfile = Depends(get_current_profile)
    ) -> AuthenticatedProfile:
        # Allow other roles to pass through if configured
        if profile.role in self.allow_other_roles:
            return profile

        # Must be staff for department check
        if profile.role != RoleEnum.STAFF.value:
            raise AuthorizationException(
                f"Role '{profile.role}' is not authorized. Required: staff with department {self.allowed_departments}"
            )

        # Check department from JWT token
        if profile.department not in self.allowed_departments:
            raise AuthorizationException(
                f"Department '{profile.department}' is not authorized. Required: {self.allowed_departments}"
            )

        return profile


class PermissionChecker:
    """
    Combined Role + Department authorization checker.
    Allows flexible permission policies:
    - Admin always has access if included in allowed_roles
    - Staff needs to match allowed_departments
    - Other roles (Doctor, Patient) just need role match

    Usage: dependencies=[Depends(PermissionChecker(
        allowed_roles=[RoleEnum.ADMIN.value, RoleEnum.STAFF.value],
        allowed_departments=[StaffDepartmentEnum.REGISTRATION.value]  # Only for staff
    ))]
    """
    def __init__(
        self,
        allowed_roles: str | list[str],
        allowed_departments: Optional[str | list[str]] = None
    ):
        if isinstance(allowed_roles, str):
            self.allowed_roles = [allowed_roles]
        else:
            self.allowed_roles = allowed_roles

        if allowed_departments is None:
            self.allowed_departments = None
        elif isinstance(allowed_departments, str):
            self.allowed_departments = [allowed_departments]
        else:
            self.allowed_departments = allowed_departments

    async def __call__(
        self,
        profile: AuthenticatedProfile = Depends(get_current_profile)
    ) -> AuthenticatedProfile:
        # First check: Role must be in allowed list
        if profile.role not in self.allowed_roles:
            raise AuthorizationException(
                f"Role '{profile.role}' is not authorized. Required: {self.allowed_roles}"
            )

        # Second check: If staff and departments are specified, validate department
        if profile.role == RoleEnum.STAFF.value and self.allowed_departments:
            if profile.department not in self.allowed_departments:
                raise AuthorizationException(
                    f"Department '{profile.department}' is not authorized. Required: {self.allowed_departments}"
                )

        return profile


# =============================================================================
# Pre-built Permission Shortcuts
# =============================================================================

# Admin only access
require_admin = RoleChecker([RoleEnum.ADMIN.value])

# Doctor only access
require_doctor = RoleChecker([RoleEnum.DOCTOR.value])

# Staff only access (any department)
require_staff = RoleChecker([RoleEnum.STAFF.value])

# Patient only access
require_patient = RoleChecker([RoleEnum.PATIENT.value])

# Registration Staff or Admin
require_registration_access = PermissionChecker(
    allowed_roles=[RoleEnum.ADMIN.value, RoleEnum.STAFF.value],
    allowed_departments=[StaffDepartmentEnum.REGISTRATION.value]
)

# Pharmacy Staff or Admin
require_pharmacy_access = PermissionChecker(
    allowed_roles=[RoleEnum.ADMIN.value, RoleEnum.STAFF.value],
    allowed_departments=[StaffDepartmentEnum.PHARMACY.value]
)

# Laboratory Staff or Admin
require_lab_access = PermissionChecker(
    allowed_roles=[RoleEnum.ADMIN.value, RoleEnum.STAFF.value],
    allowed_departments=[StaffDepartmentEnum.LABORATORY.value]
)

# Cashier Staff or Admin
require_cashier_access = PermissionChecker(
    allowed_roles=[RoleEnum.ADMIN.value, RoleEnum.STAFF.value],
    allowed_departments=[StaffDepartmentEnum.CASHIER.value]
)

# Clinical staff (Doctor or any Staff)
require_clinical_access = RoleChecker([RoleEnum.DOCTOR.value, RoleEnum.STAFF.value])

# Admin or Doctor access
require_admin_or_doctor = RoleChecker([RoleEnum.ADMIN.value, RoleEnum.DOCTOR.value])
