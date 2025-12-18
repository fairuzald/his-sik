# Fix: Flexible Patient ID Lookup for Wearable Measurements

## Problem

Doctors couldn't view wearable measurements on the visit detail page because:

- **Doctor's visit detail page** passes `visit.patient_id` (patient profile ID)
- **Patient's wearables page** passes `profile.id` (user ID)
- **Backend** was only supporting one type of ID

## Root Cause

Different contexts provide different ID types:

| Context                   | ID Available       | ID Type                   |
| ------------------------- | ------------------ | ------------------------- |
| Patient viewing own data  | `profile.id`       | `user_id`                 |
| Doctor viewing from visit | `visit.patient_id` | `patient.id` (profile ID) |

### Database Schema

```
users:
  └─ id (user_id)

patients:
  ├─ id (patient profile ID) ← Visits reference this
  ├─ user_id (FK to users.id) ← Patients pass this
  └─ device_api_key

visits:
  └─ patient_id (FK to patients.id)

wearable_measurements:
  └─ device_api_key (FK to patients.device_api_key)
```

## Solution

**Make backend accept BOTH ID types** - Try `user_id` first, then fall back to `patient.id`

### Implementation

#### Repository Methods

**`get_patient_by_id(id_value)`** - Tries both ID types:

```python
async def get_patient_by_id(self, id_value: UUID) -> Patient | None:
    """
    Get patient by ID - tries both user_id and patient.id.
    """
    # First try user_id (patient viewing own data)
    stmt = select(Patient).where(Patient.user_id == id_value)
    result = await self.session.execute(stmt)
    patient = result.scalars().first()

    if patient:
        return patient

    # If not found, try patient.id (doctor viewing from visit)
    stmt = select(Patient).where(Patient.id == id_value)
    result = await self.session.execute(stmt)
    return result.scalars().first()
```

**`list_measurements_by_patient_id(id_value)`** - OR query for both:

```python
async def list_measurements_by_patient_id(self, id_value: UUID, ...):
    """
    List measurements - supports both user_id and patient.id.
    """
    # Query matches EITHER user_id OR patient.id
    stmt = (
        select(WearableMeasurement)
        .join(Patient, WearableMeasurement.device_api_key == Patient.device_api_key)
        .where(
            (Patient.user_id == id_value) | (Patient.id == id_value)
        )
    )
```

## Use Cases Supported

### Use Case 1: Patient Viewing Own Data

```typescript
// Frontend (patient wearables page)
const profile = await getMyProfileApiProfileMeGet();
const patientId = profile.id; // user_id

// API Call
GET /api/wearables/measurements?patient_id=<user_id>

// Backend SQL
SELECT * FROM wearable_measurements
JOIN patients ON wearable_measurements.device_api_key = patients.device_api_key
WHERE patients.user_id = '<user_id>' OR patients.id = '<user_id>'
```

### Use Case 2: Doctor Viewing Patient Data

```typescript
// Frontend (doctor visit detail page)
const visit = await getVisitApiVisitsVisitIdGet({...});
const patientId = visit.patient_id; // patient profile ID

// API Call
GET /api/wearables/measurements?patient_id=<patient_profile_id>

// Backend SQL
SELECT * FROM wearable_measurements
JOIN patients ON wearable_measurements.device_api_key = patients.device_api_key
WHERE patients.user_id = '<patient_id>' OR patients.id = '<patient_id>'
```

### Use Case 3: IoT Device Submitting Data

```bash
# Device uses device_api_key (unchanged)
POST /api/wearables/measurements
{
  "device_api_key": "550e8400-e29b-41d4-a716-446655440000",
  "heart_rate": 75,
  ...
}
```

## Benefits

✅ **Backward Compatible** - Existing patient page continues to work
✅ **Doctor Access** - Doctors can now view wearable data on visit details
✅ **Flexible** - Accepts any valid patient identifier
✅ **Efficient** - OR query in single database call
✅ **Clean API** - No breaking changes to API contract

## Performance Considerations

The OR query `(user_id = X OR id = X)` is efficient because:

1. Both `user_id` and `id` should be indexed
2. PostgreSQL query planner optimizes OR conditions on indexed columns
3. Only one value will match (IDs are unique)

### Index Recommendations

```sql
-- Ensure indexes exist
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_id ON patients(id);  -- Usually exists as PK
```

## Alternative Approaches Considered

### ❌ Option 1: Separate endpoints

```
GET /api/wearables/measurements/by-user?user_id=X
GET /api/wearables/measurements/by-patient?patient_id=X
```

**Rejected**: Unnecessary API complexity

### ❌ Option 2: Always pass both IDs

```
GET /api/wearables/measurements?user_id=X&patient_id=Y
```

**Rejected**: Frontend doesn't always have both IDs

### ✅ Option 3: Smart ID resolution (CHOSEN)

```
GET /api/wearables/measurements?patient_id=X  # Works with either ID type
```

**Benefits**: Clean API, flexible backend

## Testing

### Test Case 1: Patient queries with user_id

```bash
GET /api/wearables/measurements?patient_id=<user_id>
# ✅ Matches on Patient.user_id = <user_id>
```

### Test Case 2: Doctor queries with patient profile ID

```bash
GET /api/wearables/measurements?patient_id=<patient_profile_id>
# ✅ Matches on Patient.id = <patient_profile_id>
```

### Test Case 3: Invalid ID

```bash
GET /api/wearables/measurements?patient_id=invalid-uuid
# ❌ Returns "Patient not found"
```

## Files Changed

1. **`wearable_repository.py`**
   - `get_patient_by_id()` - Try both user_id and patient.id
   - `list_measurements_by_patient_id()` - OR query for both IDs

## Resolution

✅ Patient wearables page works (passes user_id)
✅ Doctor visit detail page works (passes patient.id)
✅ IoT devices continue to work (use device_api_key)
✅ Single clean API endpoint for all use cases

Both patient and doctor use cases are now fully supported! 🎉
