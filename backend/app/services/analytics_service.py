from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import Dict, List

from app.db.models import Activity, Registration, VolunteerMatch, User
from app.core.enums import RegistrationStatus, Role


class AnalyticsService:
    """Service for staff analytics and reporting"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard_metrics(self) -> Dict:
        """
        Get key metrics for staff dashboard
        
        Returns overview statistics
        """
        today = date.today()
        
        # Total counts
        total_activities = self.db.query(Activity).count()
        total_registrations = (
            self.db.query(Registration)
            .filter(Registration.status == RegistrationStatus.CONFIRMED)
            .count()
        )
        total_volunteers = (
            self.db.query(User)
            .filter(User.role == Role.VOLUNTEER)
            .count()
        )
        
        # Upcoming activities
        upcoming_activities = (
            self.db.query(Activity)
            .filter(Activity.date >= today)
            .count()
        )
        
        # Volunteer coverage (activities with volunteer matches / total activities)
        activities_with_volunteers = (
            self.db.query(Activity.id)
            .join(VolunteerMatch)
            .filter(Activity.date >= today)
            .distinct()
            .count()
        )
        
        volunteer_coverage = (
            (activities_with_volunteers / upcoming_activities * 100)
            if upcoming_activities > 0
            else 0
        )
        
        return {
            "total_activities": total_activities,
            "total_registrations": total_registrations,
            "total_volunteers": total_volunteers,
            "upcoming_activities": upcoming_activities,
            "volunteer_coverage": round(volunteer_coverage, 1)
        }
    
    def get_weekly_trends(self, weeks: int = 4) -> List[Dict]:
        """
        Get registration trends over past N weeks
        
        Returns weekly registration counts
        """
        today = date.today()
        trends = []
        
        for i in range(weeks):
            week_start = today - timedelta(days=(i + 1) * 7)
            week_end = week_start + timedelta(days=6)
            
            count = (
                self.db.query(Registration)
                .join(Activity)
                .filter(
                    Activity.date >= week_start,
                    Activity.date <= week_end,
                    Registration.status == RegistrationStatus.CONFIRMED
                )
                .count()
            )
            
            trends.append({
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat(),
                "registrations": count
            })
        
        return list(reversed(trends))
    
    def get_program_breakdown(self) -> Dict[str, int]:
        """
        Get breakdown of activities by program type
        
        Returns count per program type
        """
        results = (
            self.db.query(
                Activity.program_type,
                func.count(Activity.id).label('count')
            )
            .group_by(Activity.program_type)
            .all()
        )
        
        return {
            program_type or "Uncategorized": count
            for program_type, count in results
        }
    
    def get_activities_in_range(self, start_date: date, end_date: date) -> int:
        """
        Count activities within a date range

        Returns count of activities where date is between start and end (inclusive)
        """
        return (
            self.db.query(Activity)
            .filter(
                Activity.date >= start_date,
                Activity.date <= end_date
            )
            .count()
        )

    def get_registrations_in_range(self, start_date: date, end_date: date) -> Dict:
        """
        Get participant and volunteer counts for activities in date range

        Returns {"participants": int, "volunteers": int}
        """
        # Count confirmed participant registrations for activities in range
        participants = (
            self.db.query(Registration)
            .join(Activity)
            .filter(
                Activity.date >= start_date,
                Activity.date <= end_date,
                Registration.status == RegistrationStatus.CONFIRMED
            )
            .count()
        )

        # Count confirmed volunteer matches for activities in range
        volunteers = (
            self.db.query(VolunteerMatch)
            .join(Activity)
            .filter(
                Activity.date >= start_date,
                Activity.date <= end_date,
                VolunteerMatch.status == RegistrationStatus.CONFIRMED
            )
            .count()
        )

        return {
            "participants": participants,
            "volunteers": volunteers
        }

    def get_program_breakdown_in_range(self, start_date: date, end_date: date) -> Dict[str, int]:
        """
        Get breakdown of activities by program type within date range

        Returns count per program type for activities in range
        """
        results = (
            self.db.query(
                Activity.program_type,
                func.count(Activity.id).label('count')
            )
            .filter(
                Activity.date >= start_date,
                Activity.date <= end_date
            )
            .group_by(Activity.program_type)
            .all()
        )

        return {
            program_type or "Uncategorized": count
            for program_type, count in results
        }

    def get_activity_attendance(self, activity_id: str) -> Dict:
        """
        Get detailed attendance for a specific activity
        
        Returns participants and volunteers
        """
        # Get participants
        participants = (
            self.db.query(User)
            .join(Registration)
            .filter(
                Registration.activity_id == activity_id,
                Registration.status == RegistrationStatus.CONFIRMED
            )
            .all()
        )
        
        # Get volunteers
        volunteers = (
            self.db.query(User)
            .join(VolunteerMatch)
            .filter(
                VolunteerMatch.activity_id == activity_id,
                VolunteerMatch.status == RegistrationStatus.CONFIRMED
            )
            .all()
        )
        
        return {
            "participants": [
                {
                    "id": str(p.id),
                    "name": p.full_name,
                    "email": p.email,
                    "phone": p.phone
                }
                for p in participants
            ],
            "volunteers": [
                {
                    "id": str(v.id),
                    "name": v.full_name,
                    "email": v.email,
                    "phone": v.phone
                }
                for v in volunteers
            ]
        }
