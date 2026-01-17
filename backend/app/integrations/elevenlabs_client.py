from typing import Optional
import base64

from app.core.config import settings


class ElevenLabsClient:
    """
    Wrapper for ElevenLabs Text-to-Speech API
    
    Generates natural-sounding speech in multiple languages
    """
    
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        # TODO: Initialize ElevenLabs client when API key available
        # from elevenlabs import generate, set_api_key
        # if self.api_key:
        #     set_api_key(self.api_key)
    
    def generate_speech(
        self,
        text: str,
        language: str = "en",
        voice: str = "Rachel"
    ) -> Optional[str]:
        """
        Generate speech from text
        
        Args:
            text: Text to convert to speech
            language: Language code (en, zh, ms, ta)
            voice: Voice name (Rachel, Adam, etc.)
        
        Returns:
            Base64 encoded audio data or URL
        """
        if not self.api_key:
            print(f"[TTS Mock] Language: {language}, Text: {text[:50]}...")
            return "data:audio/mp3;base64,mock_audio_data"
        
        # TODO: Implement actual ElevenLabs API call
        # try:
        #     audio = generate(
        #         text=text,
        #         voice=self._get_voice_for_language(language),
        #         model="eleven_multilingual_v2"
        #     )
        #     
        #     # Convert to base64 for easy transmission
        #     audio_base64 = base64.b64encode(audio).decode('utf-8')
        #     return f"data:audio/mp3;base64,{audio_base64}"
        # except Exception as e:
        #     print(f"TTS generation failed: {e}")
        #     return None
        
        return "data:audio/mp3;base64,mock_audio_data"
    
    def _get_voice_for_language(self, language: str) -> str:
        """Map language codes to appropriate voices"""
        voice_map = {
            "en": "Rachel",
            "zh": "Xiaoming",  # Chinese voice
            "ms": "Rachel",    # Use English voice for Malay
            "ta": "Rachel"     # Use English voice for Tamil
        }
        return voice_map.get(language, "Rachel")
