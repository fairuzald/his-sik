import asyncio
import logging
from datetime import date
from uuid import uuid4

from backend.infrastructure.database.connection import db_manager
from backend.infrastructure.security.password import get_password_hash
from backend.module.clinic.entity.clinic import Clinic
from backend.module.common.enums import BloodTypeEnum, GenderEnum
from backend.module.lab.entity.lab import LabTest
from backend.module.medicine.entity.medicine import Medicine
from backend.module.profile.entity.models import Doctor, Patient, Staff
from backend.module.session.models.session import UserSession  # noqa: F401
from backend.module.user.entity.user import RoleEnum, User
# Import models for SQLAlchemy relationship resolution
from backend.module.visit.entity.visit import Visit  # noqa: F401
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_data():
    """
    Seed database with initial data including users and their profiles.

    IMPORTANT: For patients, doctors, and staff, this script creates BOTH:
    1. User record in 'users' table
    2. Profile record in 'patients'/'doctors'/'staff' table

    This prevents "Visit not found" errors that occur when users exist
    without corresponding profile records.

    For new users created via API, use the role-specific endpoints:
    - POST /api/users/patients (creates user + patient profile)
    - POST /api/users/doctors (creates user + doctor profile)
    - POST /api/users/staff (creates user + staff profile)
    """
    db_manager.init_db()

    async for session in db_manager.get_session():
        try:
            # --- Admin (no profile needed) ---
            result = await session.execute(
                select(User).where(User.username == "admin")
            )
            if not result.scalars().first():
                admin = User(
                    id=uuid4(),
                    username="admin",
                    full_name="System Admin",
                    email="admin@sik.com",
                    password_hash=get_password_hash("admin123"),
                    role=RoleEnum.ADMIN,
                    is_active=True,
                    phone_number="081234567890"
                )
                session.add(admin)
                logger.info("Seeded Admin.")

            # --- Clinics ---
            clinics_data = [
                "General Clinic",
                "Dental Clinic",
                "Pediatric Clinic",
            ]
            for clinic_name in clinics_data:
                result = await session.execute(
                    select(Clinic).where(Clinic.name == clinic_name)
                )
                if not result.scalars().first():
                    clinic = Clinic(name=clinic_name)
                    session.add(clinic)
            logger.info("Seeded Clinics.")

            # --- Doctor 1 + Profile ---
            result = await session.execute(
                select(User).where(User.username == "doctor1")
            )
            if not result.scalars().first():
                doc_user = User(
                    id=uuid4(),
                    username="doctor1",
                    full_name="Dr. Strange",
                    email="doctor@sik.com",
                    password_hash=get_password_hash("doctor123"),
                    role=RoleEnum.DOCTOR,
                    is_active=True,
                    phone_number="081234567891"
                )
                session.add(doc_user)
                await session.flush()

                doctor_profile = Doctor(
                    user_id=doc_user.id,
                    specialty="General Practitioner",
                    sip_number="SIP123456789012",
                    str_number="1234567890123456"
                )
                session.add(doctor_profile)
                logger.info("Seeded Doctor 1 with profile.")

            # --- Doctor 2 + Profile ---
            result = await session.execute(
                select(User).where(User.username == "doctor2")
            )
            if not result.scalars().first():
                doc_user2 = User(
                    id=uuid4(),
                    username="doctor2",
                    full_name="Dr. House",
                    email="doctor2@sik.com",
                    password_hash=get_password_hash("doctor123"),
                    role=RoleEnum.DOCTOR,
                    is_active=True,
                    phone_number="081234567895"
                )
                session.add(doc_user2)
                await session.flush()

                doctor_profile2 = Doctor(
                    user_id=doc_user2.id,
                    specialty="Cardiologist",
                    sip_number="SIP987654321098",
                    str_number="9876543210987654"
                )
                session.add(doctor_profile2)
                logger.info("Seeded Doctor 2 with profile.")

            # --- Staff + Profile ---
            result = await session.execute(
                select(User).where(User.username == "staff1")
            )
            if not result.scalars().first():
                staff_user = User(
                    id=uuid4(),
                    username="staff1",
                    full_name="Nurse Joy",
                    email="staff@sik.com",
                    password_hash=get_password_hash("staff123"),
                    role=RoleEnum.STAFF,
                    is_active=True,
                    phone_number="081234567892"
                )
                session.add(staff_user)
                await session.flush()

                staff_profile = Staff(
                    user_id=staff_user.id,
                    department="Registration"
                )
                session.add(staff_profile)
                logger.info("Seeded Staff with profile.")

            # --- Patient 1 + Profile ---
            result = await session.execute(
                select(User).where(User.username == "patient1")
            )
            if not result.scalars().first():
                patient_user = User(
                    id=uuid4(),
                    username="patient1",
                    full_name="John Doe",
                    email="patient@sik.com",
                    password_hash=get_password_hash("patient123"),
                    role=RoleEnum.PATIENT,
                    is_active=True,
                    phone_number="081234567893"
                )
                session.add(patient_user)
                await session.flush()

                patient_profile = Patient(
                    user_id=patient_user.id,
                    nik="1234567890123456",
                    date_of_birth=date(1990, 1, 1),
                    gender=GenderEnum.MALE,
                    blood_type=BloodTypeEnum.O,
                    address="123 Baker St",
                    emergency_contact_name="Jane Doe",
                    emergency_contact_phone="08111111111"
                )
                session.add(patient_profile)
                logger.info("Seeded Patient 1 with profile.")

            # --- Patient 2 + Profile ---
            result = await session.execute(
                select(User).where(User.username == "patient2")
            )
            if not result.scalars().first():
                patient_user2 = User(
                    id=uuid4(),
                    username="patient2",
                    full_name="Jane Smith",
                    email="patient2@sik.com",
                    password_hash=get_password_hash("patient123"),
                    role=RoleEnum.PATIENT,
                    is_active=True,
                    phone_number="081234567894"
                )
                session.add(patient_user2)
                await session.flush()

                patient_profile2 = Patient(
                    user_id=patient_user2.id,
                    nik="6543210987654321",
                    date_of_birth=date(1995, 5, 15),
                    gender=GenderEnum.FEMALE,
                    blood_type=BloodTypeEnum.A_POS,
                    address="456 Main Street",
                    emergency_contact_name="John Smith",
                    emergency_contact_phone="08222222222"
                )
                session.add(patient_profile2)
                logger.info("Seeded Patient 2 with profile.")

            # --- Lab Tests ---
            tests = [
                ("CBC", "Complete Blood Count", 50000, "Hematology"),
                ("URINE", "Urine Analysis", 30000, "Urinalysis"),
                ("XRAY-CHEST", "Chest X-Ray", 150000, "Radiology")
            ]
            for code, name, price, cat in tests:
                res = await session.execute(
                    select(LabTest).where(LabTest.test_code == code)
                )
                if not res.scalars().first():
                    test = LabTest(
                        test_code=code,
                        test_name=name,
                        price=price,
                        category=cat,
                        is_active=True
                    )
                    session.add(test)
            logger.info("Seeded Lab Tests.")

            # --- Medicines ---
            meds = [
                ("MED001", "Paracetamol 500mg", "Tablet", 500),
                ("MED002", "Amoxicillin 500mg", "Capsule", 1200),
                ("MED003", "Vitamin C", "Tablet", 200)
            ]
            for code, name, unit, price in meds:
                res = await session.execute(
                    select(Medicine).where(Medicine.medicine_code == code)
                )
                if not res.scalars().first():
                    med = Medicine(
                        medicine_code=code,
                        medicine_name=name,
                        unit=unit,
                        unit_price=price,
                        is_active=True
                    )
                    session.add(med)
            logger.info("Seeded Medicines.")

            await session.commit()
            logger.info("Seeding completed successfully!")
            break
        except Exception as e:
            logger.error(f"Seeding failed: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_data())
