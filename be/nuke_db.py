import asyncio

from backend.infrastructure.database.connection import db_manager
from sqlalchemy import text


async def main():
    async for session in db_manager.get_session():
        await session.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        await session.execute(text("DROP TABLE IF EXISTS roles CASCADE"))
        await session.execute(text("DROP TABLE IF EXISTS alembic_version"))
        await session.commit()
        print("Dropped tables and alembic_version")

if __name__ == "__main__":
    asyncio.run(main())
