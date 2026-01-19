"""
Seed script to populate the database with sample activity data.
Run from the backend directory: python -m app.db.seed
"""

from datetime import date, time
import uuid
from sqlalchemy import text

from app.db.session import SessionLocal
from app.db.models import Activity


# Sample activities data (matching frontend mock data)
SAMPLE_ACTIVITIES = [
    {
        "title": "Morning Yoga Session",
        "description": "Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!",
        "date": date(2026, 1, 22),
        "start_time": time(9, 0, 0),
        "end_time": time(10, 30, 0),
        "location": "Main Hall",
        "max_capacity": 20,
        "current_participants": 12,
        "program_type": "wellness"
    },
    {
        "title": "Arts & Crafts Workshop",
        "description": "Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!",
        "date": date(2026, 1, 22),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 0, 0),
        "location": "Creative Studio",
        "max_capacity": 15,
        "current_participants": 8,
        "program_type": "arts"
    },
    {
        "title": "Basketball Practice",
        "description": "Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.",
        "date": date(2026, 1, 23),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Sports Hall",
        "max_capacity": 25,
        "current_participants": 18,
        "program_type": "sports"
    },
    {
        "title": "Music Jam Session",
        "description": "Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.",
        "date": date(2026, 1, 23),
        "start_time": time(15, 0, 0),
        "end_time": time(17, 0, 0),
        "location": "Music Room",
        "max_capacity": 12,
        "current_participants": 10,
        "program_type": "music"
    },
    {
        "title": "Swimming Lessons",
        "description": "Learn to swim or improve your technique with certified instructors. Swimwear and towel required.",
        "date": date(2026, 1, 24),
        "start_time": time(11, 0, 0),
        "end_time": time(12, 30, 0),
        "location": "Swimming Pool",
        "max_capacity": 10,
        "current_participants": 10,
        "program_type": "sports"
    },
    {
        "title": "Cooking Class: Healthy Snacks",
        "description": "Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!",
        "date": date(2026, 1, 25),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Kitchen",
        "max_capacity": 12,
        "current_participants": 7,
        "program_type": "educational"
    },
    {
        "title": "Dance Party",
        "description": "Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!",
        "date": date(2026, 1, 25),
        "start_time": time(15, 0, 0),
        "end_time": time(16, 30, 0),
        "location": "Main Hall",
        "max_capacity": 30,
        "current_participants": 22,
        "program_type": "social"
    },
    {
        "title": "Gardening Workshop",
        "description": "Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!",
        "date": date(2026, 1, 26),
        "start_time": time(9, 0, 0),
        "end_time": time(11, 0, 0),
        "location": "Garden Area",
        "max_capacity": 15,
        "current_participants": 9,
        "program_type": "educational"
    },
    {
        "title": "Movie Afternoon",
        "description": "Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.",
        "date": date(2026, 1, 26),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 30, 0),
        "location": "Theater Room",
        "max_capacity": 40,
        "current_participants": 28,
        "program_type": "social"
    },
    {
        "title": "Painting Class",
        "description": "Express yourself through colors! Learn basic painting techniques or create your own masterpiece.",
        "date": date(2026, 1, 27),
        "start_time": time(10, 0, 0),
        "end_time": time(12, 0, 0),
        "location": "Art Studio",
        "max_capacity": 15,
        "current_participants": 11,
        "program_type": "arts"
    },
    {
        "title": "Table Tennis Tournament",
        "description": "Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.",
        "date": date(2026, 1, 28),
        "start_time": time(14, 0, 0),
        "end_time": time(16, 0, 0),
        "location": "Recreation Room",
        "max_capacity": 16,
        "current_participants": 14,
        "program_type": "sports"
    },
    {
        "title": "Mindfulness & Meditation",
        "description": "Calm your mind and reduce stress through guided meditation and mindfulness practices.",
        "date": date(2026, 1, 29),
        "start_time": time(9, 0, 0),
        "end_time": time(10, 0, 0),
        "location": "Quiet Room",
        "max_capacity": 20,
        "current_participants": 13,
        "program_type": "wellness"
    },
    {
        "title": "Board Games Day",
        "description": "A fun day of board games with friends. Chess, Scrabble, Monopoly, and more!",
        "date": date(2026, 1, 15),
        "start_time": time(14, 0, 0),
        "end_time": time(17, 0, 0),
        "location": "Recreation Room",
        "max_capacity": 20,
        "current_participants": 18,
        "program_type": "social"
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
        
        # Insert sample activities
        for activity_data in SAMPLE_ACTIVITIES:
            activity = Activity(
                id=uuid.uuid4(),
                **activity_data
            )
            db.add(activity)
        
        db.commit()
        print(f"Successfully seeded {len(SAMPLE_ACTIVITIES)} activities!")
        
        # List the seeded activities
        activities = db.query(Activity).order_by(Activity.date, Activity.start_time).all()
        print("\nSeeded activities:")
        print("-" * 60)
        for activity in activities:
            print(f"  {activity.date} {activity.start_time.strftime('%H:%M')} - {activity.title}")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    clear_existing = "--clear" in sys.argv
    seed_activities(clear_existing=clear_existing)
