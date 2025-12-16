from threading import Lock
from typing import AsyncGenerator

from backend.infrastructure.config.settings import settings
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class DatabaseManager:
    _instance = None
    _lock = Lock()

    def __init__(self):
        self._engine: AsyncEngine | None = None
        self._sessionmaker: async_sessionmaker[AsyncSession] | None = None

    @classmethod
    def get_instance(cls) -> "DatabaseManager":
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = cls()
        return cls._instance

    def init_db(self, db_url: str = settings.DATABASE_URL):
        if self._engine:
            return

        self._engine = create_async_engine(
            db_url,
            echo=False,  # Set to True for SQL logging
            future=True,
            pool_pre_ping=True,
        )
        self._sessionmaker = async_sessionmaker(
            bind=self._engine,
            expire_on_commit=False,
            autoflush=False,
            class_=AsyncSession,
        )

    async def close(self):
        if self._engine:
            await self._engine.dispose()
            self._engine = None
            self._sessionmaker = None

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        if not self._sessionmaker:
            self.init_db()

        if not self._sessionmaker:
             raise RuntimeError("Database not initialized")

        async with self._sessionmaker() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise


db_manager = DatabaseManager()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in db_manager.get_session():
        yield session
