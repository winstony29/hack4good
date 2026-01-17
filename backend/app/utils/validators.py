import re
from datetime import date, time


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Basic regex validation
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Validate phone number format
    
    Accepts E.164 format (+6512345678) and local Singapore format
    """
    # Remove spaces and dashes
    phone = phone.replace(" ", "").replace("-", "")
    
    # Check for E.164 format (+country code)
    if phone.startswith("+"):
        return len(phone) >= 10 and phone[1:].isdigit()
    
    # Check for local Singapore format (8 digits)
    return len(phone) == 8 and phone.isdigit()


def validate_activity_times(start: time, end: time) -> bool:
    """
    Validate activity start and end times
    
    Ensures start is before end
    """
    return start < end


def validate_future_date(activity_date: date) -> bool:
    """
    Validate that date is in the future
    
    Used for creating new activities
    """
    return activity_date >= date.today()


def validate_capacity(max_capacity: int, current_participants: int = 0) -> bool:
    """
    Validate activity capacity values
    
    Ensures positive capacity and current count doesn't exceed max
    """
    return max_capacity > 0 and current_participants <= max_capacity
