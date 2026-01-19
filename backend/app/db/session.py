from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use DIRECT_URL for direct connections (bypasses pgbouncer parameters)
# Fall back to DATABASE_URL if DIRECT_URL is not set
db_url = settings.DIRECT_URL or settings.DATABASE_URL

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
