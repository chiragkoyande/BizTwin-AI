"""Neo4j AuraDB Knowledge Graph Builder.
Canonical implementation is organized under scripts/graph_builder.py.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.graph_builder import *  # noqa: F401, F403

if __name__ == "__main__":
    build_knowledge_graph(sample_limit=250)
