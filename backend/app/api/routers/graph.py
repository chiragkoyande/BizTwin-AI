from fastapi import APIRouter

from app.services.graph_service import build_semantic_graph

router = APIRouter(tags=["Phase 2: Semantic Graph & GNN"])

@router.get("/api/graph")
@router.get("/api/graph/semantic")
def semantic_graph(limit: int = 10):
    return build_semantic_graph(limit=limit)
