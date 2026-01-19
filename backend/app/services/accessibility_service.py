"""
Accessibility service for coordinating TTS and Translation features.

Provides a clean service layer that API endpoints can use.
"""

from typing import Optional

from app.integrations.elevenlabs_client import (
    ElevenLabsClient,
    get_elevenlabs_client
)
from app.integrations.google_translate import (
    GoogleTranslateClient,
    get_google_translate_client,
    SUPPORTED_LANGUAGES,
    LANGUAGE_NAMES
)


class AccessibilityService:
    """
    Service for accessibility features.

    Coordinates TTS (ElevenLabs) and Translation (Google) APIs.
    """

    def __init__(
        self,
        tts_client: Optional[ElevenLabsClient] = None,
        translate_client: Optional[GoogleTranslateClient] = None
    ):
        """
        Initialize the accessibility service.

        Args:
            tts_client: Optional ElevenLabs client (uses singleton if not provided)
            translate_client: Optional Google Translate client (uses singleton if not provided)
        """
        self._tts_client = tts_client
        self._translate_client = translate_client

    @property
    def tts_client(self) -> ElevenLabsClient:
        """Get the TTS client (lazy initialization)."""
        if self._tts_client is None:
            self._tts_client = get_elevenlabs_client()
        return self._tts_client

    @property
    def translate_client(self) -> GoogleTranslateClient:
        """Get the translation client (lazy initialization)."""
        if self._translate_client is None:
            self._translate_client = get_google_translate_client()
        return self._translate_client

    def text_to_speech(self, text: str, language: str = "en") -> dict:
        """
        Generate speech audio from text.

        Args:
            text: Text to convert to speech
            language: Language code (en, zh, ms, ta)

        Returns:
            Dict with audio_url and duration
        """
        audio_url, duration = self.tts_client.generate_speech(
            text=text,
            language=language
        )
        return {
            "audio_url": audio_url,
            "duration": duration,
            "language": language,
            "mock_mode": self.tts_client.is_mock_mode
        }

    def translate(
        self,
        text: str,
        source_lang: str,
        target_lang: str
    ) -> dict:
        """
        Translate text between languages.

        Args:
            text: Text to translate
            source_lang: Source language code
            target_lang: Target language code

        Returns:
            Dict with translated_text and language info
        """
        translated_text = self.translate_client.translate(
            text=text,
            source_language=source_lang,
            target_language=target_lang
        )
        return {
            "translated_text": translated_text,
            "source_language": source_lang,
            "target_language": target_lang,
            "mock_mode": self.translate_client.is_mock_mode
        }

    def translate_and_speak(
        self,
        text: str,
        target_lang: str,
        source_lang: str = "en"
    ) -> dict:
        """
        Translate text and generate speech in the target language.

        Convenience method for translating and speaking in one call.

        Args:
            text: Text to translate and speak
            target_lang: Target language code
            source_lang: Source language code (default: en)

        Returns:
            Dict with translation and TTS results
        """
        # Translate first
        translation_result = self.translate(
            text=text,
            source_lang=source_lang,
            target_lang=target_lang
        )

        # Then generate speech in target language
        tts_result = self.text_to_speech(
            text=translation_result["translated_text"],
            language=target_lang
        )

        return {
            "original_text": text,
            "translated_text": translation_result["translated_text"],
            "source_language": source_lang,
            "target_language": target_lang,
            "audio_url": tts_result["audio_url"],
            "duration": tts_result["duration"]
        }

    @staticmethod
    def get_supported_languages() -> list[dict]:
        """Get list of supported languages with codes and names."""
        return [
            {"code": code, "name": LANGUAGE_NAMES[code]}
            for code in sorted(SUPPORTED_LANGUAGES)
        ]

    @staticmethod
    def is_supported_language(code: str) -> bool:
        """Check if a language code is supported."""
        return code in SUPPORTED_LANGUAGES


# Singleton instance for reuse
_service_instance: Optional[AccessibilityService] = None


def get_accessibility_service() -> AccessibilityService:
    """Get or create the AccessibilityService singleton."""
    global _service_instance
    if _service_instance is None:
        _service_instance = AccessibilityService()
    return _service_instance
