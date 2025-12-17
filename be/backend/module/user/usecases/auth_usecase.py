from datetime import datetime, timedelta
from uuid import UUID

from backend.infrastructure.config.settings import settings
from backend.infrastructure.security.hmac_utils import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from backend.module.common.enums import RoleEnum
from backend.module.profile.repositories.profile_repository import ProfileRepository
from backend.module.session.models.session import UserSession
from backend.module.session.repositories.session_repository import (
    SessionRepository,
)
from backend.module.user.entity.auth_dto import LoginDTO, RegisterDTO
from backend.module.user.entity.user import User
from backend.module.user.entity.user_dao import TokenDAO, UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.exceptions import (
    AuthenticationException,
    BusinessLogicException,
)


class AuthUseCase:
    def __init__(
        self,
        user_repository: UserRepository,
        session_repository: SessionRepository,
        profile_repository: ProfileRepository,
    ):
        self.user_repository = user_repository
        self.session_repository = session_repository
        self.profile_repository = profile_repository

    async def _get_profile_claims(self, user_id: UUID, role: RoleEnum) -> dict:
        """Get profile claims (profile_id, department) for JWT token."""
        profile = None
        department = None

        if role == RoleEnum.DOCTOR:
            profile = await self.profile_repository.get_doctor_by_user_id(user_id)
        elif role == RoleEnum.STAFF:
            profile = await self.profile_repository.get_staff_by_user_id(user_id)
            if profile:
                department = profile.department
        elif role == RoleEnum.PATIENT:
            profile = await self.profile_repository.get_patient_by_user_id(user_id)
        elif role == RoleEnum.ADMIN:
            return {"profile_id": str(user_id), "department": None}

        return {
            "profile_id": str(profile.id) if profile else None,
            "department": department
        }

    async def login(self, req: LoginDTO) -> TokenDAO:
        user = await self.user_repository.get_user_by_username(req.username)
        if not user:
            raise AuthenticationException("Invalid username or password")

        if not verify_password(req.password, user.password_hash):
            raise AuthenticationException("Invalid username or password")

        if not user.is_active:
            raise AuthenticationException("User is inactive")

        # Get profile claims for the token
        claims = await self._get_profile_claims(user.id, user.role)

        # Create tokens with profile claims included
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        refresh_token_expires = timedelta(days=7)

        token_data = {
            "sub": str(user.id),
            "role": user.role.value,
            "profile_id": claims["profile_id"],
            "department": claims["department"],
        }

        access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id)},
            expires_delta=refresh_token_expires
        )

        # Create Session
        session = UserSession(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=datetime.utcnow() + refresh_token_expires,
        )
        await self.session_repository.create_session(session)

        return TokenDAO(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    async def register(self, req: RegisterDTO) -> UserDAO:
        """Register a new patient user with patient profile"""
        existing_user = await self.user_repository.get_user_by_username(
            req.username
        )
        if existing_user:
            raise BusinessLogicException(
                f"Username '{req.username}' already exists"
            )

        if req.email:
            existing_email = await self.user_repository.get_user_by_email(
                req.email
            )
            if existing_email:
                raise BusinessLogicException(
                    f"Email '{req.email}' already exists"
                )

        # Create user
        hashed_password = get_password_hash(req.password)
        new_user = User(
            username=req.username,
            password_hash=hashed_password,
            full_name=req.full_name,
            email=req.email,
            phone_number=req.phone_number,
            role=RoleEnum.PATIENT,
            is_active=True
        )
        created_user = await self.user_repository.create_user(new_user)

        # Create patient profile
        from backend.module.profile.entity.models import Patient
        patient = Patient(
            user_id=created_user.id,
            nik=req.nik,
            date_of_birth=req.date_of_birth,
            gender=req.gender,
            bpjs_number=req.bpjs_number,
            blood_type=req.blood_type,
            address=req.address,
            emergency_contact_name=req.emergency_contact_name,
            emergency_contact_phone=req.emergency_contact_phone
        )
        await self.profile_repository.create_patient(patient)

        # Flush to ensure all changes are committed
        await self.user_repository.session.flush()

        return UserDAO.model_validate(created_user)

    async def logout(self, refresh_token: str) -> None:
        await self.session_repository.delete_session_by_refresh_token(refresh_token)

    async def refresh_token(self, refresh_token: str) -> TokenDAO:
        try:
            payload = decode_access_token(refresh_token)
            user_id = payload.get("sub")
            if not user_id:
                raise AuthenticationException("Invalid refresh token")
        except AuthenticationException:
            raise
        except Exception as exc:
            raise AuthenticationException("Invalid refresh token") from exc

        session = await self.session_repository.get_session_by_refresh_token(refresh_token)
        if not session:
            raise AuthenticationException("Session not found or expired")

        if session.expires_at < datetime.utcnow():
            await self.session_repository.delete_session_by_refresh_token(refresh_token)
            raise AuthenticationException("Refresh token expired")

        user = await self.user_repository.get_user_by_id(session.user_id)
        if not user or not user.is_active:
            raise AuthenticationException("User invalid")

        # Get profile claims for the new token
        claims = await self._get_profile_claims(user.id, user.role)

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=7)

        token_data = {
            "sub": str(user.id),
            "role": user.role.value,
            "profile_id": claims["profile_id"],
            "department": claims["department"],
        }

        new_access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )
        new_refresh_token = create_refresh_token(
            data={"sub": str(user.id)},
            expires_delta=refresh_token_expires
        )

        await self.session_repository.delete_session_by_refresh_token(refresh_token)

        new_session = UserSession(
            user_id=user.id,
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_at=datetime.utcnow() + refresh_token_expires,
        )
        await self.session_repository.create_session(new_session)

        return TokenDAO(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )
