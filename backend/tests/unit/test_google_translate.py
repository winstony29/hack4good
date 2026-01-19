"""
Unit tests for Google Translate client.
"""

import pytest
from unittest.mock import patch, MagicMock
from app.integrations.google_translate import (
    GoogleTranslateClient,
    get_google_translate_client,
    SUPPORTED_LANGUAGES,
    LANGUAGE_NAMES
)


class TestGoogleTranslateClientMockMode:
    """Tests for Google Translate client in mock mode (no credentials)."""

    @pytest.fixture
    def client_no_credentials(self):
        """Create client with no credentials."""
        with patch('app.integrations.google_translate.settings') as mock_settings:
            mock_settings.GOOGLE_TRANSLATE_API_KEY = None
            client = GoogleTranslateClient()
            yield client

    def test_is_mock_mode_without_credentials(self, client_no_credentials):
        """Client should be in mock mode without credentials."""
        assert client_no_credentials.is_mock_mode is True

    def test_translate_returns_string(self, client_no_credentials):
        """translate() should return a string."""
        result = client_no_credentials.translate("Hello", "en", "zh")
        assert isinstance(result, str)

    def test_translate_mock_format(self, client_no_credentials):
        """translate() should return mock format with language prefix."""
        result = client_no_credentials.translate("Hello", "en", "zh")
        assert result == "[ZH] Hello"

    def test_translate_uppercase_language_code(self, client_no_credentials):
        """Mock translation should use uppercase language code."""
        result = client_no_credentials.translate("Test", "en", "ms")
        assert result == "[MS] Test"

    def test_translate_returns_original_for_same_language(self, client_no_credentials):
        """translate() should return original text when source == target."""
        result = client_no_credentials.translate("Hello world", "en", "en")
        assert result == "Hello world"

    def test_translate_truncates_long_text(self, client_no_credentials):
        """translate() should handle text longer than 10000 chars."""
        long_text = "a" * 15000
        # Should not raise an exception
        result = client_no_credentials.translate(long_text, "en", "zh")
        assert result.startswith("[ZH]")

    def test_translate_all_supported_languages(self, client_no_credentials):
        """translate() should work with all supported languages."""
        for lang in SUPPORTED_LANGUAGES:
            result = client_no_credentials.translate("Hello", "en", lang)
            if lang == "en":
                assert result == "Hello"
            else:
                assert result == f"[{lang.upper()}] Hello"

    def test_detect_language_returns_string(self, client_no_credentials):
        """detect_language() should return a string."""
        result = client_no_credentials.detect_language("Hello")
        assert isinstance(result, str)

    def test_detect_language_defaults_to_english(self, client_no_credentials):
        """detect_language() should default to 'en' in mock mode."""
        result = client_no_credentials.detect_language("Some text")
        assert result == "en"

    def test_detect_language_empty_text(self, client_no_credentials):
        """detect_language() should return 'en' for empty text."""
        assert client_no_credentials.detect_language("") == "en"
        assert client_no_credentials.detect_language("   ") == "en"


class TestGoogleTranslateClientRealMode:
    """Tests for Google Translate client with API key configured."""

    @pytest.fixture
    def client_with_api_key(self):
        """Create client with API key and mock httpx."""
        with patch('app.integrations.google_translate.settings') as mock_settings:
            mock_settings.GOOGLE_TRANSLATE_API_KEY = 'test-api-key'
            client = GoogleTranslateClient()
            yield client

    def test_is_mock_mode_with_api_key(self, client_with_api_key):
        """Client should not be in mock mode with API key."""
        assert client_with_api_key.is_mock_mode is False

    def test_translate_calls_google_api(self, client_with_api_key):
        """translate() should call the Google Translate REST API."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "data": {"translations": [{"translatedText": "你好"}]}
        }
        mock_response.raise_for_status = MagicMock()

        with patch('app.integrations.google_translate.httpx.post', return_value=mock_response) as mock_post:
            result = client_with_api_key.translate("Hello", "en", "zh")
            mock_post.assert_called_once()
            assert result == "你好"

    def test_translate_fallback_on_api_error(self, client_with_api_key):
        """translate() should fallback to mock on API error."""
        with patch('app.integrations.google_translate.httpx.post', side_effect=Exception("API Error")):
            result = client_with_api_key.translate("Hello", "en", "zh")
            assert result == "[ZH] Hello"

    def test_detect_language_calls_google_api(self, client_with_api_key):
        """detect_language() should call the Google API."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "data": {"detections": [[{"language": "en"}]]}
        }
        mock_response.raise_for_status = MagicMock()

        with patch('app.integrations.google_translate.httpx.post', return_value=mock_response) as mock_post:
            result = client_with_api_key.detect_language("Hello")
            mock_post.assert_called_once()
            assert result == "en"


class TestSupportedLanguages:
    """Tests for supported languages configuration."""

    def test_supported_languages_is_set(self):
        """SUPPORTED_LANGUAGES should be a set."""
        assert isinstance(SUPPORTED_LANGUAGES, set)

    def test_supported_languages_contains_required(self):
        """SUPPORTED_LANGUAGES should contain en, zh, ms, ta."""
        assert 'en' in SUPPORTED_LANGUAGES
        assert 'zh' in SUPPORTED_LANGUAGES
        assert 'ms' in SUPPORTED_LANGUAGES
        assert 'ta' in SUPPORTED_LANGUAGES

    def test_supported_languages_count(self):
        """SUPPORTED_LANGUAGES should have exactly 4 languages."""
        assert len(SUPPORTED_LANGUAGES) == 4

    def test_language_names_has_all_supported(self):
        """LANGUAGE_NAMES should have entries for all supported languages."""
        for lang in SUPPORTED_LANGUAGES:
            assert lang in LANGUAGE_NAMES
            assert isinstance(LANGUAGE_NAMES[lang], str)
            assert len(LANGUAGE_NAMES[lang]) > 0


class TestStaticMethods:
    """Tests for static helper methods."""

    def test_get_supported_languages_returns_list(self):
        """get_supported_languages() should return a list."""
        result = GoogleTranslateClient.get_supported_languages()
        assert isinstance(result, list)

    def test_get_supported_languages_format(self):
        """get_supported_languages() should return dicts with code and name."""
        result = GoogleTranslateClient.get_supported_languages()
        for item in result:
            assert 'code' in item
            assert 'name' in item
            assert item['code'] in SUPPORTED_LANGUAGES
            assert item['name'] == LANGUAGE_NAMES[item['code']]

    def test_is_supported_language_true(self):
        """is_supported_language() should return True for supported languages."""
        for lang in SUPPORTED_LANGUAGES:
            assert GoogleTranslateClient.is_supported_language(lang) is True

    def test_is_supported_language_false(self):
        """is_supported_language() should return False for unsupported languages."""
        assert GoogleTranslateClient.is_supported_language('fr') is False
        assert GoogleTranslateClient.is_supported_language('de') is False
        assert GoogleTranslateClient.is_supported_language('') is False


class TestGetGoogleTranslateClient:
    """Tests for the singleton getter function."""

    def test_returns_google_translate_client_instance(self):
        """get_google_translate_client() should return a GoogleTranslateClient."""
        with patch('app.integrations.google_translate.settings') as mock_settings:
            mock_settings.GOOGLE_TRANSLATE_API_KEY = None
            # Reset the singleton
            import app.integrations.google_translate as module
            module._client_instance = None

            client = get_google_translate_client()
            assert isinstance(client, GoogleTranslateClient)

    def test_returns_same_instance(self):
        """get_google_translate_client() should return the same instance (singleton)."""
        with patch('app.integrations.google_translate.settings') as mock_settings:
            mock_settings.GOOGLE_TRANSLATE_API_KEY = None
            # Reset the singleton
            import app.integrations.google_translate as module
            module._client_instance = None

            client1 = get_google_translate_client()
            client2 = get_google_translate_client()
            assert client1 is client2
