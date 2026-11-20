from fastapi import APIRouter

from app.services.model_service import get_benchmark_models

router = APIRouter(tags=["Model Lab & Benchmarks"])

@router.get("/api/models")
@router.get("/api/models/benchmarks")
def model_benchmarks(target: str = "revenue"):
    return get_benchmark_models(target=target)
