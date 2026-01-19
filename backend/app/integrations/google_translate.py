"""
Google Cloud Translation client wrapper.

Provides translation functionality with automatic fallback to mock translations
when Google Cloud credentials are not available (demo/development mode).
"""

import os
from typing import Optional

from app.core.config import settings


# Supported languages for the app
SUPPORTED_LANGUAGES = {"en", "zh", "ms", "ta"}

# Language names for display
LANGUAGE_NAMES = {
    "en": "English",
    "zh": "中文 (Mandarin)",
    "ms": "Malay",
    "ta": "தமிழ் (Tamil)"
}


class GoogleTranslateClient:
    """
    Wrapper for Google Cloud Translation API.

    Translates text between English, Mandarin, Malay, and Tamil.
    Falls back to mock translations when credentials are not configured.
    """

    def __init__(self):
        self.project_id = settings.GOOGLE_PROJECT_ID
        self.credentials_path = settings.GOOGLE_APPLICATION_CREDENTIALS
        self.api_key = settings.GOOGLE_TRANSLATE_API_KEY
        self._client = None

        # Try API key first (simpler method)
        if self.api_key:
            try:
                from google.cloud import translate_v2 as translate
                # Set API key as environment variable (required by google-cloud-translate)
                os.environ['GOOGLE_API_KEY'] = self.api_key
                self._client = translate.Client()
                print("[Translation] Initialized with API key")
            except ImportError:
                print("[Translation] google-cloud-translate not installed, using mock mode")
            except Exception as e:
                print(f"[Translation] Failed to initialize with API key: {e}")
        # Fall back to service account credentials
        elif self.credentials_path and self.project_id:
            try:
                from google.cloud import translate_v2 as translate
                self._client = translate.Client()
                print("[Translation] Initialized with service account")
            except ImportError:
                print("[Translation] google-cloud-translate not installed, using mock mode")
            except Exception as e:
                print(f"[Translation] Failed to initialize Google Translate: {e}")

    @property
    def is_mock_mode(self) -> bool:
        """Check if running in mock mode (no credentials or client)."""
        return self._client is None

    def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> str:
        """
        Translate text from source to target language.

        Args:
            text: Text to translate (max 10000 chars)
            source_language: Source language code (en, zh, ms, ta)
            target_language: Target language code (en, zh, ms, ta)

        Returns:
            Translated text (or mock format "[lang] text" in mock mode)
        """
        # Truncate long text
        if len(text) > 10000:
            text = text[:10000]

        # Return original if same language
        if source_language == target_language:
            return text

        # Use mock mode if no client
        if self.is_mock_mode:
            print(f"[Translation Mock] {source_language} -> {target_language}: {text[:50]}...")
            return f"[{target_language.upper()}] {text}"

        # Real Google Translate API call
        try:
            result = self._client.translate(
                text,
                source_language=source_language,
                target_language=target_language
            )
            return result['translatedText']
        except Exception as e:
            print(f"[Translation] Google API error: {e}, falling back to mock")
            return f"[{target_language.upper()}] {text}"

    def detect_language(self, text: str) -> str:
        """
        Detect the language of given text.

        Args:
            text: Text to analyze

        Returns:
            Detected language code (defaults to "en" in mock mode)
        """
        if not text or not text.strip():
            return "en"

        if self.is_mock_mode:
            return "en"

        try:
            result = self._client.detect_language(text)
            detected = result.get('language', 'en')
            # Only return if it's a supported language
            return detected if detected in SUPPORTED_LANGUAGES else "en"
        except Exception as e:
            print(f"[Translation] Language detection error: {e}")
            return "en"

    @staticmethod
    def get_supported_languages() -> list[dict]:
        """Get list of supported languages with codes and names."""
        return [
            {"code": code, "name": LANGUAGE_NAMES[code]}
            for code in SUPPORTED_LANGUAGES
        ]

    @staticmethod
    def is_supported_language(code: str) -> bool:
        """Check if a language code is supported."""
        return code in SUPPORTED_LANGUAGES


# Singleton instance for reuse
_client_instance: Optional[GoogleTranslateClient] = None


def get_google_translate_client() -> GoogleTranslateClient:
    """Get or create the Google Translate client singleton."""
    global _client_instance
    if _client_instance is None:
        _client_instance = GoogleTranslateClient()
    return _client_instance
