"""
Google Cloud Translation client wrapper.

Provides translation functionality with automatic fallback to mock translations
when Google Cloud credentials are not available (demo/development mode).
"""

import httpx
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

# Google Translate API v2 REST endpoint
TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2"
DETECT_API_URL = "https://translation.googleapis.com/language/translate/v2/detect"


class GoogleTranslateClient:
    """
    Wrapper for Google Cloud Translation API.

    Translates text between English, Mandarin, Malay, and Tamil.
    Falls back to mock translations when credentials are not configured.
    """

    def __init__(self):
        self.api_key = settings.GOOGLE_TRANSLATE_API_KEY
        self._initialized = False

        if self.api_key:
            self._initialized = True
            print("[Translation] Initialized with API key (REST API mode)")

    @property
    def is_mock_mode(self) -> bool:
        """Check if running in mock mode (no API key configured)."""
        return not self._initialized

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

        # Use mock mode if no API key
        if self.is_mock_mode:
            print(f"[Translation Mock] {source_language} -> {target_language}: {text[:50]}...")
            return f"[{target_language.upper()}] {text}"

        # Real Google Translate REST API call
        try:
            response = httpx.post(
                TRANSLATE_API_URL,
                params={"key": self.api_key},
                json={
                    "q": text,
                    "source": source_language,
                    "target": target_language,
                    "format": "text"
                },
                timeout=10.0
            )
            response.raise_for_status()
            result = response.json()
            translated_text = result["data"]["translations"][0]["translatedText"]
            return translated_text
        except httpx.HTTPStatusError as e:
            print(f"[Translation] Google API HTTP error {e.response.status_code}: {e.response.text}")
            return f"[{target_language.upper()}] {text}"
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
            response = httpx.post(
                DETECT_API_URL,
                params={"key": self.api_key},
                json={"q": text},
                timeout=10.0
            )
            response.raise_for_status()
            result = response.json()
            detected = result["data"]["detections"][0][0]["language"]
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
