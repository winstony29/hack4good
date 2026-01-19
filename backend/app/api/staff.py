from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import Dict, List
from uuid import UUID
from datetime import date

from app.core.auth import get_current_staff
from app.core.deps import get_db
from app.services.analytics_service import AnalyticsService
from app.db.models import Activity, Registration, VolunteerMatch, User
from app.core.enums import RegistrationStatus

router = APIRouter()


@router.get("/analytics", response_model=Dict)
async def get_analytics(
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Get dashboard analytics

    Returns:
    - Total activities count
    - Total registrations count
    - Volunteer coverage percentage
    - Upcoming activities count
    - Popular programs
    - Registration trends
    """
    analytics_service = AnalyticsService(db)

    # Get base metrics from service
    metrics = analytics_service.get_dashboard_metrics()

    # Get weekly trends for chart data
    weekly_trends = analytics_service.get_weekly_trends()

    return {
        "total_activities": metrics["total_activities"],
        "total_registrations": metrics["total_registrations"],
        "total_volunteers": metrics["total_volunteers"],
        "volunteer_coverage": metrics["volunteer_coverage"],
        "upcoming_activities": metrics["upcoming_activities"],
        "weekly_registrations": weekly_trends
    }


@router.get("/attendance/{activity_id}")
async def get_activity_attendance(
    activity_id: UUID,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Get attendance list for an activity

    Returns:
    - List of registered participants
    - List of matched volunteers
    - Activity details
    """
    # Fetch activity, 404 if not found
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Get attendance data via service
    analytics_service = AnalyticsService(db)
    attendance = analytics_service.get_activity_attendance(str(activity_id))

    return {
        "activity": {
            "id": str(activity.id),
            "title": activity.title,
            "date": activity.date.isoformat() if activity.date else None,
            "start_time": activity.start_time.isoformat() if activity.start_time else None,
            "end_time": activity.end_time.isoformat() if activity.end_time else None,
            "location": activity.location
        },
        "participants": attendance["participants"],
        "volunteers": attendance["volunteers"]
    }


@router.get("/attendance/{activity_id}/export")
async def export_attendance_csv(
    activity_id: UUID,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Export attendance as CSV file

    CSV includes:
    - Participant name, email, phone
    - Registration time
    - Volunteer name, email, phone
    """
    # Fetch activity, 404 if not found
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )

    # Build CSV content with headers
    csv_content = "Name,Email,Phone,Role,Registration Time\n"

    # Get participants with registration timestamps
    participant_registrations = (
        db.query(User, Registration)
        .join(Registration, User.id == Registration.user_id)
        .filter(
            Registration.activity_id == activity_id,
            Registration.status == RegistrationStatus.CONFIRMED
        )
        .all()
    )

    for user, registration in participant_registrations:
        name = user.full_name or ""
        email = user.email or ""
        phone = user.phone or ""
        reg_time = registration.created_at.isoformat() if registration.created_at else ""
        # Escape any commas in fields
        csv_content += f'"{name}","{email}","{phone}","Participant","{reg_time}"\n'

    # Get volunteers with match timestamps
    volunteer_matches = (
        db.query(User, VolunteerMatch)
        .join(VolunteerMatch, User.id == VolunteerMatch.volunteer_id)
        .filter(
            VolunteerMatch.activity_id == activity_id,
            VolunteerMatch.status == RegistrationStatus.CONFIRMED
        )
        .all()
    )

    for user, match in volunteer_matches:
        name = user.full_name or ""
        email = user.email or ""
        phone = user.phone or ""
        match_time = match.matched_at.isoformat() if match.matched_at else ""
        csv_content += f'"{name}","{email}","{phone}","Volunteer","{match_time}"\n'

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=attendance_{activity_id}.csv"}
    )


@router.get("/reports/weekly")
async def get_weekly_report(
    start_date: date,
    end_date: date,
    current_user = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    """
    Get weekly activity report
    
    - Activities conducted
    - Total participants
    - Volunteer hours
    - Program type breakdown
    """
    # TODO: Generate report for date range
    return {
        "start_date": start_date,
        "end_date": end_date,
        "activities_count": 0,
        "participants_count": 0,
        "volunteers_count": 0,
        "program_breakdown": {}
    }
