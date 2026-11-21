#!/usr/bin/env bash
# ==============================================================================
# Stop Digital Twin Platform Services (Linux / macOS)
# ==============================================================================

echo "Stopping Digital Twin services..."

# Kill processes on ports 8000, 5173, 5174 (cross-platform: fuser or lsof)
kill_port() {
    local port=$1
    # Try fuser first (Linux)
    if command -v fuser &>/dev/null; then
        fuser -k "$port/tcp" 2>/dev/null || true
    fi
    # Try lsof (macOS / Linux fallback)
    if command -v lsof &>/dev/null; then
        local pids
        pids=$(lsof -ti :"$port" 2>/dev/null)
        if [ -n "$pids" ]; then
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    fi
}

kill_port 8000
kill_port 5173
kill_port 5174

# Also pkill by known process patterns
pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "[OK] All Digital Twin background services stopped cleanly."
