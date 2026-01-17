import csv
from io import StringIO
from typing import List, Dict
from datetime import date, time


def format_csv_attendance(
    participants: List[Dict],
    volunteers: List[Dict],
    activity_title: str
) -> str:
    """
    Format attendance data as CSV string
    
    Args:
        participants: List of participant dicts
        volunteers: List of volunteer dicts
        activity_title: Activity name
    
    Returns:
        CSV string
    """
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([f"Attendance Report: {activity_title}"])
    writer.writerow([])
    writer.writerow(["Name", "Email", "Phone", "Role", "Registration Time"])
    
    # Write participants
    for p in participants:
        writer.writerow([
            p.get('name', ''),
            p.get('email', ''),
            p.get('phone', ''),
            'Participant',
            p.get('registered_at', '')
        ])
    
    # Write volunteers
    for v in volunteers:
        writer.writerow([
            v.get('name', ''),
            v.get('email', ''),
            v.get('phone', ''),
            'Volunteer',
            v.get('matched_at', '')
        ])
    
    return output.getvalue()


def format_date_display(d: date) -> str:
    """
    Format date for display
    
    Returns format like "Monday, 15 Jan 2026"
    """
    return d.strftime("%A, %d %b %Y")


def format_time_display(t: time) -> str:
    """
    Format time for display
    
    Returns format like "9:00 AM"
    """
    return t.strftime("%I:%M %p")


def format_activity_summary(activity: Dict) -> str:
    """
    Format activity details as text summary
    
    Used for notifications and accessibility
    """
    return (
        f"{activity['title']}\n"
        f"Date: {format_date_display(activity['date'])}\n"
        f"Time: {format_time_display(activity['start_time'])} - {format_time_display(activity['end_time'])}\n"
        f"Location: {activity['location']}\n"
        f"Spots Available: {activity['max_capacity'] - activity['current_participants']}/{activity['max_capacity']}"
    )
