from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from uuid import UUID

from app.services.base_service import BaseService
from app.db.models import Activity
from app.integrations.google_translate import get_google_translate_client

# Languages to translate to (excluding English)
TARGET_LANGUAGES = ["zh", "ms", "ta"]


class ActivityService(BaseService[Activity]):
    """Service for activity operations"""
    
    def __init__(self, db: Session):
        super().__init__(Activity, db)
    
    def translate_activity_content(self, title: str, description: Optional[str] = None) -> Dict[str, str]:
        """
        Translate activity title and description to all supported languages.
        
        Returns dict with keys like title_zh, title_ms, title_ta, description_zh, etc.
        """
        translations = {}
        translate_client = get_google_translate_client()
        
        for lang in TARGET_LANGUAGES:
            try:
                # Translate title
                translations[f"title_{lang}"] = translate_client.translate(
                    title,
                    source_language="en",
                    target_language=lang
                )
                
                # Translate description if provided
                if description:
                    translations[f"description_{lang}"] = translate_client.translate(
                        description,
                        source_language="en",
                        target_language=lang
                    )
            except Exception as e:
                print(f"[ActivityService] Translation error for {lang}: {e}")
                # Continue with other languages even if one fails
        
        return translations
    
    def create_with_translations(self, data: Dict[str, Any]) -> Activity:
        """
        Create an activity and automatically translate title/description.
        """
        # Get translations
        translations = self.translate_activity_content(
            title=data.get("title", ""),
            description=data.get("description")
        )
        
        # Merge translations with activity data
        activity_data = {**data, **translations}
        
        # Create the activity
        activity = Activity(**activity_data)
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        
        return activity
    
    def get_by_date(self, activity_date: date) -> List[Activity]:
        """Get all activities on a specific date"""
        return self.db.query(Activity).filter(Activity.date == activity_date).all()
    
    def get_by_program_type(self, program_type: str) -> List[Activity]:
        """Get activities by program type"""
        return self.db.query(Activity).filter(Activity.program_type == program_type).all()
    
    def get_upcoming(self, limit: int = 10) -> List[Activity]:
        """Get upcoming activities"""
        today = date.today()
        return (
            self.db.query(Activity)
            .filter(Activity.date >= today)
            .order_by(Activity.date, Activity.start_time)
            .limit(limit)
            .all()
        )
    
    def get_with_filters(
        self,
        date_filter: Optional[date] = None,
        program_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Activity]:
        """Get activities with optional filters"""
        query = self.db.query(Activity)
        
        if date_filter:
            query = query.filter(Activity.date == date_filter)
        
        if program_type:
            query = query.filter(Activity.program_type == program_type)
        
        return query.order_by(Activity.date.desc()).offset(skip).limit(limit).all()
    
    def increment_participants(self, activity_id: UUID) -> bool:
        """Increment participant count"""
        activity = self.get_by_id(activity_id)
        if not activity:
            return False
        
        activity.current_participants += 1
        self.db.commit()
        return True
    
    def decrement_participants(self, activity_id: UUID) -> bool:
        """Decrement participant count"""
        activity = self.get_by_id(activity_id)
        if not activity or activity.current_participants <= 0:
            return False
        
        activity.current_participants -= 1
        self.db.commit()
        return True
    
    def is_full(self, activity_id: UUID) -> bool:
        """Check if activity is at capacity"""
        activity = self.get_by_id(activity_id)
        if not activity:
            return True
        
        return activity.current_participants >= activity.max_capacity
