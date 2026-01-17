from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.core.deps import get_db

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
    
    Returns audio URL (can be base64 or S3 URL)
    """
    # TODO: Call ElevenLabs API
    # Generate speech audio
    # Store audio (S3 or return base64)
    # Return URL
    raise HTTPException(status_code=501, detail="TTS not implemented yet")


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
    # TODO: Call Google Translate API
    # Translate text
    # Return translated text
    raise HTTPException(status_code=501, detail="Translation not implemented yet")


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
