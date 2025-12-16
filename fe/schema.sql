CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    nik CHAR(16) NOT NULL UNIQUE,
    medical_record_number VARCHAR(30) NOT NULL UNIQUE,
    bpjs_number VARCHAR(20),
    birth_place VARCHAR(100),
    birth_date DATE,
    gender CHAR(1) CHECK (gender IN ('M','F')),
    blood_type VARCHAR(5),
    marital_status VARCHAR(30),
    religion VARCHAR(30),
    full_address TEXT,
    village VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    emergency_contact_name VARCHAR(150),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    sip_number VARCHAR(50),
    str_number VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    staff_role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(30) NOT NULL UNIQUE,
    service_name VARCHAR(150) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    clinic VARCHAR(100),
    price NUMERIC(14,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_code VARCHAR(30) NOT NULL UNIQUE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage_form VARCHAR(50),
    unit VARCHAR(50),
    unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code VARCHAR(30) NOT NULL UNIQUE,
    test_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(50),
    reference_range VARCHAR(150),
    price NUMERIC(14,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    registration_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    visit_datetime TIMESTAMPTZ NOT NULL,
    queue_number INTEGER,
    clinic VARCHAR(100),
    visit_type VARCHAR(20) NOT NULL DEFAULT 'general' CHECK (visit_type IN ('general','follow_up','referral','other')),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','bpjs','insurance','other')),
    chief_complaint TEXT,
    visit_status VARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (visit_status IN ('registered','called','examining','completed','canceled','referred')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE REFERENCES visits(id) ON DELETE CASCADE,
    anamnesis TEXT,
    physical_exam TEXT,
    primary_diagnosis VARCHAR(255),
    secondary_diagnosis TEXT,
    treatment_plan TEXT,
    doctor_notes TEXT,
    outcome VARCHAR(20) CHECK (outcome IN ('recovered','follow_up','referred','inpatient','other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE REFERENCES visits(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    pharmacy_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    prescription_status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (prescription_status IN ('created','processing','ready','dispensed','canceled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    usage_instructions TEXT,
    notes TEXT
);

CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    lab_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    lab_test_id UUID NOT NULL REFERENCES lab_tests(id) ON DELETE RESTRICT,
    request_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (order_status IN ('requested','in_progress','completed','canceled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL UNIQUE REFERENCES lab_orders(id) ON DELETE CASCADE,
    result_text TEXT,
    result_value_numeric NUMERIC(14,4),
    result_unit VARCHAR(50),
    reference_range VARCHAR(150),
    interpretation TEXT,
    result_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE REFERENCES visits(id) ON DELETE CASCADE,
    cashier_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_discount NUMERIC(14,2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(14,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid','canceled')),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','debit','credit','transfer','bpjs','other')),
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('doctor_fee','procedure','medicine','lab','other')),
    reference_id UUID,
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0
);

CREATE TABLE wearable_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    heart_rate FLOAT,
    spo2 FLOAT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_nik ON patients (nik);
CREATE INDEX idx_patients_name ON patients (medical_record_number);
CREATE INDEX idx_visits_patient ON visits (patient_id);
Create INDEX idx_visits_doctor_datetime ON visits (doctor_id, visit_datetime);
CREATE INDEX idx_prescriptions_status ON prescriptions (prescription_status);
CREATE INDEX idx_lab_orders_status ON lab_orders (order_status);
CREATE INDEX idx_invoices_status ON invoices (payment_status);
