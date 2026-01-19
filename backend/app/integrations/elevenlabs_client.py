"""
ElevenLabs Text-to-Speech client wrapper.

Provides TTS functionality with automatic fallback to mock audio when
API key is not available (demo/development mode).
"""

from typing import Optional
import base64

from app.core.config import settings
from app.utils.mock_audio import get_mock_audio_base64, get_mock_audio_duration


class ElevenLabsClient:
    """
    Wrapper for ElevenLabs Text-to-Speech API.

    Generates natural-sounding speech in multiple languages.
    Falls back to mock audio when API key is not configured.
    """

    # Voice IDs for different languages (ElevenLabs voice IDs)
    VOICE_MAP = {
        "en": "21m00Tcm4TlvDq8ikWAM",  # Rachel - English
        "zh": "21m00Tcm4TlvDq8ikWAM",  # Use multilingual model with Rachel
        "ms": "21m00Tcm4TlvDq8ikWAM",  # Use multilingual model with Rachel
        "ta": "21m00Tcm4TlvDq8ikWAM",  # Use multilingual model with Rachel
    }

    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self._client = None

        if self.api_key:
            try:
                from elevenlabs import set_api_key
                set_api_key(self.api_key)
                self._client = True  # Mark as initialized
            except ImportError:
                print("[TTS] elevenlabs library not installed, using mock mode")
            except Exception as e:
                print(f"[TTS] Failed to initialize ElevenLabs: {e}")

    @property
    def is_mock_mode(self) -> bool:
        """Check if running in mock mode (no API key or client)."""
        return not self.api_key or not self._client

    def generate_speech(
        self,
        text: str,
        language: str = "en",
        voice: Optional[str] = None
    ) -> tuple[str, float]:
        """
        Generate speech from text.

        Args:
            text: Text to convert to speech (max 5000 chars)
            language: Language code (en, zh, ms, ta)
            voice: Optional voice ID override

        Returns:
            Tuple of (audio_data_url, estimated_duration_seconds)
        """
        # Truncate long text
        if len(text) > 5000:
            text = text[:5000]

        # Use mock mode if no API key
        if self.is_mock_mode:
            print(f"[TTS Mock] Language: {language}, Text: {text[:50]}...")
            return get_mock_audio_base64(), self._estimate_duration(text)

        # Real ElevenLabs API call
        try:
            from elevenlabs import generate

            voice_id = voice or self.VOICE_MAP.get(language, self.VOICE_MAP["en"])

            audio = generate(
                text=text,
                voice=voice_id,
                model="eleven_multilingual_v2"
            )

            # Convert bytes to base64 data URL
            if isinstance(audio, bytes):
                audio_base64 = base64.b64encode(audio).decode('utf-8')
                return f"data:audio/mp3;base64,{audio_base64}", self._estimate_duration(text)

            # Handle generator response (streaming)
            audio_bytes = b''.join(audio)
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            return f"data:audio/mp3;base64,{audio_base64}", self._estimate_duration(text)

        except Exception as e:
            print(f"[TTS] ElevenLabs API error: {e}, falling back to mock")
            return get_mock_audio_base64(), self._estimate_duration(text)

    def _estimate_duration(self, text: str) -> float:
        """
        Estimate audio duration based on text length.

        Rough estimate: ~150ms per word, ~50ms per character for non-English.

        Args:
            text: The text being spoken

        Returns:
            Estimated duration in seconds
        """
        # Count words (rough estimate)
        word_count = len(text.split())

        # ~150ms per word, minimum 0.5s
        duration = max(0.5, word_count * 0.15)

        # Cap at 60 seconds
        return min(duration, 60.0)

    def _get_voice_for_language(self, language: str) -> str:
        """Map language codes to appropriate voice IDs."""
        return self.VOICE_MAP.get(language, self.VOICE_MAP["en"])


# Singleton instance for reuse
_client_instance: Optional[ElevenLabsClient] = None


def get_elevenlabs_client() -> ElevenLabsClient:
    """Get or create the ElevenLabs client singleton."""
    global _client_instance
    if _client_instance is None:
        _client_instance = ElevenLabsClient()
    return _client_instance
