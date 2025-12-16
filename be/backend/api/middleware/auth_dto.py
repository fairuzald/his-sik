
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AuthenticatedProfile(BaseModel):
    """Profile context extracted from JWT token."""
    id: UUID
    role: str
    user_id: UUID
    department: Optional[str] = None  # For staff department checks

    model_config = ConfigDict(arbitrary_types_allowed=True)
