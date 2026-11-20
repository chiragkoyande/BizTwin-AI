from fastapi import APIRouter, BackgroundTasks

from app.services.stream_service import (
    get_buffer,
    get_stats,
    start_streaming,
    stop_streaming,
)

router = APIRouter(tags=["Phase 1: Streaming Ingestion"])

@router.post("/api/v1/stream/start")
async def api_start_stream(background_tasks: BackgroundTasks, interval: float = 0.4, limit: int = 200):
    return start_streaming(background_tasks, interval, limit)

@router.post("/api/v1/stream/stop")
async def api_stop_stream():
    return stop_streaming()

@router.get("/api/v1/stream/buffer")
def api_get_stream_buffer(limit: int = 25):
    return get_buffer(limit)

@router.get("/api/v1/stream/stats")
def api_get_stream_stats():
    return get_stats()
