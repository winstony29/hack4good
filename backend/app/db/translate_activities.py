"""
One-time script to translate all existing activities to supported languages.
Run from the backend directory: python -m app.db.translate_activities

This script:
1. Fetches all activities from the database
2. Translates title and description to zh (Chinese), ms (Malay), ta (Tamil)
3. Updates the database with translations
"""

import sys
import time
from sqlalchemy import text

from app.db.session import SessionLocal
from app.db.models import Activity
from app.integrations.google_translate import get_google_translate_client

# Target languages (excluding English which is the source)
TARGET_LANGUAGES = ["zh", "ms", "ta"]


def translate_activities(dry_run: bool = False):
    """
    Translate all activities that don't have translations yet.
    
    Args:
        dry_run: If True, show what would be translated without making changes
    """
    db = SessionLocal()
    translate_client = get_google_translate_client()
    
    if translate_client.is_mock_mode:
        print("WARNING: Running in mock mode - translations will not be real!")
        print("Set GOOGLE_TRANSLATE_API_KEY in .env for real translations.")
        print("")
    
    try:
        # Get all activities
        activities = db.query(Activity).all()
        print(f"Found {len(activities)} activities to process")
        print("-" * 60)
        
        translated_count = 0
        skipped_count = 0
        
        for activity in activities:
            # Check if activity already has translations
            has_translations = all([
                activity.title_zh,
                activity.title_ms,
                activity.title_ta,
                activity.description_zh if activity.description else True,
                activity.description_ms if activity.description else True,
                activity.description_ta if activity.description else True,
            ])
            
            if has_translations:
                print(f"SKIP: {activity.title[:40]}... (already translated)")
                skipped_count += 1
                continue
            
            print(f"\nTranslating: {activity.title}")
            
            if dry_run:
                print(f"  [DRY RUN] Would translate title and description")
                continue
            
            # Translate title to each language
            for lang in TARGET_LANGUAGES:
                try:
                    # Translate title
                    translated_title = translate_client.translate(
                        activity.title,
                        source_language="en",
                        target_language=lang
                    )
                    setattr(activity, f"title_{lang}", translated_title)
                    print(f"  title_{lang}: {translated_title[:50]}...")
                    
                    # Translate description if exists
                    if activity.description:
                        translated_desc = translate_client.translate(
                            activity.description,
                            source_language="en",
                            target_language=lang
                        )
                        setattr(activity, f"description_{lang}", translated_desc)
                        print(f"  description_{lang}: {translated_desc[:50]}...")
                    
                    # Small delay to avoid rate limiting
                    time.sleep(0.1)
                    
                except Exception as e:
                    print(f"  ERROR translating to {lang}: {e}")
            
            translated_count += 1
        
        if not dry_run:
            db.commit()
            print("\n" + "=" * 60)
            print(f"Successfully translated {translated_count} activities!")
            print(f"Skipped {skipped_count} activities (already translated)")
        else:
            print("\n" + "=" * 60)
            print(f"[DRY RUN] Would translate {translated_count} activities")
            print(f"[DRY RUN] Would skip {skipped_count} activities")
        
    except Exception as e:
        db.rollback()
        print(f"Error translating activities: {e}")
        raise
    finally:
        db.close()


def generate_sql():
    """Generate SQL to add translation columns if they don't exist."""
    print("-- SQL to add translation columns to activities table")
    print("-- Run this in Supabase SQL Editor if columns don't exist")
    print("")
    print("""
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS title_zh VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_ms VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_ta VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_zh TEXT,
ADD COLUMN IF NOT EXISTS description_ms TEXT,
ADD COLUMN IF NOT EXISTS description_ta TEXT;
""")


if __name__ == "__main__":
    if "--sql" in sys.argv:
        generate_sql()
    elif "--dry-run" in sys.argv:
        translate_activities(dry_run=True)
    else:
        print("Activity Translation Script")
        print("=" * 60)
        print("")
        translate_activities(dry_run=False)
