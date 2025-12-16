from enum import Enum


class GenderEnum(str, Enum):
    MALE = 'L'
    FEMALE = 'P'

class BloodTypeEnum(str, Enum):
    A = 'A'
    B = 'B'
    AB = 'AB'
    O = 'O'
    A_POS = 'A+'
    A_NEG = 'A-'
    B_POS = 'B+'
    B_NEG = 'B-'
    AB_POS = 'AB+'
    AB_NEG = 'AB-'
    O_POS = 'O+'
    O_NEG = 'O-'

class RoleEnum(str, Enum):
    ADMIN = 'admin'
    DOCTOR = 'doctor'
    STAFF = 'staff'
    PATIENT = 'patient'

class StaffDepartmentEnum(str, Enum):
    REGISTRATION = 'Registration'
    PHARMACY = 'Pharmacy'
    LABORATORY = 'Laboratory'
    CASHIER = 'Cashier'

class VisitTypeEnum(str, Enum):
    GENERAL = 'general'
    FOLLOW_UP = 'follow_up'
    REFERRAL = 'referral'
    EMERGENCY = 'emergency'

class VisitStatusEnum(str, Enum):
    REGISTERED = 'registered'
    EXAMINING = 'examining'
    COMPLETED = 'completed'
    CANCELED = 'canceled'

class PaymentMethodEnum(str, Enum):
    CASH = 'cash'
    DEBIT = 'debit'
    CREDIT = 'credit'
    BPJS = 'bpjs'
    INSURANCE = 'insurance'

class OutcomeEnum(str, Enum):
    RECOVERED = 'recovered'
    FOLLOW_UP = 'follow_up'
    REFERRED = 'referred'
    INPATIENT = 'inpatient'

class PrescriptionStatusEnum(str, Enum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    CANCELED = 'canceled'

class OrderStatusEnum(str, Enum):
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELED = 'canceled'

class PaymentStatusEnum(str, Enum):
    UNPAID = 'unpaid'
    PAID = 'paid'
    CANCELED = 'canceled'

class InvoiceItemTypeEnum(str, Enum):
    CONSULTATION = 'consultation'
    MEDICINE = 'medicine'
    LAB = 'lab'
    OTHER = 'other'

class ReferralStatusEnum(str, Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    CANCELED = 'canceled'
