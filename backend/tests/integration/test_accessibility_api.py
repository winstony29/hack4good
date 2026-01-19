"""
Integration tests for accessibility API endpoints.

These tests verify the API endpoints work correctly without
requiring external services (using mock mode).
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient


# Mock the settings before importing the app
@pytest.fixture(scope='module', autouse=True)
def mock_settings():
    """Mock settings for all tests in this module."""
    with patch('app.core.config.settings') as mock:
        # Set up mock settings
        mock.DATABASE_URL = 'sqlite:///test.db'
        mock.SUPABASE_URL = 'https://test.supabase.co'
        mock.SUPABASE_ANON_KEY = 'test-anon-key'
        mock.SUPABASE_SERVICE_KEY = None
        mock.JWT_SECRET_KEY = 'test-secret-key'
        mock.JWT_ALGORITHM = 'HS256'
        mock.ACCESS_TOKEN_EXPIRE_MINUTES = 60
        mock.FRONTEND_URL = 'http://localhost:5173'
        mock.ELEVENLABS_API_KEY = None  # Mock mode
        mock.GOOGLE_PROJECT_ID = None  # Mock mode
        mock.GOOGLE_APPLICATION_CREDENTIALS = None  # Mock mode
        mock.TWILIO_ACCOUNT_SID = None
        mock.TWILIO_AUTH_TOKEN = None
        mock.TWILIO_PHONE_NUMBER = None
        mock.TWILIO_WHATSAPP_NUMBER = None
        yield mock


@pytest.fixture
def mock_auth():
    """Mock authentication to bypass JWT verification."""
    mock_user = MagicMock()
    mock_user.id = 'test-user-123'
    mock_user.email = 'test@example.com'
    mock_user.role = 'volunteer'

    with patch('app.core.auth.get_current_user', return_value=mock_user):
        yield mock_user


@pytest.fixture
def mock_db():
    """Mock database session."""
    mock_session = MagicMock()
    with patch('app.core.deps.get_db', return_value=mock_session):
        yield mock_session


@pytest.fixture
def client(mock_settings, mock_auth, mock_db):
    """Create test client with mocked dependencies."""
    # Import app after mocking settings
    from app.main import app
    return TestClient(app)


class TestTTSEndpoint:
    """Tests for /accessibility/tts endpoint."""

    def test_tts_endpoint_exists(self, client):
        """TTS endpoint should exist and accept POST."""
        response = client.post(
            '/accessibility/tts',
            json={'text': 'Hello', 'language': 'en'}
        )
        # Should not be 404 or 405
        assert response.status_code != 404
        assert response.status_code != 405

    def test_tts_returns_audio_url(self, client):
        """TTS endpoint should return audio_url in response."""
        response = client.post(
            '/accessibility/tts',
            json={'text': 'Hello world', 'language': 'en'}
        )
        assert response.status_code == 200
        data = response.json()
        assert 'audio_url' in data
        assert data['audio_url'].startswith('data:audio/mp3;base64,')

    def test_tts_returns_duration(self, client):
        """TTS endpoint should return duration in response."""
        response = client.post(
            '/accessibility/tts',
            json={'text': 'Hello world', 'language': 'en'}
        )
        assert response.status_code == 200
        data = response.json()
        assert 'duration' in data
        assert isinstance(data['duration'], float)
        assert data['duration'] > 0

    def test_tts_empty_text_returns_400(self, client):
        """TTS endpoint should return 400 for empty text."""
        response = client.post(
            '/accessibility/tts',
            json={'text': '', 'language': 'en'}
        )
        assert response.status_code == 400

    def test_tts_whitespace_text_returns_400(self, client):
        """TTS endpoint should return 400 for whitespace-only text."""
        response = client.post(
            '/accessibility/tts',
            json={'text': '   ', 'language': 'en'}
        )
        assert response.status_code == 400

    def test_tts_accepts_all_languages(self, client):
        """TTS endpoint should accept all supported languages."""
        for lang in ['en', 'zh', 'ms', 'ta']:
            response = client.post(
                '/accessibility/tts',
                json={'text': 'Hello', 'language': lang}
            )
            assert response.status_code == 200

    def test_tts_default_language_is_english(self, client):
        """TTS endpoint should default to English if language not specified."""
        response = client.post(
            '/accessibility/tts',
            json={'text': 'Hello'}
        )
        assert response.status_code == 200


class TestTranslateEndpoint:
    """Tests for /accessibility/translate endpoint."""

    def test_translate_endpoint_exists(self, client):
        """Translate endpoint should exist and accept POST."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello',
                'source_language': 'en',
                'target_language': 'zh'
            }
        )
        # Should not be 404 or 405
        assert response.status_code != 404
        assert response.status_code != 405

    def test_translate_returns_translated_text(self, client):
        """Translate endpoint should return translated_text in response."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello',
                'source_language': 'en',
                'target_language': 'zh'
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert 'translated_text' in data
        # In mock mode, should be "[ZH] Hello"
        assert '[ZH]' in data['translated_text'] or 'Hello' in data['translated_text']

    def test_translate_returns_language_info(self, client):
        """Translate endpoint should return source and target language."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello',
                'source_language': 'en',
                'target_language': 'zh'
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data['source_language'] == 'en'
        assert data['target_language'] == 'zh'

    def test_translate_empty_text_returns_400(self, client):
        """Translate endpoint should return 400 for empty text."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': '',
                'source_language': 'en',
                'target_language': 'zh'
            }
        )
        assert response.status_code == 400

    def test_translate_unsupported_source_returns_400(self, client):
        """Translate endpoint should return 400 for unsupported source language."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello',
                'source_language': 'fr',  # Not supported
                'target_language': 'zh'
            }
        )
        assert response.status_code == 400

    def test_translate_unsupported_target_returns_400(self, client):
        """Translate endpoint should return 400 for unsupported target language."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello',
                'source_language': 'en',
                'target_language': 'de'  # Not supported
            }
        )
        assert response.status_code == 400

    def test_translate_same_language_returns_original(self, client):
        """Translate endpoint should return original text when source == target."""
        response = client.post(
            '/accessibility/translate',
            json={
                'text': 'Hello world',
                'source_language': 'en',
                'target_language': 'en'
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data['translated_text'] == 'Hello world'


class TestLanguagesEndpoint:
    """Tests for /accessibility/languages endpoint."""

    def test_languages_endpoint_exists(self, client):
        """Languages endpoint should exist and accept GET."""
        response = client.get('/accessibility/languages')
        assert response.status_code == 200

    def test_languages_returns_list(self, client):
        """Languages endpoint should return a list of languages."""
        response = client.get('/accessibility/languages')
        data = response.json()
        assert 'languages' in data
        assert isinstance(data['languages'], list)

    def test_languages_contains_required_languages(self, client):
        """Languages endpoint should include all required languages."""
        response = client.get('/accessibility/languages')
        data = response.json()
        codes = [lang['code'] for lang in data['languages']]
        assert 'en' in codes
        assert 'zh' in codes
        assert 'ms' in codes
        assert 'ta' in codes

    def test_languages_have_code_and_name(self, client):
        """Each language should have code and name."""
        response = client.get('/accessibility/languages')
        data = response.json()
        for lang in data['languages']:
            assert 'code' in lang
            assert 'name' in lang
            assert len(lang['code']) > 0
            assert len(lang['name']) > 0
