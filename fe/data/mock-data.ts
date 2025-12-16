
// =========================================
// TYPES MATCHING DB SCHEMA
// =========================================

export type Role = {
  id: string;
  name: string;
  description?: string;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  phone_number?: string;
  role_id: string;
  role_name: string; // Helper for frontend
  is_active: boolean;
  status: string; // Helper for frontend display (Active/Inactive)
};

export type Patient = {
  id: string;
  user_id?: string;
  nik: string;
  medical_record_number: string;
  bpjs_number?: string;
  full_name: string;
  birth_place?: string;
  birth_date?: string;
  gender: "M" | "F";
  blood_type?: string;
  marital_status?: string;
  religion?: string;
  full_address?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  status: string; // Helper
};

export type Doctor = {
  id: string;
  user_id: string;
  full_name: string;
  specialty?: string;
  sip_number?: string;
  str_number?: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
  status: string; // Helper
};

export type Staff = {
  id: string;
  user_id: string;
  full_name: string;
  staff_role: string; // registration, pharmacy, lab, cashier, admin
  department?: string;
  phone_number?: string;
  email?: string;
  is_active: boolean;
  status: string; // Helper
};

export type Service = {
  id: string;
  service_code: string;
  service_name: string;
  service_type: string;
  clinic?: string;
  price: number;
  is_active: boolean;
  status: string; // Helper
};

export type Medicine = {
  id: string;
  medicine_code: string;
  medicine_name: string;
  dosage_form?: string;
  unit?: string;
  unit_price: number;
  stock: number;
  is_active: boolean;
  status: string; // Helper
};

export type LabTest = {
  id: string;
  test_code: string;
  test_name: string;
  category?: string;
  unit?: string;
  reference_range?: string;
  price: number;
  is_active: boolean;
  status: string; // Helper
};

export type Visit = {
  id: string;
  patient_id: string;
  patient_name: string; // Helper
  doctor_id: string;
  doctor_name: string; // Helper
  registration_staff_id: string;
  visit_datetime: string;
  queue_number?: number;
  clinic?: string;
  visit_type: "general" | "follow_up" | "referral" | "other";
  payment_method: "cash" | "bpjs" | "insurance" | "other";
  chief_complaint?: string;
  visit_status: "registered" | "called" | "examining" | "completed" | "canceled" | "referred";
  status: string; // Helper for display
};

export type MedicalRecord = {
  id: string;
  visit_id: string;
  anamnesis?: string;
  physical_exam?: string;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  treatment_plan?: string;
  doctor_notes?: string;
  outcome?: "recovered" | "follow_up" | "referred" | "inpatient" | "other";
};

export type Prescription = {
  id: string;
  visit_id: string;
  doctor_id: string;
  doctor_name: string; // Helper
  pharmacy_staff_id?: string;
  prescription_status: "created" | "processing" | "ready" | "dispensed" | "canceled";
  status: string; // Helper
  notes?: string;
  date: string; // Helper
  items: PrescriptionItem[];
};

export type PrescriptionItem = {
  id: string;
  prescription_id: string;
  medicine_id: string;
  medicine_name: string; // Helper
  quantity: number;
  usage_instructions?: string;
  notes?: string;
};

export type LabOrder = {
  id: string;
  visit_id: string;
  doctor_id: string;
  doctor_name: string; // Helper
  lab_staff_id?: string;
  lab_test_id: string;
  test_name: string; // Helper
  request_datetime: string;
  order_status: "requested" | "in_progress" | "completed" | "canceled";
  status: string; // Helper
  notes?: string;
  result?: LabResult; // Helper nested
};

export type LabResult = {
  id: string;
  lab_order_id: string;
  result_text?: string;
  result_value_numeric?: number;
  result_unit?: string;
  reference_range?: string;
  interpretation?: string;
  result_datetime: string;
  created_by?: string;
};

export type Invoice = {
  id: string;
  visit_id: string;
  cashier_id: string;
  invoice_number: string;
  invoice_datetime: string;
  total_amount: number;
  total_discount: number;
  amount_paid: number;
  payment_status: "unpaid" | "partial" | "paid" | "canceled";
  status: string; // Helper
  payment_method: "cash" | "debit" | "credit" | "transfer" | "bpjs" | "other";
  remarks?: string;
  items: InvoiceItem[];
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  item_type: "doctor_fee" | "procedure" | "medicine" | "lab" | "other";
  reference_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

// =========================================
// MOCK DATA
// =========================================

export const patients: Patient[] = [
  {
    id: "PAT-001",
    nik: "3201234567890001",
    medical_record_number: "MRN-2023-001",
    full_name: "Alice Johnson",
    birth_date: "1990-05-15",
    gender: "F",
    phone_number: "081234567890",
    full_address: "Jl. Merdeka No. 10",
    city: "Jakarta",
    status: "Active",
    bpjs_number: "0001234567890"
  },
  {
    id: "PAT-002",
    nik: "3201234567890002",
    medical_record_number: "MRN-2023-002",
    full_name: "Bob Smith",
    birth_date: "1985-08-20",
    gender: "M",
    phone_number: "081234567891",
    full_address: "Jl. Sudirman No. 45",
    city: "Jakarta",
    status: "Active",
  },
  {
    id: "PAT-003",
    nik: "3201234567890003",
    medical_record_number: "MRN-2023-003",
    full_name: "Charlie Brown",
    birth_date: "2010-01-10",
    gender: "M",
    phone_number: "081234567892",
    full_address: "Jl. Thamrin No. 88",
    city: "Jakarta",
    status: "Inactive",
  },
  {
    id: "PAT-004",
    nik: "3201234567890004",
    medical_record_number: "MRN-2023-004",
    full_name: "Diana Prince",
    birth_date: "1995-03-25",
    gender: "F",
    phone_number: "081234567893",
    full_address: "Jl. Gatot Subroto No. 12",
    city: "Jakarta",
    status: "Active",
  },
];

export const doctors: Doctor[] = [
  {
    id: "DOC-001",
    user_id: "USR-001",
    full_name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    sip_number: "SIP-12345",
    phone_number: "08111111111",
    email: "sarah.wilson@hospital.com",
    is_active: true,
    status: "Active",
  },
  {
    id: "DOC-002",
    user_id: "USR-005",
    full_name: "Dr. James Brown",
    specialty: "Dentistry",
    sip_number: "SIP-67890",
    phone_number: "08111111112",
    email: "james.brown@hospital.com",
    is_active: true,
    status: "Active",
  },
  {
    id: "DOC-003",
    user_id: "USR-006",
    full_name: "Dr. Emily Chen",
    specialty: "General Practice",
    sip_number: "SIP-11223",
    phone_number: "08111111113",
    email: "emily.chen@hospital.com",
    is_active: false,
    status: "On Leave",
  },
];

export const staff: Staff[] = [
  {
    id: "STF-001",
    user_id: "USR-002",
    full_name: "John Doe",
    staff_role: "registration",
    department: "Front Desk",
    phone_number: "08222222221",
    email: "john.doe@hospital.com",
    is_active: true,
    status: "Active",
  },
  {
    id: "STF-002",
    user_id: "USR-003",
    full_name: "Jane Smith",
    staff_role: "pharmacy",
    department: "Pharmacy",
    phone_number: "08222222222",
    email: "jane.smith@hospital.com",
    is_active: true,
    status: "Active",
  },
  {
    id: "STF-003",
    user_id: "USR-004",
    full_name: "Bob Johnson",
    staff_role: "lab",
    department: "Laboratory",
    phone_number: "08222222223",
    email: "bob.johnson@hospital.com",
    is_active: true,
    status: "Active",
  },
];

export const medicines: Medicine[] = [
  {
    id: "MED-001",
    medicine_code: "M001",
    medicine_name: "Paracetamol 500mg",
    dosage_form: "Tablet",
    unit: "Strip",
    unit_price: 5000,
    stock: 1500,
    is_active: true,
    status: "Active",
  },
  {
    id: "MED-002",
    medicine_code: "M002",
    medicine_name: "Amoxicillin 500mg",
    dosage_form: "Capsule",
    unit: "Strip",
    unit_price: 15000,
    stock: 800,
    is_active: true,
    status: "Active",
  },
  {
    id: "MED-003",
    medicine_code: "M003",
    medicine_name: "Ibuprofen 400mg",
    dosage_form: "Tablet",
    unit: "Strip",
    unit_price: 8000,
    stock: 45,
    is_active: true,
    status: "Active",
  },
];

export const labTests: LabTest[] = [
  {
    id: "LAB-001",
    test_code: "L001",
    test_name: "Complete Blood Count",
    category: "Hematology",
    price: 150000,
    is_active: true,
    status: "Active",
  },
  {
    id: "LAB-002",
    test_code: "L002",
    test_name: "Lipid Profile",
    category: "Biochemistry",
    price: 250000,
    is_active: true,
    status: "Active",
  },
  {
    id: "LAB-003",
    test_code: "L003",
    test_name: "Urinalysis",
    category: "Clinical Microscopy",
    price: 75000,
    is_active: true,
    status: "Active",
  },
];

export const clinics = [
  { id: "CLN-001", name: "Cardiology", location: "Building A, Floor 2", head: "Dr. Sarah Wilson", status: "Open" },
  { id: "CLN-002", name: "Dentistry", location: "Building B, Floor 1", head: "Dr. James Brown", status: "Open" },
  { id: "CLN-003", name: "General Practice", location: "Building A, Floor 1", head: "Dr. Emily Chen", status: "Open" },
];

export const visits: Visit[] = [
  {
    id: "VST-001",
    patient_id: "PAT-001",
    patient_name: "Alice Johnson",
    doctor_id: "DOC-001",
    doctor_name: "Dr. Sarah Wilson",
    registration_staff_id: "STF-001",
    visit_datetime: "2023-11-20 09:00",
    visit_type: "general",
    payment_method: "cash",
    visit_status: "completed",
    status: "Completed",
    clinic: "Cardiology"
  },
  {
    id: "VST-002",
    patient_id: "PAT-002",
    patient_name: "Bob Smith",
    doctor_id: "DOC-002",
    doctor_name: "Dr. James Brown",
    registration_staff_id: "STF-001",
    visit_datetime: "2023-11-20 09:30",
    visit_type: "follow_up",
    payment_method: "insurance",
    visit_status: "examining",
    status: "In Progress",
    clinic: "Dentistry"
  },
  {
    id: "VST-003",
    patient_id: "PAT-003",
    patient_name: "Charlie Brown",
    doctor_id: "DOC-003",
    doctor_name: "Dr. Emily Chen",
    registration_staff_id: "STF-001",
    visit_datetime: "2023-11-20 10:00",
    visit_type: "general",
    payment_method: "cash",
    visit_status: "completed",
    status: "Completed",
    clinic: "General Practice"
  },
  {
    id: "VST-004",
    patient_id: "PAT-004",
    patient_name: "Diana Prince",
    doctor_id: "DOC-001",
    doctor_name: "Dr. Sarah Wilson",
    registration_staff_id: "STF-001",
    visit_datetime: "2023-11-21 09:00",
    visit_type: "general",
    payment_method: "bpjs",
    visit_status: "registered",
    status: "Scheduled",
    clinic: "Cardiology"
  },
];

export const users: User[] = [
  { id: "USR-001", username: "sarah.wilson", email: "sarah.wilson@hospital.com", role_id: "ROL-002", role_name: "Doctor", is_active: true, status: "Active" },
  { id: "USR-002", username: "john.doe", email: "john.doe@hospital.com", role_id: "ROL-003", role_name: "Registration", is_active: true, status: "Active" },
  { id: "USR-003", username: "jane.smith", email: "jane.smith@hospital.com", role_id: "ROL-004", role_name: "Pharmacy", is_active: true, status: "Active" },
  { id: "USR-004", username: "admin", email: "admin@hospital.com", role_id: "ROL-001", role_name: "Admin", is_active: true, status: "Active" },
];

export const invoices: Invoice[] = [
  {
    id: "INV-001",
    visit_id: "VST-001",
    cashier_id: "STF-001",
    invoice_number: "INV/2023/11/001",
    invoice_datetime: "2023-11-20",
    total_amount: 150000,
    total_discount: 0,
    amount_paid: 0,
    payment_status: "unpaid",
    status: "Pending",
    payment_method: "cash",
    items: [
      { id: "ITM-001", invoice_id: "INV-001", item_type: "doctor_fee", description: "Consultation Fee", quantity: 1, unit_price: 100000, subtotal: 100000 },
      { id: "ITM-002", invoice_id: "INV-001", item_type: "medicine", description: "Paracetamol", quantity: 1, unit_price: 50000, subtotal: 50000 }
    ]
  },
  {
    id: "INV-002",
    visit_id: "VST-002",
    cashier_id: "STF-001",
    invoice_number: "INV/2023/10/002",
    invoice_datetime: "2023-10-15",
    total_amount: 250000,
    total_discount: 0,
    amount_paid: 250000,
    payment_status: "paid",
    status: "Paid",
    payment_method: "credit",
    items: [
      { id: "ITM-003", invoice_id: "INV-002", item_type: "lab", description: "Lab Test: Lipid Profile", quantity: 1, unit_price: 250000, subtotal: 250000 }
    ]
  },
];

export const labOrders: LabOrder[] = [
  {
    id: "ORD-001",
    visit_id: "VST-001",
    doctor_id: "DOC-001",
    doctor_name: "Dr. Sarah Wilson",
    lab_test_id: "LAB-001",
    test_name: "Complete Blood Count",
    request_datetime: "2023-11-20",
    order_status: "completed",
    status: "Completed",
    result: {
      id: "RES-001",
      lab_order_id: "ORD-001",
      result_datetime: "2023-11-20",
      result_text: "Normal"
    }
  },
  {
    id: "ORD-002",
    visit_id: "VST-004",
    doctor_id: "DOC-001",
    doctor_name: "Dr. Sarah Wilson",
    lab_test_id: "LAB-004",
    test_name: "Blood Glucose",
    request_datetime: "2023-11-21",
    order_status: "requested",
    status: "Pending"
  }
];

// Wearable Data (Keep existing structure but maybe export types if needed)
export const prescriptions: Prescription[] = [
  {
    id: "PRE-001",
    visit_id: "VST-001",
    doctor_id: "DOC-001",
    doctor_name: "Dr. Sarah Wilson",
    prescription_status: "dispensed",
    status: "Active",
    date: "2023-11-20",
    items: [
      { id: "ITM-001", prescription_id: "PRE-001", medicine_id: "MED-001", medicine_name: "Paracetamol 500mg", quantity: 10, usage_instructions: "3x1 after meal" },
      { id: "ITM-002", prescription_id: "PRE-001", medicine_id: "MED-002", medicine_name: "Amoxicillin 500mg", quantity: 15, usage_instructions: "3x1 after meal" }
    ]
  },
  {
    id: "PRE-002",
    visit_id: "VST-002",
    doctor_id: "DOC-002",
    doctor_name: "Dr. James Brown",
    prescription_status: "created",
    status: "Pending",
    date: "2023-11-21",
    items: [
      { id: "ITM-003", prescription_id: "PRE-002", medicine_id: "MED-003", medicine_name: "Ibuprofen 400mg", quantity: 10, usage_instructions: "2x1 after meal" }
    ]
  }
];

export const medicalRecords: (MedicalRecord & { doctor_name: string; date: string })[] = [
  {
    id: "REC-001",
    visit_id: "VST-001",
    date: "2023-11-20",
    doctor_name: "Dr. Sarah Wilson",
    primary_diagnosis: "Common Cold",
    anamnesis: "Fever, cough, runny nose",
    treatment_plan: "Rest, plenty of fluids, medication",
    doctor_notes: "Patient advised to isolate for 3 days."
  },
  {
    id: "REC-002",
    visit_id: "VST-003",
    date: "2023-10-15",
    doctor_name: "Dr. Emily Chen",
    primary_diagnosis: "Hypertension",
    anamnesis: "Headache, dizziness",
    treatment_plan: "Lifestyle modification, anti-hypertensive medication",
    doctor_notes: "Monitor BP daily."
  }
];

export const patientProfile = {
  id: "PAT-001",
  name: "Alice Johnson",
  email: "alice.johnson@example.com",
  phone: "081234567890",
  memberSince: "Jan 2023",
  nik: "3201234567890001",
  bpjs: "0001234567890",
  birthDate: "1990-05-15",
  gender: "Female",
  bloodType: "O+",
  maritalStatus: "Single",
  address: "Jl. Merdeka No. 10",
  city: "Jakarta",
  province: "DKI Jakarta",
  postalCode: "10110",
  emergencyContact: {
    name: "Bob Johnson",
    relationship: "Father",
    phone: "081234567899"
  }
};

export const bpData = [
  { time: "Mon", systolic: 120, diastolic: 80 },
  { time: "Tue", systolic: 118, diastolic: 78 },
  { time: "Wed", systolic: 122, diastolic: 82 },
  { time: "Thu", systolic: 119, diastolic: 79 },
  { time: "Fri", systolic: 121, diastolic: 81 },
  { time: "Sat", systolic: 120, diastolic: 80 },
  { time: "Sun", systolic: 118, diastolic: 78 },
];

export const spo2Data = [
  { time: "08:00", value: 98 },
  { time: "10:00", value: 99 },
  { time: "12:00", value: 97 },
  { time: "14:00", value: 98 },
  { time: "16:00", value: 99 },
];

export const stepsData = [
  { time: "Mon", value: 5000 },
  { time: "Tue", value: 7500 },
  { time: "Wed", value: 6000 },
  { time: "Thu", value: 8000 },
  { time: "Fri", value: 5500 },
  { time: "Sat", value: 9000 },
  { time: "Sun", value: 4000 },
];

export const heartRateData = [
  { time: "08:00", value: 72 },
  { time: "09:00", value: 75 },
  { time: "10:00", value: 82 },
  { time: "11:00", value: 78 },
  { time: "12:00", value: 74 },
  { time: "13:00", value: 70 },
  { time: "14:00", value: 76 },
  { time: "15:00", value: 80 },
  { time: "16:00", value: 75 },
  { time: "17:00", value: 72 },
];

export const recentRegistrations = [
  {
    id: "REG-001",
    time: "08:15",
    name: "Alice Johnson",
    type: "New Patient",
  },
  {
    id: "REG-002",
    time: "08:30",
    name: "Bob Smith",
    type: "Follow Up",
  },
  {
    id: "REG-003",
    time: "09:00",
    name: "Charlie Brown",
    type: "Emergency",
  },
  {
    id: "REG-004",
    time: "09:15",
    name: "Diana Prince",
    type: "New Patient",
  },
  {
    id: "REG-005",
    time: "09:45",
    name: "Evan Wright",
    type: "Follow Up",
  },
];
