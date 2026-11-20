from fastapi import APIRouter

from app.models.schemas import AssistantInput
from app.services.assistant_service import process_graphrag_assistant

router = APIRouter(tags=["GraphRAG Assistant"])

@router.post("/api/assistant")
@router.post("/api/assistant/graphrag")
def graphrag_assistant(req: AssistantInput):
    return process_graphrag_assistant(req.question)
