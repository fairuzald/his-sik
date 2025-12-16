import asyncio
import logging
from datetime import date
from uuid import uuid4

from backend.infrastructure.database.connection import db_manager
from backend.infrastructure.security.password import get_password_hash
from backend.module.clinic.entity.clinic import Clinic  # noqa: F401
from backend.module.common.enums import BloodTypeEnum, GenderEnum
from backend.module.invoice.entity.invoice import Invoice, InvoiceItem  # noqa: F401
from backend.module.lab.entity.lab import LabTest
from backend.module.medical_record.entity.medical_record import (
    MedicalRecord,  # noqa: F401
)
from backend.module.medicine.entity.medicine import Medicine
from backend.module.prescription.entity.prescription import (  # noqa: F401
    Prescription,
    PrescriptionItem,
)
from backend.module.profile.entity.models import Doctor, Patient, Staff
from backend.module.referral.entity.referral import Referral  # noqa: F401

# Import all models for relationship resolution
from backend.module.session.models.session import UserSession  # noqa: F401
from backend.module.user.entity.user import RoleEnum, User
from backend.module.visit.entity.visit import Visit  # noqa: F401
from backend.module.wearable.entity.wearable import (  # noqa: F401
    WearableDevice,
    WearableMeasurement,
)
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    # Initialize DB
    db_manager.init_db()

    async for session in db_manager.get_session():
        try:
            # --- Admin ---
            result = await session.execute(select(User).where(User.username == "admin"))
            if not result.scalars().first():
                admin = User(
                    id=uuid4(), username="admin", full_name="System Admin",
                    email="admin@sik.com", password_hash=get_password_hash("admin123"),
                    role=RoleEnum.ADMIN, is_active=True, phone_number="081234567890"
                )
                session.add(admin)
                logger.info("Seeded Admin.")

            # --- Doctor ---
            result = await session.execute(select(User).where(User.username == "doctor1"))
            if not result.scalars().first():
                doc_user = User(
                    id=uuid4(), username="doctor1", full_name="Dr. Strange",
                    email="doctor@sik.com", password_hash=get_password_hash("doctor123"),
                    role=RoleEnum.DOCTOR, is_active=True, phone_number="081234567891"
                )
                session.add(doc_user)
                await session.flush() # to get ID

                doctor_profile = Doctor(user_id=doc_user.id, specialty="General Practitioner", sip_number="SIP/123/2023", str_number="STR/123/2023")
                session.add(doctor_profile)
                logger.info("Seeded Doctor.")

            # --- Staff ---
            result = await session.execute(select(User).where(User.username == "staff1"))
            if not result.scalars().first():
                staff_user = User(
                    id=uuid4(), username="staff1", full_name="Nurse Joy",
                    email="staff@sik.com", password_hash=get_password_hash("staff123"),
                    role=RoleEnum.STAFF, is_active=True, phone_number="081234567892"
                )
                session.add(staff_user)
                await session.flush()

                staff_profile = Staff(user_id=staff_user.id, department="Registration")
                session.add(staff_profile)
                logger.info("Seeded Staff.")

            # --- Patient ---
            result = await session.execute(select(User).where(User.username == "patient1"))
            if not result.scalars().first():
                patient_user = User(
                    id=uuid4(), username="patient1", full_name="John Doe",
                    email="patient@sik.com", password_hash=get_password_hash("patient123"),
                    role=RoleEnum.PATIENT, is_active=True, phone_number="081234567893"
                )
                session.add(patient_user)
                await session.flush()

                patient_profile = Patient(
                    user_id=patient_user.id, nik="1234567890123456",
                    date_of_birth=date(1990, 1, 1), gender=GenderEnum.MALE,
                    blood_type=BloodTypeEnum.O, address="123 Baker St",
                    emergency_contact_name="Jane Doe", emergency_contact_phone="08111111111"
                )
                session.add(patient_profile)
                logger.info("Seeded Patient.")

            # --- Lab Tests ---
            tests = [
                ("CBC", "Complete Blood Count", 50000, "Hematology"),
                ("URINE", "Urine Analysis", 30000, "Urinalysis"),
                ("XRAY-CHEST", "Chest X-Ray", 150000, "Radiology")
            ]
            for code, name, price, cat in tests:
                res = await session.execute(select(LabTest).where(LabTest.test_code == code))
                if not res.scalars().first():
                    test = LabTest(test_code=code, test_name=name, price=price, category=cat, is_active=True)
                    session.add(test)
            logger.info("Seeded Lab Tests.")

            # --- Medicines ---
            meds = [
                ("MED001", "Paracetamol 500mg", "Tablet", 500),
                ("MED002", "Amoxicillin 500mg", "Capsule", 1200),
                ("MED003", "Vitamin C", "Tablet", 200)
            ]
            for code, name, unit, price in meds:
                res = await session.execute(select(Medicine).where(Medicine.medicine_code == code))
                if not res.scalars().first():
                    med = Medicine(medicine_code=code, medicine_name=name, unit=unit, unit_price=price, is_active=True)
                    session.add(med)
            logger.info("Seeded Medicines.")

            await session.commit()
            break
        except Exception as e:
            logger.error(f"Seeding failed: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(seed_data())
