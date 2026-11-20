"""Phase 1: Validated streaming connected to Neo4j and Causal/TFT ML pipelines.
Canonical implementation is organized under scripts/dataco_ingestion.py.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.dataco_ingestion import *  # noqa: F401, F403

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("scripts.dataco_ingestion:app", host="0.0.0.0", port=8001, reload=True)
