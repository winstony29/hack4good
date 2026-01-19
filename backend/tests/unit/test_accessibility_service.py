"""
Unit tests for AccessibilityService.
"""

import pytest
from unittest.mock import patch, MagicMock
from app.services.accessibility_service import (
    AccessibilityService,
    get_accessibility_service
)


class TestAccessibilityServiceInitialization:
    """Tests for AccessibilityService initialization."""

    def test_init_without_clients(self):
        """Service can be initialized without providing clients."""
        with patch('app.services.accessibility_service.get_elevenlabs_client'):
            with patch('app.services.accessibility_service.get_google_translate_client'):
                service = AccessibilityService()
                assert service._tts_client is None
                assert service._translate_client is None

    def test_init_with_custom_clients(self):
        """Service can be initialized with custom clients."""
        mock_tts = MagicMock()
        mock_translate = MagicMock()

        service = AccessibilityService(
            tts_client=mock_tts,
            translate_client=mock_translate
        )

        assert service._tts_client is mock_tts
        assert service._translate_client is mock_translate


class TestAccessibilityServiceLazyLoading:
    """Tests for lazy client initialization."""

    def test_tts_client_lazy_loaded(self):
        """TTS client should be lazy loaded on first access."""
        mock_tts = MagicMock()

        with patch('app.services.accessibility_service.get_elevenlabs_client', return_value=mock_tts):
            service = AccessibilityService()
            assert service._tts_client is None

            # Access the property
            client = service.tts_client

            assert client is mock_tts
            assert service._tts_client is mock_tts

    def test_translate_client_lazy_loaded(self):
        """Translate client should be lazy loaded on first access."""
        mock_translate = MagicMock()

        with patch('app.services.accessibility_service.get_google_translate_client', return_value=mock_translate):
            service = AccessibilityService()
            assert service._translate_client is None

            # Access the property
            client = service.translate_client

            assert client is mock_translate
            assert service._translate_client is mock_translate


class TestTextToSpeech:
    """Tests for text_to_speech method."""

    @pytest.fixture
    def service_with_mock_tts(self):
        """Create service with mock TTS client."""
        mock_tts = MagicMock()
        mock_tts.generate_speech.return_value = ('data:audio/mp3;base64,abc123', 2.5)
        mock_tts.is_mock_mode = True

        service = AccessibilityService(tts_client=mock_tts)
        return service, mock_tts

    def test_text_to_speech_returns_dict(self, service_with_mock_tts):
        """text_to_speech() should return a dictionary."""
        service, _ = service_with_mock_tts
        result = service.text_to_speech("Hello world")
        assert isinstance(result, dict)

    def test_text_to_speech_result_keys(self, service_with_mock_tts):
        """text_to_speech() result should have required keys."""
        service, _ = service_with_mock_tts
        result = service.text_to_speech("Hello world")
        assert 'audio_url' in result
        assert 'duration' in result
        assert 'language' in result
        assert 'mock_mode' in result

    def test_text_to_speech_calls_client(self, service_with_mock_tts):
        """text_to_speech() should call the TTS client."""
        service, mock_tts = service_with_mock_tts
        service.text_to_speech("Hello", language='en')
        mock_tts.generate_speech.assert_called_once_with(
            text="Hello",
            language='en'
        )

    def test_text_to_speech_default_language(self, service_with_mock_tts):
        """text_to_speech() should default to English."""
        service, mock_tts = service_with_mock_tts
        service.text_to_speech("Hello")
        mock_tts.generate_speech.assert_called_with(text="Hello", language='en')


class TestTranslate:
    """Tests for translate method."""

    @pytest.fixture
    def service_with_mock_translate(self):
        """Create service with mock translate client."""
        mock_translate = MagicMock()
        mock_translate.translate.return_value = "Translated text"
        mock_translate.is_mock_mode = True

        service = AccessibilityService(translate_client=mock_translate)
        return service, mock_translate

    def test_translate_returns_dict(self, service_with_mock_translate):
        """translate() should return a dictionary."""
        service, _ = service_with_mock_translate
        result = service.translate("Hello", "en", "zh")
        assert isinstance(result, dict)

    def test_translate_result_keys(self, service_with_mock_translate):
        """translate() result should have required keys."""
        service, _ = service_with_mock_translate
        result = service.translate("Hello", "en", "zh")
        assert 'translated_text' in result
        assert 'source_language' in result
        assert 'target_language' in result
        assert 'mock_mode' in result

    def test_translate_calls_client(self, service_with_mock_translate):
        """translate() should call the translate client."""
        service, mock_translate = service_with_mock_translate
        service.translate("Hello", "en", "zh")
        mock_translate.translate.assert_called_once_with(
            text="Hello",
            source_language="en",
            target_language="zh"
        )


class TestTranslateAndSpeak:
    """Tests for translate_and_speak method."""

    @pytest.fixture
    def service_with_mocks(self):
        """Create service with both mock clients."""
        mock_tts = MagicMock()
        mock_tts.generate_speech.return_value = ('data:audio/mp3;base64,abc', 1.5)
        mock_tts.is_mock_mode = True

        mock_translate = MagicMock()
        mock_translate.translate.return_value = "Translated"
        mock_translate.is_mock_mode = True

        service = AccessibilityService(
            tts_client=mock_tts,
            translate_client=mock_translate
        )
        return service, mock_tts, mock_translate

    def test_translate_and_speak_returns_dict(self, service_with_mocks):
        """translate_and_speak() should return a dictionary."""
        service, _, _ = service_with_mocks
        result = service.translate_and_speak("Hello", "zh")
        assert isinstance(result, dict)

    def test_translate_and_speak_result_keys(self, service_with_mocks):
        """translate_and_speak() result should have all required keys."""
        service, _, _ = service_with_mocks
        result = service.translate_and_speak("Hello", "zh")
        assert 'original_text' in result
        assert 'translated_text' in result
        assert 'source_language' in result
        assert 'target_language' in result
        assert 'audio_url' in result
        assert 'duration' in result

    def test_translate_and_speak_calls_both_clients(self, service_with_mocks):
        """translate_and_speak() should call both translate and TTS clients."""
        service, mock_tts, mock_translate = service_with_mocks
        service.translate_and_speak("Hello", "zh", source_lang="en")

        mock_translate.translate.assert_called_once()
        mock_tts.generate_speech.assert_called_once()

    def test_translate_and_speak_tts_uses_translated_text(self, service_with_mocks):
        """translate_and_speak() should generate speech for translated text."""
        service, mock_tts, _ = service_with_mocks
        service.translate_and_speak("Hello", "zh")

        # TTS should be called with the translated text
        mock_tts.generate_speech.assert_called_with(
            text="Translated",
            language="zh"
        )


class TestStaticMethods:
    """Tests for static helper methods."""

    def test_get_supported_languages(self):
        """get_supported_languages() should return language list."""
        result = AccessibilityService.get_supported_languages()
        assert isinstance(result, list)
        assert len(result) == 4

    def test_is_supported_language_true(self):
        """is_supported_language() should return True for supported languages."""
        assert AccessibilityService.is_supported_language('en') is True
        assert AccessibilityService.is_supported_language('zh') is True

    def test_is_supported_language_false(self):
        """is_supported_language() should return False for unsupported languages."""
        assert AccessibilityService.is_supported_language('fr') is False


class TestGetAccessibilityService:
    """Tests for the singleton getter function."""

    def test_returns_accessibility_service_instance(self):
        """get_accessibility_service() should return an AccessibilityService."""
        with patch('app.services.accessibility_service.get_elevenlabs_client'):
            with patch('app.services.accessibility_service.get_google_translate_client'):
                # Reset the singleton
                import app.services.accessibility_service as module
                module._service_instance = None

                service = get_accessibility_service()
                assert isinstance(service, AccessibilityService)

    def test_returns_same_instance(self):
        """get_accessibility_service() should return the same instance (singleton)."""
        with patch('app.services.accessibility_service.get_elevenlabs_client'):
            with patch('app.services.accessibility_service.get_google_translate_client'):
                # Reset the singleton
                import app.services.accessibility_service as module
                module._service_instance = None

                service1 = get_accessibility_service()
                service2 = get_accessibility_service()
                assert service1 is service2
