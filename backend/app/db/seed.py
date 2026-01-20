"""
Seed script to populate the database with sample activity data.
Run from the backend directory: python -m app.db.seed

IMPORTANT: The UUIDs here are synchronized with frontend/src/mocks/activities.mock.js
Any changes to activities should be made in both files to keep them in sync.
"""

from datetime import date, time
from uuid import UUID
from sqlalchemy import text

from app.db.session import SessionLocal
from app.db.models import Activity


# Fixed UUIDs for activities - MUST match frontend/src/mocks/activities.mock.js
# Format: 00000000-0000-4000-a000-00000000000X where X is the activity number
ACTIVITY_UUIDS = {
    1: UUID("00000000-0000-4000-a000-000000000001"),
    2: UUID("00000000-0000-4000-a000-000000000002"),
    3: UUID("00000000-0000-4000-a000-000000000003"),
    4: UUID("00000000-0000-4000-a000-000000000004"),
    5: UUID("00000000-0000-4000-a000-000000000005"),
    6: UUID("00000000-0000-4000-a000-000000000006"),
    7: UUID("00000000-0000-4000-a000-000000000007"),
    8: UUID("00000000-0000-4000-a000-000000000008"),
    9: UUID("00000000-0000-4000-a000-000000000009"),
    10: UUID("00000000-0000-4000-a000-000000000010"),
    11: UUID("00000000-0000-4000-a000-000000000011"),
    12: UUID("00000000-0000-4000-a000-000000000012"),
    13: UUID("00000000-0000-4000-a000-000000000013"),
}

# Sample activities data (matching frontend mock data)
# SYNC NOTE: Keep this in sync with frontend/src/mocks/activities.mock.js
SAMPLE_ACTIVITIES = [
    {
        "id": ACTIVITY_UUIDS[1],
        "title": "Morning Yoga Session",
        "description": "Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!",
        "date": date(2026, 1, 22),
        "start_time": time(9, 0, 0),
        "end_time": time(10, 30, 0),
        "location": "Main Hall",
        "max_capacity": 20,
        "current_participants": 12,
        "program_type": "wellness",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[2],
        "title": "Arts & Crafts Workshop",
        "description": "Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!",
        "date": date(2026, 1, 22),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 0, 0),
        "location": "Creative Studio",
        "max_capacity": 15,
        "current_participants": 8,
        "program_type": "arts",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[3],
        "title": "Basketball Practice",
        "description": "Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.",
        "date": date(2026, 1, 23),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Sports Hall",
        "max_capacity": 25,
        "current_participants": 18,
        "program_type": "sports",
        "wheelchair_accessible": False,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[4],
        "title": "Music Jam Session",
        "description": "Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.",
        "date": date(2026, 1, 23),
        "start_time": time(15, 0, 0),
        "end_time": time(17, 0, 0),
        "location": "Music Room",
        "max_capacity": 12,
        "current_participants": 10,
        "program_type": "music",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[5],
        "title": "Swimming Lessons",
        "description": "Learn to swim or improve your technique with certified instructors. Swimwear and towel required.",
        "date": date(2026, 1, 24),
        "start_time": time(11, 0, 0),
        "end_time": time(12, 30, 0),
        "location": "Swimming Pool",
        "max_capacity": 10,
        "current_participants": 10,
        "program_type": "sports",
        "wheelchair_accessible": True,
        "payment_required": True
    },
    {
        "id": ACTIVITY_UUIDS[6],
        "title": "Cooking Class: Healthy Snacks",
        "description": "Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!",
        "date": date(2026, 1, 25),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Kitchen",
        "max_capacity": 12,
        "current_participants": 7,
        "program_type": "educational",
        "wheelchair_accessible": True,
        "payment_required": True
    },
    {
        "id": ACTIVITY_UUIDS[7],
        "title": "Dance Party",
        "description": "Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!",
        "date": date(2026, 1, 25),
        "start_time": time(15, 0, 0),
        "end_time": time(16, 30, 0),
        "location": "Main Hall",
        "max_capacity": 30,
        "current_participants": 22,
        "program_type": "social",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[8],
        "title": "Gardening Workshop",
        "description": "Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!",
        "date": date(2026, 1, 26),
        "start_time": time(9, 0, 0),
        "end_time": time(11, 0, 0),
        "location": "Garden Area",
        "max_capacity": 15,
        "current_participants": 9,
        "program_type": "educational",
        "wheelchair_accessible": False,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[9],
        "title": "Movie Afternoon",
        "description": "Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.",
        "date": date(2026, 1, 26),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 30, 0),
        "location": "Theater Room",
        "max_capacity": 40,
        "current_participants": 28,
        "program_type": "social",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[10],
        "title": "Painting Class",
        "description": "Express yourself through colors! Learn basic painting techniques or create your own masterpiece.",
        "date": date(2026, 1, 27),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Art Studio",
        "max_capacity": 15,
        "current_participants": 11,
        "program_type": "arts",
        "wheelchair_accessible": True,
        "payment_required": True
    },
    {
        "id": ACTIVITY_UUIDS[11],
        "title": "Table Tennis Tournament",
        "description": "Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.",
        "date": date(2026, 1, 28),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 0, 0),
        "location": "Recreation Room",
        "max_capacity": 16,
        "current_participants": 14,
        "program_type": "sports",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[12],
        "title": "Mindfulness & Meditation",
        "description": "Calm your mind and reduce stress through guided meditation and mindfulness practices.",
        "date": date(2026, 1, 29),
        "start_time": time(9, 0, 0),
        "end_time": time(10, 0, 0),
        "location": "Quiet Room",
        "max_capacity": 20,
        "current_participants": 13,
        "program_type": "wellness",
        "wheelchair_accessible": True,
        "payment_required": False
    },
    {
        "id": ACTIVITY_UUIDS[13],
        "title": "Board Games Day",
        "description": "A fun day of board games with friends. Chess, Scrabble, Monopoly, and more!",
        "date": date(2026, 1, 15),
        "start_time": time(14, 0, 0),
        "end_time": time(17, 0, 0),
        "location": "Recreation Room",
        "max_capacity": 20,
        "current_participants": 18,
        "program_type": "social",
        "wheelchair_accessible": True,
        "payment_required": False
    }
]


def seed_activities(clear_existing: bool = False):
    """
    Seed the database with sample activities.
    
    Args:
        clear_existing: If True, delete all existing activities before seeding
    """
    db = SessionLocal()
    
    try:
        if clear_existing:
            # Delete all existing activities
            deleted = db.query(Activity).delete()
            db.commit()
            print(f"Deleted {deleted} existing activities")
        
        # Check how many activities already exist
        existing_count = db.query(Activity).count()
        if existing_count > 0 and not clear_existing:
            print(f"Database already has {existing_count} activities.")
            print("Run with --clear flag to delete existing activities before seeding.")
            return
        
        # Insert sample activities with fixed UUIDs
        for activity_data in SAMPLE_ACTIVITIES:
            activity = Activity(**activity_data)
            db.add(activity)
        
        db.commit()
        print(f"Successfully seeded {len(SAMPLE_ACTIVITIES)} activities!")
        
        # List the seeded activities
        activities = db.query(Activity).order_by(Activity.date, Activity.start_time).all()
        print("\nSeeded activities:")
        print("-" * 60)
        for activity in activities:
            print(f"  {activity.id} | {activity.date} {activity.start_time.strftime('%H:%M')} - {activity.title}")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


def generate_sql():
    """Generate SQL statements for direct Supabase insertion."""
    print("-- SQL to seed activities in Supabase")
    print("-- Run this in the Supabase SQL Editor")
    print("")
    print("-- Clear existing activities (optional)")
    print("-- DELETE FROM activities;")
    print("")
    print("INSERT INTO activities (id, title, description, date, start_time, end_time, location, max_capacity, current_participants, program_type, wheelchair_accessible, payment_required, created_at)")
    print("VALUES")
    
    values = []
    for activity in SAMPLE_ACTIVITIES:
        wheelchair = "TRUE" if activity.get("wheelchair_accessible", True) else "FALSE"
        payment = "TRUE" if activity.get("payment_required", False) else "FALSE"
        value = f"""  ('{activity["id"]}', '{activity["title"].replace("'", "''")}', '{activity["description"].replace("'", "''")}', '{activity["date"]}', '{activity["start_time"]}', '{activity["end_time"]}', '{activity["location"]}', {activity["max_capacity"]}, {activity["current_participants"]}, '{activity["program_type"]}', {wheelchair}, {payment}, NOW())"""
        values.append(value)
    
    print(",\n".join(values))
    print("ON CONFLICT (id) DO UPDATE SET")
    print("  title = EXCLUDED.title,")
    print("  description = EXCLUDED.description,")
    print("  date = EXCLUDED.date,")
    print("  start_time = EXCLUDED.start_time,")
    print("  end_time = EXCLUDED.end_time,")
    print("  location = EXCLUDED.location,")
    print("  max_capacity = EXCLUDED.max_capacity,")
    print("  current_participants = EXCLUDED.current_participants,")
    print("  program_type = EXCLUDED.program_type,")
    print("  wheelchair_accessible = EXCLUDED.wheelchair_accessible,")
    print("  payment_required = EXCLUDED.payment_required;")


if __name__ == "__main__":
    import sys
    
    if "--sql" in sys.argv:
        generate_sql()
    else:
        clear_existing = "--clear" in sys.argv
        seed_activities(clear_existing=clear_existing)
