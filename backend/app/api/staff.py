from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import Dict, List
from uuid import UUID
from datetime import date

from app.core.auth import get_current_staff
from app.core.deps import get_db
from app.services.analytics_service import AnalyticsService
from app.db.models import Activity

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
    # TODO: Fetch attendance data
    # Format as CSV
    # Return file response
    csv_content = "Name,Email,Phone,Role,Registration Time\n"
    
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
