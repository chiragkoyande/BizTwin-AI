#!/usr/bin/env bash
# ==============================================================================
# Stop Digital Twin Platform Services (Linux / macOS)
# ==============================================================================

echo "Stopping Digital Twin services..."

# Kill processes listening on ports 8000 and 5173
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5174/tcp 2>/dev/null || true

# Also pkill by process name
pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "vite --host" 2>/dev/null || true

echo "All services stopped."
