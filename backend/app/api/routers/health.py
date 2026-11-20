from fastapi import APIRouter

router = APIRouter(tags=["System & Health"])

@router.get("/")
def root():
    return {
        "platform": "Digital Twin for Small Businesses Platform",
        "status": "operational",
        "architecture": {
            "ingestion_stream": "Multi-Modal Ingestion Pipeline (Kafka / DataCo Streaming Engine)",
            "semantic_graph": "Semantic Business Graph & GNN Engine (5-Tier DAG)",
            "forecast_engine": "Temporal Fusion Transformer (TFT) Multi-Horizon Deep Forecasting",
            "causal_scm": "Pearl's Structural Causal Model (SCM) & Do-Calculus Counterfactual Sandbox",
            "assistant_agent": "GraphRAG Grounded Strategic Agent & Executive Multilingual Localization",
        },
        "docs_url": "/docs",
    }

@router.get("/health")
@router.get("/api/health")
@router.get("/api/v1/health")
def health():
    return {
        "status": "healthy",
        "service": "Digital Twin for Small Businesses Platform",
        "version": "2.5.0",
        "engine_state": "online",
        "subsystems": {
            "ingestion_stream": "active",
            "semantic_graph": "ready",
            "tft_forecasting": "ready",
            "causal_scm": "ready",
            "graphrag_agent": "ready",
            "executive_translation": "ready",
        },
    }
