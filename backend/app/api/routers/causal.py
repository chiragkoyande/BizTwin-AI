from fastapi import APIRouter

from app.models.schemas import ScenarioInput
from app.services.causal_service import evaluate_causal_counterfactual

router = APIRouter(tags=["Causal AI Sandbox"])

@router.post("/api/scenario")
@router.post("/api/financial")
@router.post("/api/causal/counterfactual")
def causal_counterfactual(s: ScenarioInput):
    return evaluate_causal_counterfactual(s)
