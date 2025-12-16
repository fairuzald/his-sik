from typing import TypeVar

from backend.infrastructure.database.session import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class BaseHandler:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.session = session
