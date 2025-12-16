from fastapi import APIRouter

from backend.api.routes import (
    auth_route,
    clinic_route,
    health_route,
    invoice_route,
    lab_route,
    medical_record_route,
    medicine_route,
    prescription_route,
    profile_route,
    referral_route,
    user_route,
    visit_route,
    wearable_route,
)

api_router = APIRouter()

api_router.include_router(auth_route.router) # /auth
api_router.include_router(user_route.router) # /users
api_router.include_router(clinic_route.router) # /clinics (Admin)
api_router.include_router(profile_route.router) # /profile

# api_router.include_router(staff_routes.staff_router) # Moved
# api_router.include_router(doctor_routes.doctor_router) # Moved
# api_router.include_router(patient_routes.patient_router) # Moved
# api_router.include_router(admin_route.router) # Moved

api_router.include_router(visit_route.router)
api_router.include_router(medical_record_route.router)
api_router.include_router(medicine_route.router)
api_router.include_router(prescription_route.router)
api_router.include_router(lab_route.router)
api_router.include_router(referral_route.router)
api_router.include_router(invoice_route.router)
api_router.include_router(wearable_route.router)
api_router.include_router(health_route.router)
