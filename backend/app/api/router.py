from fastapi import APIRouter

from app.api import auth, activities, registrations, matches, notifications, staff, accessibility

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(activities.router, prefix="/activities", tags=["Activities"])
api_router.include_router(registrations.router, prefix="/registrations", tags=["Registrations"])
api_router.include_router(matches.router, prefix="/matches", tags=["Volunteer Matches"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
api_router.include_router(accessibility.router, prefix="/accessibility", tags=["Accessibility"])
