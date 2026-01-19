"""
Pytest configuration and fixtures for backend tests.

IMPORTANT: Environment variables must be set BEFORE importing app modules.
"""

import os
import sys

# Set test environment variables BEFORE any imports
os.environ['DATABASE_URL'] = 'sqlite:///test.db'
os.environ['SUPABASE_URL'] = 'https://test.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'test-anon-key-12345'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-for-jwt-testing'
os.environ['JWT_ALGORITHM'] = 'HS256'
os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'] = '60'
os.environ['FRONTEND_URL'] = 'http://localhost:5173'
os.environ['ELEVENLABS_API_KEY'] = ''
os.environ['GOOGLE_PROJECT_ID'] = ''
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = ''

# Add the app directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
from unittest.mock import MagicMock


@pytest.fixture
def mock_user():
    """Mock authenticated user."""
    return MagicMock(
        id='test-user-123',
        email='test@example.com',
        role='volunteer'
    )


@pytest.fixture
def mock_staff_user():
    """Mock authenticated staff user."""
    return MagicMock(
        id='staff-user-123',
        email='staff@example.com',
        role='staff'
    )
