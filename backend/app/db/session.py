from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use DIRECT_URL for SQLAlchemy (avoids pgbouncer parameter issue)
# Fall back to DATABASE_URL if DIRECT_URL not set
db_url = settings.DIRECT_URL if settings.DIRECT_URL else settings.DATABASE_URL

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
