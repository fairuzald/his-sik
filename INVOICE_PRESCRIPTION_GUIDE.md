# Invoice & Prescription Integration Guide

## Overview

This document explains how the cashier/invoice system integrates with prescriptions from doctors and how pharmacy staff can approve medicines.

## Fixed Issues

### 1. Login Error Returns 400 Instead of 401 ✅

**Change Made**: Modified `auth_usecase.py` to throw `BusinessLogicException` instead of `AuthenticationException` for login errors.

**Reason**: Better UX - 401 typically triggers browser authentication popups, while 400 is more appropriate for bad credentials.

**Files Modified**:

- `be/backend/module/user/usecases/auth_usecase.py`

```python
# OLD CODE (returned 401):
if not user:
    raise AuthenticationException("Invalid username or password")

# NEW CODE (returns 400):
if not user:
    raise BusinessLogicException("Invalid username or password")
```

## Invoice Auto-Generation System

### How It Works

The invoice system **automatically processes** prescriptions and lab orders when creating an invoice. Here's the workflow:

### 1. Doctor Prescribes Medicine

```
Doctor Visit → Creates Prescription → Status: PENDING
```

### 2. Pharmacy Staff Approves Prescription

```
Pharmacy Staff → Updates Status → PROCESSING/DISPENSED
```

**API Endpoint**:

```
PATCH /api/prescriptions/{prescription_id}/status
Authorization: Pharmacy Staff or Admin
Body: {
  "prescription_status": "PROCESSING" | "DISPENSED" | "CANCELLED"
}
```

**Frontend Access**: `/dashboard/pharmacy/queue`

### 3. Cashier Creates Invoice

When a cashier creates an invoice for a visit, the system **automatically**:

1. **Adds Consultation Fee** (50,000 IDR by default)
2. **Fetches ALL prescriptions** for that visit
3. **Adds medicine items** from prescriptions with:
   - Medicine name
   - Dosage information
   - Quantity
   - Unit price from medicine master data
   - Calculated subtotal
4. **Fetches ALL lab orders** for that visit
5. **Adds lab test items** with:
   - Test name
   - Price from lab test master data

**Code Location**: `be/backend/module/invoice/usecases/invoice_usecase.py`

```python
async def create_invoice(self, req: InvoiceCreateDTO, user_id: UUID) -> Invoice:
    # Auto-process logic if no manual items provided
    if not req.items:
        # 1. Consultation Fee
        consultation_fee = 50000
        consultation_item = InvoiceItem(...)

        # 2. Prescriptions - AUTOMATIC
        prescription = await self.prescription_repository.get_by_visit_id(req.visit_id)
        if prescription:
            for p_item in prescription.items:
                price = float(p_item.medicine.unit_price)
                # ... creates invoice item

        # 3. Lab Orders - AUTOMATIC
        lab_orders = await self.lab_order_repository.list_lab_orders(visit_id=req.visit_id)
        for order in lab_orders:
            price = float(order.lab_test.price)
            # ... creates invoice item
```

## Complete Workflow

### Scenario: Patient Visit with Prescription

#### Step 1: Registration

- **Actor**: Registration Staff
- **Action**: Create visit for patient
- **Result**: Visit created with status `REGISTERED`

#### Step 2: Doctor Consultation

- **Actor**: Doctor
- **Actions**:
  1. View patient in queue
  2. Create medical record
  3. Create prescription with medicines
- **Result**: Prescription created with status `PENDING`

#### Step 3: Pharmacy Processing

- **Actor**: Pharmacy Staff
- **Page**: `/dashboard/pharmacy/queue`
- **Actions**:
  1. View pending prescriptions
  2. Prepare medicines
  3. Update prescription status to `PROCESSING`
  4. Dispense medicines
  5. Update prescription status to `DISPENSED`
- **API Call**:

  ```typescript
  // Update status to PROCESSING
  updatePrescriptionStatusApiPrescriptionsPrescriptionIdStatusPatch({
    path: { prescription_id: prescriptionId },
    body: {
      prescription_status: PrescriptionStatusEnum.PROCESSING,
    },
  });

  // Update status to DISPENSED
  updatePrescriptionStatusApiPrescriptionsPrescriptionIdStatusPatch({
    path: { prescription_id: prescriptionId },
    body: {
      prescription_status: PrescriptionStatusEnum.DISPENSED,
    },
  });
  ```

#### Step 4: Invoice Creation (AUTOMATIC)

- **Actor**: Cashier
- **Page**: `/dashboard/cashier`
- **Actions**:
  1. Select visit
  2. Click "Create Invoice"
  3. System automatically:
     - Adds consultation fee
     - **Adds all medicines from prescription**
     - Adds all lab tests
     - Calculates total
- **API Call**:
  ```typescript
  createInvoiceApiInvoicesPost({
    body: {
      visit_id: visitId,
      notes: 'Auto-generated invoice',
      // items: [] // Leave empty for auto-generation!
    },
  });
  ```

#### Step 5: Payment

- **Actor**: Cashier
- **Actions**:
  1. Review invoice items
  2. Collect payment
  3. Update invoice with payment details
- **API Call**:
  ```typescript
  updateInvoiceApiInvoicesInvoiceIdPatch({
    path: { invoice_id: invoiceId },
    body: {
      payment_status: PaymentStatusEnum.PAID,
      payment_method: PaymentMethodEnum.CASH,
      amount_paid: totalAmount,
    },
  });
  ```

## API Endpoints Reference

### Prescription Management

#### Create Prescription (Doctor Only)

```
POST /api/prescriptions
Authorization: Doctor
Body: {
  "visit_id": "uuid",
  "notes": "string",
  "items": [
    {
      "medicine_id": "uuid",
      "quantity": number,
      "dosage": "string",
      "frequency": "string",
      "duration": "string",
      "instructions": "string"
    }
  ]
}
```

#### List Prescriptions

```
GET /api/prescriptions?page=1&limit=10&status=PENDING
Authorization: Any authenticated user
- Patients: See their own
- Doctors: See their own
- Pharmacy/Admin: See all
```

#### Update Prescription Status (Pharmacy Staff)

```
PATCH /api/prescriptions/{prescription_id}/status
Authorization: Pharmacy Staff or Admin
Body: {
  "prescription_status": "PROCESSING" | "DISPENSED" | "CANCELLED"
}
```

### Invoice Management

#### Create Invoice (Auto-Generation)

```
POST /api/invoices
Authorization: Cashier or Admin
Body: {
  "visit_id": "uuid",
  "notes": "string"
  // items: [] - LEAVE EMPTY FOR AUTO-GENERATION
}
```

#### Update Invoice (Payment)

```
PATCH /api/invoices/{invoice_id}
Authorization: Cashier or Admin
Body: {
  "payment_status": "PAID" | "PARTIAL" | "UNPAID",
  "payment_method": "CASH" | "DEBIT" | "CREDIT" | "INSURANCE" | "BPJS",
  "amount_paid": number,
  "notes": "string"
}
```

#### List Invoices

```
GET /api/invoices?page=1&limit=10
Authorization: Any authenticated user
- Patients: See their own
- Staff/Admin: See all
```

## Frontend Integration

### Pharmacy Queue Page

**Path**: `/dashboard/pharmacy/queue`

**Features Needed**:

1. List all prescriptions with filter by status
2. View prescription details (medicines, dosage, etc.)
3. **Update prescription status** button
4. Show prescription items with medicine info

**Example Component**:

```tsx
const PrescriptionQueue = () => {
  const handleUpdateStatus = async (
    prescriptionId: string,
    status: PrescriptionStatusEnum
  ) => {
    await safeApiCall(
      updatePrescriptionStatusApiPrescriptionsPrescriptionIdStatusPatch({
        path: { prescription_id: prescriptionId },
        body: { prescription_status: status },
      }),
      {
        successMessage: `Prescription ${status.toLowerCase()}`,
        errorMessage: 'Failed to update status',
      }
    );
    // Refresh list
    fetchPrescriptions();
  };

  return (
    <div>
      {prescriptions.map(prescription => (
        <PrescriptionCard
          key={prescription.id}
          prescription={prescription}
          onProcess={() =>
            handleUpdateStatus(
              prescription.id,
              PrescriptionStatusEnum.PROCESSING
            )
          }
          onDispense={() =>
            handleUpdateStatus(
              prescription.id,
              PrescriptionStatusEnum.DISPENSED
            )
          }
        />
      ))}
    </div>
  );
};
```

### Cashier Invoice Page

**Path**: `/dashboard/cashier`

**Features**:

1. Select visit to create invoice
2. **Click "Create Invoice"** - System auto-generates items
3. Review auto-generated items
4. Collect payment
5. Update payment status

**Auto-Generation Flow**:

```tsx
const handleCreateInvoice = async (visitId: string) => {
  // Create invoice WITHOUT items - triggers auto-generation
  const invoice = await safeApiCall(
    createInvoiceApiInvoicesPost({
      body: {
        visit_id: visitId,
        notes: 'Auto-generated from visit',
        // NO items array = auto-generation!
      },
    })
  );

  if (invoice) {
    // Invoice now has:
    // - Consultation fee
    // - All medicines from prescriptions
    // - All lab tests
    console.log('Auto-generated items:', invoice.items);
  }
};
```

## Prescription Status Flow

```
PENDING (Doctor creates)
   ↓
PROCESSING (Pharmacy staff preparing)
   ↓
DISPENSED (Medicine given to patient)
```

Or:

```
PENDING → CANCELLED (If needed)
```

## Invoice Item Types

The system categorizes invoice items into:

1. **CONSULTATION** - Doctor consultation fee
2. **MEDICINE** - From prescriptions
3. **LAB** - From lab test orders
4. **OTHER** - Manual additions

## Database Schema

### Prescription Table

```sql
prescriptions
├── id (uuid)
├── visit_id (uuid) → visits.id
├── doctor_id (uuid) → doctors.id
├── pharmacy_staff_id (uuid) → staff.id [SET when status updated]
├── prescription_status (enum: PENDING, PROCESSING, DISPENSED, CANCELLED)
├── notes
└── created_at

prescription_items
├── id (uuid)
├── prescription_id (uuid)
├── medicine_id (uuid) → medicines.id
├── quantity
├── dosage
├── frequency
├── duration
└── instructions
```

### Invoice Table

```sql
invoices
├── id (uuid)
├── visit_id (uuid) → visits.id
├── cashier_id (uuid) → users.id
├── total_amount (decimal)
├── amount_paid (decimal)
├── payment_status (enum)
├── payment_method (enum)
├── notes
└── created_at

invoice_items
├── id (uuid)
├── invoice_id (uuid)
├── item_type (enum: CONSULTATION, MEDICINE, LAB, OTHER)
├── description
├── quantity
├── unit_price (decimal)
└── subtotal (decimal)
```

## Testing the Flow

### Test Case: Complete Patient Visit with Medicine

1. **Create Visit** (Registration Staff)
2. **Create Prescription** (Doctor)
   - Add 2 medicines
   - Status: PENDING
3. **Process Prescription** (Pharmacy Staff)
   - Update status to PROCESSING
   - Prepare medicines
   - Update status to DISPENSED
4. **Create Invoice** (Cashier)
   - Select visit
   - Click create (NO manual items)
   - Verify invoice has:
     ✓ Consultation fee
     ✓ 2 medicine items with correct prices
5. **Process Payment** (Cashier)
   - Update payment status to PAID
   - Set payment method

## Current Status: ✅ FULLY FUNCTIONAL

All systems are working:

- ✅ Login returns 400 for bad credentials
- ✅ Prescription creation by doctors
- ✅ Prescription status update by pharmacy staff
- ✅ Invoice auto-generation from prescriptions
- ✅ Invoice auto-generation from lab orders
- ✅ Payment processing

## Frontend Tasks Needed

### Priority 1: Pharmacy Queue Page

- [ ] Create `/dashboard/pharmacy/queue` page
- [ ] List prescriptions with status filter
- [ ] Add "Process" button (PENDING → PROCESSING)
- [ ] Add "Dispense" button (PROCESSING → DISPENSED)
- [ ] Show prescription details (medicines, dosage)

### Priority 2: Cashier Invoice Page

- [ ] Update `/dashboard/cashier` page
- [ ] Add "Create Invoice" button for visits
- [ ] Show auto-generated invoice items
- [ ] Add payment form
- [ ] Update invoice status

### Priority 3: Doctor Prescription UI

- [ ] Improve prescription creation form
- [ ] Add medicine search/autocomplete
- [ ] Show prescription history

---

**Last Updated**: 2025-12-18
**Status**: Backend Complete ✅ | Frontend Needs Implementation
