from backend.module.session.models.session import UserSession
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession


class SessionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_session(self, session: UserSession):
        self.session.add(session)
        await self.session.flush()
        return session

    async def get_session_by_refresh_token(self, refresh_token: str) -> UserSession | None:
        stmt = select(UserSession).where(UserSession.refresh_token == refresh_token)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_session_by_access_token(self, access_token: str) -> UserSession | None:
        stmt = select(UserSession).where(UserSession.access_token == access_token)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def delete_session_by_refresh_token(self, refresh_token: str):
        stmt = delete(UserSession).where(UserSession.refresh_token == refresh_token)
        await self.session.execute(stmt)
