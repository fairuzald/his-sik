"""
Reusable pagination utilities with proper typing and edge case handling
"""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


async def paginate_async_query(
    session: AsyncSession,
    base_stmt: select,
    *,
    limit: int,
    offset: int,
) -> tuple[list[object], int]:
    """
    Execute a SQLAlchemy select with total count in a standardized way.

    Args:
        session: Database session
        base_stmt: SQLAlchemy select statement
        limit: Maximum number of items to return
        offset: Number of items to skip

    Returns:
        Tuple of (items, total_count)

    Raises:
        ValueError: If limit or offset are invalid
    """
    # Validate pagination parameters
    if limit <= 0:
        raise ValueError("Limit must be greater than 0")
    if offset < 0:
        raise ValueError("Offset cannot be negative")

    # Cap limit to prevent abuse
    limit = min(limit, 1000)

    try:
        # Get total count
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_result = await session.execute(count_stmt)
        total = int(total_result.scalar() or 0)

        # Handle empty results early
        if total == 0:
            return [], 0

        # Get paginated results
        paged_stmt = base_stmt.limit(limit).offset(offset)
        items_result = await session.execute(paged_stmt)
        items = list(items_result.scalars().all())
        return items, total

    except Exception as e:
        # Re-raise with more context
        raise RuntimeError(f"Failed to paginate query: {e}") from e


async def paginate_async_rows(
    session: AsyncSession,
    base_stmt: select,
    *,
    limit: int,
    offset: int,
) -> tuple[list[object], int]:
    """
    Execute a SQLAlchemy select (returning row tuples) with total count.

    Args:
        session: Database session
        base_stmt: SQLAlchemy select statement
        limit: Maximum number of items to return
        offset: Number of items to skip

    Returns:
        Tuple of (rows, total_count)

    Raises:
        ValueError: If limit or offset are invalid
    """
    # Validate pagination parameters
    if limit <= 0:
        raise ValueError("Limit must be greater than 0")
    if offset < 0:
        raise ValueError("Offset cannot be negative")

    # Cap limit to prevent abuse
    limit = min(limit, 1000)

    try:
        # Get total count
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_result = await session.execute(count_stmt)
        total = int(total_result.scalar() or 0)

        # Handle empty results early
        if total == 0:
            return [], 0

        # Get paginated results
        paged_stmt = base_stmt.limit(limit).offset(offset)
        rows_result = await session.execute(paged_stmt)
        rows = list(rows_result.fetchall())
        return rows, total

    except Exception as e:
        # Re-raise with more context
        raise RuntimeError(f"Failed to paginate rows: {e}") from e
