from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.core.deps import get_db
from app.integrations.elevenlabs_client import get_elevenlabs_client
from app.integrations.google_translate import (
    get_google_translate_client,
    GoogleTranslateClient,
    SUPPORTED_LANGUAGES
)

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    language: str = "en"  # en, zh, ms, ta


class TTSResponse(BaseModel):
    audio_url: str
    duration: float


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str


class TranslationResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str


@router.post("/tts", response_model=TTSResponse)
async def text_to_speech(
    request: TTSRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convert text to speech using ElevenLabs

    - **text**: Text to convert to speech
    - **language**: Language code (en, zh, ms, ta)

    Returns audio URL (base64 data URL)
    """
    # Validate input
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty"
        )

    # Truncate very long text
    text = request.text.strip()
    if len(text) > 5000:
        text = text[:5000]

    # Generate speech using ElevenLabs client
    client = get_elevenlabs_client()
    audio_url, duration = client.generate_speech(
        text=text,
        language=request.language
    )

    return TTSResponse(audio_url=audio_url, duration=duration)


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(
    request: TranslationRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Translate text using Google Translate

    - **text**: Text to translate
    - **source_language**: Source language code
    - **target_language**: Target language code

    Supported: en (English), zh (Mandarin), ms (Malay), ta (Tamil)
    """
    # Validate input
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty"
        )

    # Validate language codes
    if request.source_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported source language. Supported: {', '.join(SUPPORTED_LANGUAGES)}"
        )

    if request.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported target language. Supported: {', '.join(SUPPORTED_LANGUAGES)}"
        )

    # Truncate very long text
    text = request.text.strip()
    if len(text) > 10000:
        text = text[:10000]

    # Return original if same language
    if request.source_language == request.target_language:
        return TranslationResponse(
            translated_text=text,
            source_language=request.source_language,
            target_language=request.target_language
        )

    # Translate using Google Translate client
    client = get_google_translate_client()
    translated_text = client.translate(
        text=text,
        source_language=request.source_language,
        target_language=request.target_language
    )

    return TranslationResponse(
        translated_text=translated_text,
        source_language=request.source_language,
        target_language=request.target_language
    )


@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages for accessibility features"""
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "zh", "name": "中文 (Mandarin)"},
            {"code": "ms", "name": "Malay"},
            {"code": "ta", "name": "தமிழ் (Tamil)"}
        ]
    }
