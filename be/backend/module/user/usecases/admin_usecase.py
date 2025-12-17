from uuid import UUID

from backend.infrastructure.security.password import get_password_hash
from backend.module.user.entity.admin_dto import CreateUserDTO, UpdateUserAdminDTO
from backend.module.user.entity.user import RoleEnum, User
from backend.module.user.entity.user_dao import UserDAO
from backend.module.user.repositories.user_repository import UserRepository
from backend.pkg.core.exceptions import BusinessLogicException


class AdminUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def create_user(self, req: CreateUserDTO) -> UserDAO:
        # Check if username exists
        existing_user = await self.user_repository.get_user_by_username(req.username)
        if existing_user:
            raise BusinessLogicException(f"Username '{req.username}' already exists")

        if req.email:
            existing_email = await self.user_repository.get_user_by_email(req.email)
            if existing_email:
                raise BusinessLogicException(f"Email '{req.email}' already exists")

        # Validate role is valid enum value
        try:
            role_enum = RoleEnum(req.role)
        except ValueError:
            raise BusinessLogicException(
                f"Invalid role '{req.role}'. "
                f"Must be one of: {[r.value for r in RoleEnum]}"
            )

        hashed_password = get_password_hash(req.password)
        new_user = User(
            username=req.username,
            password_hash=hashed_password,
            full_name=req.full_name,
            email=req.email,
            phone_number=req.phone_number,
            role=role_enum,
            is_active=True
        )
        created_user = await self.user_repository.create_user(new_user)
        return UserDAO.model_validate(created_user)

    async def list_users(self, page: int, limit: int, search: str = None, roles: list[str] = None) -> tuple[list[User], int]:
        return await self.user_repository.list_users(page, limit, search, roles)

    async def update_user(self, user_id: UUID, req: UpdateUserAdminDTO) -> UserDAO:
        """Update user details."""
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            raise BusinessLogicException(f"User with ID '{user_id}' not found")

        # Check email uniqueness if changing
        if req.email and req.email != user.email:
            existing_email = await self.user_repository.get_user_by_email(req.email)
            if existing_email and existing_email.id != user_id:
                raise BusinessLogicException(f"Email '{req.email}' already exists")

        # Update only provided fields
        fields_to_update = req.model_dump(exclude_unset=True)
        for key, value in fields_to_update.items():
            setattr(user, key, value)

        updated_user = await self.user_repository.update_user(user)
        return UserDAO.model_validate(updated_user)
