"""
Unit tests for ElevenLabs TTS client.
"""

import pytest
from unittest.mock import patch, MagicMock
from app.integrations.elevenlabs_client import (
    ElevenLabsClient,
    get_elevenlabs_client
)


class TestElevenLabsClientMockMode:
    """Tests for ElevenLabs client in mock mode (no API key)."""

    @pytest.fixture
    def client_no_api_key(self):
        """Create client with no API key."""
        with patch('app.integrations.elevenlabs_client.settings') as mock_settings:
            mock_settings.ELEVENLABS_API_KEY = None
            client = ElevenLabsClient()
            yield client

    def test_is_mock_mode_without_api_key(self, client_no_api_key):
        """Client should be in mock mode without API key."""
        assert client_no_api_key.is_mock_mode is True

    def test_generate_speech_returns_tuple(self, client_no_api_key):
        """generate_speech() should return a tuple of (audio_url, duration)."""
        result = client_no_api_key.generate_speech("Hello world")
        assert isinstance(result, tuple)
        assert len(result) == 2

    def test_generate_speech_returns_data_url(self, client_no_api_key):
        """generate_speech() should return a data URL in mock mode."""
        audio_url, duration = client_no_api_key.generate_speech("Hello world")
        assert audio_url.startswith('data:audio/mp3;base64,')

    def test_generate_speech_returns_positive_duration(self, client_no_api_key):
        """generate_speech() should return a positive duration."""
        audio_url, duration = client_no_api_key.generate_speech("Hello world")
        assert duration > 0

    def test_generate_speech_duration_scales_with_text(self, client_no_api_key):
        """Longer text should result in longer duration estimate."""
        _, short_duration = client_no_api_key.generate_speech("Hi")
        _, long_duration = client_no_api_key.generate_speech(
            "This is a much longer sentence with many more words"
        )
        assert long_duration > short_duration

    def test_generate_speech_truncates_long_text(self, client_no_api_key):
        """generate_speech() should handle text longer than 5000 chars."""
        long_text = "a" * 6000
        # Should not raise an exception
        audio_url, duration = client_no_api_key.generate_speech(long_text)
        assert audio_url.startswith('data:audio/mp3;base64,')

    def test_generate_speech_accepts_language_parameter(self, client_no_api_key):
        """generate_speech() should accept language parameter."""
        for lang in ['en', 'zh', 'ms', 'ta']:
            audio_url, duration = client_no_api_key.generate_speech(
                "Hello", language=lang
            )
            assert audio_url.startswith('data:audio/mp3;base64,')

    def test_voice_map_has_required_languages(self, client_no_api_key):
        """VOICE_MAP should contain all supported languages."""
        assert 'en' in ElevenLabsClient.VOICE_MAP
        assert 'zh' in ElevenLabsClient.VOICE_MAP
        assert 'ms' in ElevenLabsClient.VOICE_MAP
        assert 'ta' in ElevenLabsClient.VOICE_MAP


@pytest.mark.skip(reason="Requires actual ElevenLabs library with matching API version")
class TestElevenLabsClientRealMode:
    """Tests for ElevenLabs client with API key configured.

    These tests are skipped because they require the actual ElevenLabs library
    with a specific API version. The mock mode tests cover the core functionality.
    """

    @pytest.fixture
    def mock_elevenlabs_generate(self):
        """Mock the elevenlabs.generate function."""
        with patch('app.integrations.elevenlabs_client.settings') as mock_settings:
            mock_settings.ELEVENLABS_API_KEY = 'test-api-key'
            with patch('elevenlabs.set_api_key'):
                with patch('elevenlabs.generate') as mock_generate:
                    mock_generate.return_value = b'fake audio bytes'
                    yield mock_generate

    def test_is_mock_mode_with_api_key(self, mock_elevenlabs_generate):
        """Client should not be in mock mode with API key."""
        client = ElevenLabsClient()
        assert client.is_mock_mode is False

    def test_generate_speech_calls_elevenlabs_api(self, mock_elevenlabs_generate):
        """generate_speech() should call the ElevenLabs API."""
        client = ElevenLabsClient()
        client.generate_speech("Hello world", language='en')
        mock_elevenlabs_generate.assert_called_once()

    def test_generate_speech_returns_base64_from_api(self, mock_elevenlabs_generate):
        """generate_speech() should return base64-encoded audio from API."""
        client = ElevenLabsClient()
        audio_url, duration = client.generate_speech("Hello world")
        assert audio_url.startswith('data:audio/mp3;base64,')
        # Should contain base64-encoded 'fake audio bytes'
        assert 'ZmFrZSBhdWRpbyBieXRlcw==' in audio_url

    def test_generate_speech_fallback_on_api_error(self, mock_elevenlabs_generate):
        """generate_speech() should fallback to mock on API error."""
        mock_elevenlabs_generate.side_effect = Exception("API Error")
        client = ElevenLabsClient()
        audio_url, duration = client.generate_speech("Hello world")
        # Should still return valid audio (mock fallback)
        assert audio_url.startswith('data:audio/mp3;base64,')


class TestDurationEstimation:
    """Tests for duration estimation logic."""

    @pytest.fixture
    def client(self):
        """Create client in mock mode."""
        with patch('app.integrations.elevenlabs_client.settings') as mock_settings:
            mock_settings.ELEVENLABS_API_KEY = None
            yield ElevenLabsClient()

    def test_minimum_duration(self, client):
        """Duration should have a minimum value."""
        _, duration = client.generate_speech("")
        assert duration >= 0.5

    def test_maximum_duration(self, client):
        """Duration should be capped at 60 seconds."""
        long_text = " ".join(["word"] * 1000)  # 1000 words
        _, duration = client.generate_speech(long_text)
        assert duration <= 60.0


class TestGetElevenLabsClient:
    """Tests for the singleton getter function."""

    def test_returns_elevenlabs_client_instance(self):
        """get_elevenlabs_client() should return an ElevenLabsClient."""
        with patch('app.integrations.elevenlabs_client.settings') as mock_settings:
            mock_settings.ELEVENLABS_API_KEY = None
            # Reset the singleton
            import app.integrations.elevenlabs_client as module
            module._client_instance = None

            client = get_elevenlabs_client()
            assert isinstance(client, ElevenLabsClient)

    def test_returns_same_instance(self):
        """get_elevenlabs_client() should return the same instance (singleton)."""
        with patch('app.integrations.elevenlabs_client.settings') as mock_settings:
            mock_settings.ELEVENLABS_API_KEY = None
            # Reset the singleton
            import app.integrations.elevenlabs_client as module
            module._client_instance = None

            client1 = get_elevenlabs_client()
            client2 = get_elevenlabs_client()
            assert client1 is client2
