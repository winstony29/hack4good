from datetime import time, date, datetime, timedelta
from typing import Tuple


def time_overlaps(
    start1: time,
    end1: time,
    start2: time,
    end2: time
) -> bool:
    """
    Check if two time ranges overlap
    
    Args:
        start1, end1: First time range
        start2, end2: Second time range
    
    Returns:
        True if ranges overlap, False otherwise
    """
    return start1 < end2 and start2 < end1


def get_week_boundaries(target_date: date) -> Tuple[date, date]:
    """
    Get Monday and Sunday for the week containing target_date
    
    Args:
        target_date: Any date within the week
    
    Returns:
        Tuple of (week_start, week_end) as dates
    """
    # Monday is 0, Sunday is 6
    week_start = target_date - timedelta(days=target_date.weekday())
    week_end = week_start + timedelta(days=6)
    return week_start, week_end


def is_past_datetime(activity_date: date, activity_time: time) -> bool:
    """
    Check if activity datetime is in the past
    
    Args:
        activity_date: Activity date
        activity_time: Activity start time
    
    Returns:
        True if activity is in the past
    """
    activity_datetime = datetime.combine(activity_date, activity_time)
    return activity_datetime < datetime.now()


def format_time_range(start: time, end: time) -> str:
    """
    Format time range as human-readable string
    
    Args:
        start, end: Time range
    
    Returns:
        Formatted string like "9:00 AM - 11:00 AM"
    """
    return f"{start.strftime('%I:%M %p')} - {end.strftime('%I:%M %p')}"


def get_upcoming_dates(days: int = 30) -> list[date]:
    """
    Get list of dates for the next N days
    
    Args:
        days: Number of days to include
    
    Returns:
        List of dates starting from today
    """
    today = date.today()
    return [today + timedelta(days=i) for i in range(days)]
