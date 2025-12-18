-- ================================================
-- HEALTH INFORMATION SYSTEM SCHEMA
-- PostgreSQL - With ENUM Explanations as Comments
-- ================================================

-- Drop existing tables
DROP TABLE IF EXISTS wearable_measurements CASCADE;

DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS lab_orders CASCADE;
DROP TABLE IF EXISTS lab_tests CASCADE;
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS clinic CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop existing ENUM types
DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS blood_type_enum CASCADE;
DROP TYPE IF EXISTS staff_department_enum CASCADE;
DROP TYPE IF EXISTS visit_type_enum CASCADE;
DROP TYPE IF EXISTS visit_status_enum CASCADE;
DROP TYPE IF EXISTS payment_method_enum CASCADE;
DROP TYPE IF EXISTS outcome_enum CASCADE;
DROP TYPE IF EXISTS prescription_status_enum CASCADE;
DROP TYPE IF EXISTS order_status_enum CASCADE;
DROP TYPE IF EXISTS payment_status_enum CASCADE;
DROP TYPE IF EXISTS invoice_item_type_enum CASCADE;
DROP TYPE IF EXISTS referral_status_enum CASCADE;

-- ================================================
-- CREATE ENUM TYPES WITH EXPLANATIONS
-- ================================================

-- ENUM: gender_enum
-- Jenis Kelamin Pasien
-- L = Laki-laki (Male)
-- P = Perempuan (Female)
CREATE TYPE gender_enum AS ENUM ('L', 'P');

-- ENUM: blood_type_enum
-- Golongan Darah Pasien
-- A, B, AB, O = Golongan darah tanpa Rhesus
-- A+, B+, AB+, O+ = Golongan dengan Rhesus positif
-- A-, B-, AB-, O- = Golongan dengan Rhesus negatif
-- Catatan: O+ paling umum di Indonesia (~37%), Rhesus negatif sangat jarang (<1%)
CREATE TYPE blood_type_enum AS ENUM (
    'A', 'B', 'AB', 'O',
    'A+', 'A-', 'B+', 'B-',
    'AB+', 'AB-', 'O+', 'O-'
);


CREATE TYPE role_enum AS ENUM (
    'admin',
    'doctor',
    'staff',
    'patient'
);

-- ENUM: staff_department_enum
-- Departemen Staff di Rumah Sakit/Klinik
-- Registration = Pendaftaran (tugas: daftar pasien, buat appointment)
-- Pharmacy = Farmasi/Apotek (tugas: proses resep, berikan obat)
-- Laboratory = Laboratorium (tugas: ambil sample, input hasil lab)
-- Cashier = Kasir (tugas: buat tagihan, terima pembayaran)
CREATE TYPE staff_department_enum AS ENUM (
    'Registration',
    'Pharmacy',
    'Laboratory',
    'Cashier'
);

-- ENUM: visit_type_enum
-- Tipe Kunjungan Pasien
-- general = Kunjungan umum/pertama kali (pasien sakit, check up)
-- follow_up = Kunjungan kontrol/lanjutan (kontrol setelah operasi, cek hasil lab)
-- referral = Pasien dirujuk dari klinik/RS lain (dapat surat rujukan)
-- emergency = Kondisi darurat/gawat (kecelakaan, serangan jantung)
CREATE TYPE visit_type_enum AS ENUM (
    'general',
    'follow_up',
    'referral',
    'emergency'
);

-- ENUM: visit_status_enum
-- Status Kunjungan Pasien
-- FLOW: registered -> examining -> completed
--       registered -> canceled
-- registered = Pasien terdaftar, menunggu dipanggil dokter (duduk di ruang tunggu)
-- examining = Pasien sedang diperiksa dokter (dokter input diagnosis, resep, dll)
-- completed = Pemeriksaan selesai (pasien ke farmasi/lab/kasir)
-- canceled = Kunjungan dibatalkan (pasien tidak jadi, dokter berhalangan)
CREATE TYPE visit_status_enum AS ENUM (
    'registered',
    'examining',
    'completed',
    'canceled'
);

-- ENUM: payment_method_enum
-- Metode Pembayaran
-- cash = Bayar dengan uang tunai
-- debit = Bayar dengan kartu debit (BCA, Mandiri, dll)
-- credit = Bayar dengan kartu kredit (Visa, Mastercard)
-- bpjs = Menggunakan BPJS Kesehatan (asuransi pemerintah, pasien bayar Rp 0 atau minimal)
-- insurance = Menggunakan asuransi swasta (Prudential, Allianz, Manulife)
CREATE TYPE payment_method_enum AS ENUM (
    'cash',
    'debit',
    'credit',
    'bpjs',
    'insurance'
);

-- ENUM: outcome_enum
-- Hasil Akhir Pemeriksaan
-- recovered = Pasien sembuh, tidak perlu tindak lanjut (flu ringan sembuh)
-- follow_up = Pasien perlu kontrol lagi ("Kontrol 1 minggu lagi")
-- referred = Pasien dirujuk ke RS/klinik lain (butuh spesialis/fasilitas lebih lengkap)
-- inpatient = Pasien perlu rawat inap (kondisi serius, perlu observasi 24 jam)
CREATE TYPE outcome_enum AS ENUM (
    'recovered',
    'follow_up',
    'referred',
    'inpatient'
);

-- ENUM: prescription_status_enum
-- Status Resep Dokter
-- FLOW: pending -> processing -> completed
--       pending -> canceled
-- pending = Resep baru dibuat dokter, belum diproses farmasi (pasien menunggu)
-- processing = Staff farmasi sedang menyiapkan obat (ambil obat dari rak, kemas)
-- completed = Obat sudah diserahkan ke pasien (stok obat berkurang)
-- canceled = Resep dibatalkan (obat tidak tersedia, pasien tidak jadi ambil)
CREATE TYPE prescription_status_enum AS ENUM (
    'pending',
    'processing',
    'completed',
    'canceled'
);

-- ENUM: order_status_enum
-- Status Order Laboratorium
-- FLOW: pending -> in_progress -> completed
--       pending -> canceled
-- pending = Order lab baru dibuat, belum diambil sample (pasien menunggu dipanggil lab)
-- in_progress = Sample sudah diambil, sedang diperiksa (masukkan ke alat analyzer, tunggu hasil)
-- completed = Hasil lab sudah tersedia (staff input hasil, pasien/dokter bisa lihat)
-- canceled = Order lab dibatalkan (pasien tidak jadi tes, order salah/duplikat)
CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'canceled'
);

-- ENUM: payment_status_enum
-- Status Pembayaran
-- FLOW: unpaid -> paid
--       unpaid -> canceled
-- unpaid = Invoice sudah dibuat, pasien belum bayar (kasir tunggu pembayaran)
-- paid = Pasien sudah bayar penuh/lunas (cetak kuitansi, pasien pulang)
-- canceled = Tagihan dibatalkan (pasien tidak jadi berobat, kesalahan perhitungan)
CREATE TYPE payment_status_enum AS ENUM (
    'unpaid',
    'paid',
    'canceled'
);

-- ENUM: invoice_item_type_enum
-- Tipe Item dalam Tagihan/Invoice
-- consultation = Biaya konsultasi dokter (per kunjungan)
-- medicine = Biaya obat dari resep (Paracetamol, Amoxicillin, dll)
-- lab = Biaya pemeriksaan lab (Tes Darah, Gula Darah, dll)
-- other = Biaya lain-lain (Administrasi, Surat Keterangan Sakit, Tindakan Medis)
CREATE TYPE invoice_item_type_enum AS ENUM (
    'consultation',
    'medicine',
    'lab',
    'other'
);

-- ENUM: referral_status_enum
-- Status Rujukan Pasien
-- FLOW: pending -> completed
--       pending -> canceled
-- pending = Surat rujukan sudah dibuat, pasien belum ke tempat rujukan (bawa surat ke RS tujuan)
-- completed = Pasien sudah berobat di tempat rujukan (konfirmasi sudah ditangani)
-- canceled = Rujukan dibatalkan (pasien tidak jadi, kondisi membaik, pilih RS lain)
CREATE TYPE referral_status_enum AS ENUM (
    'pending',
    'completed',
    'canceled'
);


-- ENUM: attachment_type_enum
-- Tipe Attachment
-- pdf
-- image
CREATE TYPE attachment_type_enum AS ENUM (
    'pdf',
    'image'
);

-- ================================================
-- CREATE TABLES
-- ================================================


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    photo_url TEXT,
    role role_enum NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    refresh_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    department staff_department_enum NOT NULL, -- Registration/Pharmacy/Laboratory/Cashier
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    specialty VARCHAR(100), -- Spesialisasi: Penyakit Dalam, Anak, Bedah, dll
    sip_number VARCHAR(50), -- Surat Izin Praktek
    str_number VARCHAR(50) CHECK (str_number ~ '^[0-9]{16}'), -- Surat Tanda Registrasi
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- Wajib ada user untuk setiap pasien
    nik CHAR(16) NOT NULL UNIQUE, -- NIK Indonesia (16 digit)
    bpjs_number VARCHAR(20), -- No. BPJS (opsional, jika pasien punya)
    date_of_birth DATE NOT NULL,
    gender gender_enum NOT NULL, -- L/P
    blood_type blood_type_enum, -- A/B/AB/O dengan +/-
    address TEXT, -- Alamat lengkap
    emergency_contact_name VARCHAR(100), -- Nama kontak darurat (keluarga)
    emergency_contact_phone VARCHAR(20), -- Telepon kontak darurat
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE clinic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- Nama Klinik/Poli: "Poli Umum", "Poli Gigi", dll
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    registration_staff_id UUID NOT NULL, -- Staff yang mendaftarkan
    clinic_id UUID NOT NULL, -- Klinik/Poli tujuan
    queue_number SERIAL, -- Nomor antrian
    visit_datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Waktu kunjungan
    visit_type visit_type_enum NOT NULL DEFAULT 'general', -- general/follow_up/referral/emergency
    chief_complaint TEXT, -- Keluhan utama: "Demam 3 hari", "Batuk dan pilek"
    visit_status visit_status_enum NOT NULL DEFAULT 'registered', -- registered->examining->completed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT visits_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT visits_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT visits_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES clinic(id),
    CONSTRAINT visits_registration_staff_id_fkey FOREIGN KEY (registration_staff_id) REFERENCES staff(id)
);

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE, -- 1 visit = 1 rekam medis
    anamnesis TEXT, -- Riwayat penyakit: "Demam sejak 3 hari, batuk berdahak"
    physical_exam TEXT, -- Pemeriksaan fisik: "TD: 120/80, Nadi: 85, Suhu: 38.5"
    diagnosis TEXT, -- Diagnosis: "ISPA (Infeksi Saluran Pernapasan Atas)"
    treatment_plan TEXT, -- Rencana pengobatan: "Istirahat, minum obat teratur"
    doctor_notes TEXT, -- Catatan dokter tambahan
    outcome outcome_enum, -- Hasil: recovered/follow_up/referred/inpatient
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT medical_records_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_code VARCHAR(20) NOT NULL UNIQUE, -- Kode obat: "MED001"
    medicine_name VARCHAR(150) NOT NULL, -- Nama obat: "Paracetamol 500mg"
    unit VARCHAR(20), -- Satuan: "Tablet", "Kaplet", "Botol", "Strip"
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0, -- Harga per satuan
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Obat masih dijual atau tidak
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE, -- 1 visit bisa punya 1 resep
    doctor_id UUID NOT NULL, -- Dokter yang meresepkan
    pharmacy_staff_id UUID, -- Staff farmasi yang memproses (diisi saat processing)
    prescription_status prescription_status_enum NOT NULL DEFAULT 'pending', -- pending->processing->completed
    notes TEXT, -- Catatan untuk farmasi
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT prescriptions_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT prescriptions_pharmacy_staff_id_fkey FOREIGN KEY (pharmacy_staff_id) REFERENCES staff(id)
);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL, -- 1 resep bisa punya banyak obat
    medicine_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0), -- Jumlah obat
    dosage VARCHAR(50), -- Dosis: "500mg", "10ml"
    frequency VARCHAR(50), -- Frekuensi: "3x sehari", "2x sehari setelah makan"
    duration VARCHAR(30), -- Durasi: "3 hari", "1 minggu", "sampai habis"
    instructions TEXT, -- Instruksi: "Diminum sesudah makan", "Jangan diminum saat perut kosong"
    CONSTRAINT prescription_items_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    CONSTRAINT prescription_items_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code VARCHAR(20) NOT NULL UNIQUE, -- Kode tes: "LAB001"
    test_name VARCHAR(150) NOT NULL, -- Nama tes: "Pemeriksaan Darah Lengkap", "Gula Darah"
    category VARCHAR(50), -- Kategori: "Hematologi", "Kimia Klinik", "Mikrobiologi"
    unit VARCHAR(20), -- Satuan hasil: "g/dL", "mg/dL", "U/L"
    reference_range VARCHAR(50), -- Nilai normal: "12-16 (P), 14-18 (L)", "70-100"
    price NUMERIC(10,2) NOT NULL DEFAULT 0, -- Biaya pemeriksaan
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Tes masih tersedia atau tidak
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL, -- 1 visit bisa order banyak tes lab
    doctor_id UUID NOT NULL, -- Dokter yang order
    lab_staff_id UUID, -- Staff lab yang handle (diisi saat in_progress)
    lab_test_id UUID NOT NULL, -- Jenis tes yang di-order
    order_status order_status_enum NOT NULL DEFAULT 'pending', -- pending->in_progress->completed
    notes TEXT, -- Catatan klinis untuk lab
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_orders_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    CONSTRAINT lab_orders_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT lab_orders_lab_staff_id_fkey FOREIGN KEY (lab_staff_id) REFERENCES staff(id),
    CONSTRAINT lab_orders_lab_test_id_fkey FOREIGN KEY (lab_test_id) REFERENCES lab_tests(id)
);

CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL UNIQUE, -- 1 order = 1 hasil
    result_value VARCHAR(100), -- Nilai hasil: "13.5", "Normal", "Positif"
    result_unit VARCHAR(20), -- Satuan: "g/dL", "mg/dL"
    interpretation TEXT, -- Interpretasi: "Normal", "Tinggi", "Rendah", "Dalam batas normal"
    attachment_url TEXT, -- URL file attachment
    attachment_type attachment_type_enum NOT NULL, -- pdf/image
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_results_lab_order_id_fkey FOREIGN KEY (lab_order_id) REFERENCES lab_orders(id) ON DELETE CASCADE
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL, -- Visit yang menghasilkan rujukan
    patient_id UUID NOT NULL,
    referring_doctor_id UUID NOT NULL, -- Dokter yang merujuk
    referred_to_facility VARCHAR(150) NOT NULL, -- Tujuan rujukan: "RS Hasan Sadikin", "RS Borromeus"
    specialty VARCHAR(100), -- Spesialis yang dituju: "Kardiologi", "Bedah", "Penyakit Dalam"
    reason TEXT NOT NULL, -- Alasan rujukan: "Memerlukan pemeriksaan EKG dan konsultasi spesialis jantung"
    diagnosis TEXT, -- Diagnosis sementara: "Dugaan Penyakit Jantung Koroner"
    referral_status referral_status_enum NOT NULL DEFAULT 'pending', -- pending->completed
    notes TEXT, -- Catatan tambahan,
    attachment_url TEXT, -- URL file attachment
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT referrals_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    CONSTRAINT referrals_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT referrals_referring_doctor_id_fkey FOREIGN KEY (referring_doctor_id) REFERENCES doctors(id)
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL UNIQUE, -- 1 visit = 1 invoice
    cashier_id UUID NOT NULL, -- Kasir yang buat invoice
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0, -- Total tagihan
    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0, -- Jumlah yang dibayar
    payment_status payment_status_enum NOT NULL DEFAULT 'unpaid', -- unpaid->paid
    payment_method payment_method_enum NOT NULL DEFAULT 'cash', -- Metode pembayaran actual
    notes TEXT, -- Catatan pembayaran
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT invoices_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    CONSTRAINT invoices_cashier_id_fkey FOREIGN KEY (cashier_id) REFERENCES staff(id)
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL, -- 1 invoice bisa punya banyak item
    item_type invoice_item_type_enum NOT NULL, -- consultation/medicine/lab/other
    description VARCHAR(200) NOT NULL, -- Deskripsi: "Konsultasi Dokter Umum", "Paracetamol 500mg (10 tablet)"
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0), -- Jumlah
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0, -- Harga satuan
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0, -- Subtotal = quantity × unit_price
    CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);



CREATE TABLE wearable_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL, -- Waktu pengukuran dari device
    heart_rate INTEGER, -- Detak jantung (bpm): 60-100 normal
    body_temperature NUMERIC(4,1), -- Suhu tubuh (°C): 36.5-37.5 normal
    spo2 INTEGER, -- Saturasi oksigen darah (%): 95-100 normal
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT wearable_measurements_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
