from fastapi import APIRouter

from app.models.schemas import TranslationInput
from app.services.translation_service import (
    get_glossary_data,
    translate_executive_text,
)

router = APIRouter(tags=["Multilingual Localization"])

@router.get("/api/translation/glossary")
def get_translation_glossary():
    return get_glossary_data()

@router.post("/api/translation")
def translate_insight(req: TranslationInput):
    return translate_executive_text(req.text, req.target_language)
