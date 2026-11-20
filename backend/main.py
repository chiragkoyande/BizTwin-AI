"""BizTwin AI Enterprise Digital Twin Platform - Backend API.

Implements the 4-Phase Architecture defined in:
"AI-Powered Digital Twins for Small Businesses: Enterprise-Scale Digital Twin
Platform for Small Businesses Using Multi-Modal Graph Neural Networks and Counterfactual AI"

Phase 1: Multi-Modal Ingestion Pipeline (DataCo Supply Chain & Streaming Engine)
Phase 2: Semantic Business Graph & Graph Neural Network (GNN) Engine
Phase 3A: Deep Learning Multi-Horizon Forecasting Engine (Temporal Fusion Transformer / TFT)
Phase 3B: Causal AI Engine & Counterfactual Simulation (Pearl's Do-Calculus & DAG)
Phase 4: GraphRAG AI Strategy Assistant & Multilingual Executive Localization
"""
from __future__ import annotations

import sys
from pathlib import Path

# Ensure backend directory is in python search path
APP_DIR = Path(__file__).resolve().parent
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routers import (
    assistant,
    causal,
    dashboard,
    data,
    forecast,
    graph,
    health,
    models,
    stream,
    translation,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(stream.router)
app.include_router(data.router)
app.include_router(graph.router)
app.include_router(forecast.router)
app.include_router(causal.router)
app.include_router(assistant.router)
app.include_router(translation.router)
app.include_router(models.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
