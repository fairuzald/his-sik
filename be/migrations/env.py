import asyncio
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

# Add backend path to sys.path
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))

from backend.infrastructure.config.settings import settings
from backend.infrastructure.database.connection import Base

# Clinic
from backend.module.clinic.entity.clinic import Clinic  # noqa: F401

# Invoice
from backend.module.invoice.entity.invoice import (  # noqa: F401
    Invoice,
    InvoiceItem,
)

# Lab
from backend.module.lab.entity.lab import (  # noqa: F401
    LabOrder,
    LabResult,
    LabTest,
)

# Medical Record
from backend.module.medical_record.entity.medical_record import (
    MedicalRecord,  # noqa: F401
)

# Medicine
from backend.module.medicine.entity.medicine import Medicine  # noqa: F401

# Prescription
from backend.module.prescription.entity.prescription import (  # noqa: F401
    Prescription,
    PrescriptionItem,
)

# Profile entities (Staff, Doctor, Patient)
from backend.module.profile.entity.models import (  # noqa: F401
    Doctor,
    Patient,
    Staff,
)

# Referral
from backend.module.referral.entity.referral import Referral  # noqa: F401
from backend.module.session.models.session import UserSession  # noqa: F401

# =============================================================================
# Import all models for Alembic to detect them
# Models must be imported before accessing Base.metadata
# =============================================================================
# Core User & Session
from backend.module.user.entity.user import User  # noqa: F401

# Visit
from backend.module.visit.entity.visit import Visit  # noqa: F401

# Wearable
from backend.module.wearable.entity.wearable import (  # noqa: F401
    WearableMeasurement,
)

# =============================================================================
# Alembic Configuration
# =============================================================================

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set database URL from settings
database_url = settings.DATABASE_URL

# Target metadata from Base
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine.
    Calls to context.execute() will emit the given string to the script output.
    """
    url = database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """Run migrations using the given connection."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    Creates an Engine and associates a connection with the context.
    """
    # Create configuration dict with the URL from settings
    config_section = config.get_section(config.config_ini_section)
    configuration = dict(config_section) if config_section else {}
    configuration["sqlalchemy.url"] = database_url

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():  # type: ignore[attr-defined]
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
