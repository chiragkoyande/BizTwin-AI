from fastapi import APIRouter

from app.services.forecast_service import (
    get_statistical_forecast,
    get_tft_forecast,
)

router = APIRouter(tags=["Deep Forecasting"])

@router.get("/api/forecast/tft")
def tft_forecast(target: str = "future_cash_flow"):
    return get_tft_forecast(target=target)

@router.get("/api/forecast")
def forecast(target: str = "revenue", horizon: int = 3):
    return get_statistical_forecast(target=target, horizon=horizon)
