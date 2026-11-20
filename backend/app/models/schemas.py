from typing import Optional
from pydantic import BaseModel, Field

class ScenarioInput(BaseModel):
    demand_change_pct: float = Field(15, ge=-90, le=300)
    price_change_pct: float = Field(0, ge=-90, le=300)
    marketing_change_pct: float = Field(0, ge=-100, le=500)
    supplier_delay_days: float = Field(0, ge=-60, le=365)
    inventory_buffer_pct: float = Field(0, ge=-80, le=200)
    hiring_delta: int = Field(0, ge=-20, le=50)
    baseline_revenue: Optional[float] = Field(None, gt=0)
    baseline_cost: Optional[float] = Field(None, ge=0)

class TranslationInput(BaseModel):
    text: str
    target_language: str = "Hindi"

class AssistantInput(BaseModel):
    question: str
