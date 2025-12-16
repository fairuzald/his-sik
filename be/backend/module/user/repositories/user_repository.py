from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.module.user.entity.user import User


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_user(self, user: User) -> User:
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_user_by_username(self, username: str) -> User | None:
        stmt = select(User).where(User.username == username)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_user_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_user_by_id(self, user_id: str | UUID) -> User | None:
        if isinstance(user_id, str):
            user_id = UUID(user_id)
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_users(self, page: int = 1, limit: int = 10, search: str = None, roles: list[str] = None) -> tuple[list[User], int]:
        stmt = select(User)

        filters = []
        if search:
            # Case insensitive search on username or full_name
            filters.append(User.username.ilike(f"%{search}%") | User.full_name.ilike(f"%{search}%"))

        if roles:
            # Filter by roles if provided
            # RoleEnum usage requires casting or comparison with string value if enum type matches?
            # User.role is defined as Enum type in model.
            from backend.module.user.entity.user import RoleEnum
            # Convert string roles to Enum members if needed, or pass as strings assuming SQLAlchemy handles it.
            # Safer to verify/convert
            role_enums = []
            for r in roles:
                try:
                    role_enums.append(RoleEnum(r))
                except ValueError:
                    continue
            if role_enums:
                filters.append(User.role.in_(role_enums))

        if filters:
             for f in filters:
                 stmt = stmt.where(f)

        # Total count
        count_stmt = select(func.count()).select_from(User)
        if filters:
             for f in filters:
                 count_stmt = count_stmt.where(f)

        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        users = result.scalars().all()

        return users, total
