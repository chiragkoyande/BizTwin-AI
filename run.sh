#!/usr/bin/env bash
# ==============================================================================
# Digital Twin for Small Businesses - One-Click Launcher (Linux / macOS)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================================"
echo "  AI-POWERED DIGITAL TWINS FOR SMALL BUSINESSES"
echo "  Enterprise Multi-Modal GNN, TFT Deep Forecast & Causal AI Platform"
echo "======================================================================"
echo ""

# 1. Verify Prerequisites
echo "[1/5] Verifying system prerequisites..."
if ! command -v python3 &>/dev/null; then
    echo "[ERROR] python3 is required but not installed."
    echo "Please install Python 3.10+ from https://www.python.org/downloads/"
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo "[ERROR] node is required but not installed."
    echo "Please install Node.js (LTS recommended) from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &>/dev/null; then
    echo "[ERROR] npm is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "  [OK] Detected Python: $(python3 --version)"
echo "  [OK] Detected Node.js: $(node --version)"
echo "  [OK] Detected npm: $(npm --version)"
echo ""

# 2. Virtual Environment
echo "[2/5] Setting up Python virtual environment (.venv)..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  [OK] Created .venv directory."
else
    echo "  [OK] Existing .venv directory found."
fi

source .venv/bin/activate

# 3. Backend Requirements
echo ""
echo "[3/5] Installing Backend dependencies from backend/requirements.txt..."
python3 -m pip install --upgrade pip --quiet
pip install -r backend/requirements.txt --quiet
echo "  [OK] All backend Python dependencies installed."

# 4. Frontend Requirements
echo ""
echo "[4/5] Installing Frontend dependencies (npm install)..."
cd "$SCRIPT_DIR/frontend/biztwin-frontend"
if [ ! -d "node_modules" ]; then
    npm install --no-audit --no-fund
    echo "  [OK] Frontend dependencies installed from npm registry."
else
    npm install --no-audit --no-fund --prefer-offline
    echo "  [OK] Frontend dependencies verified."
fi
cd "$SCRIPT_DIR"

# 5. Environment Config
if [ ! -f "backend/.env" ] && [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo "  [INFO] Initialized backend/.env from template."
fi

# Stop any lingering processes on ports
./stop.sh >/dev/null 2>&1 || true

echo ""
echo "[5/5] Launching Digital Twin Platform Services..."
echo ""

# Launch Backend
(cd "$SCRIPT_DIR/backend" && "$SCRIPT_DIR/.venv/bin/uvicorn" main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

# Launch Frontend
(cd "$SCRIPT_DIR/frontend/biztwin-frontend" && npm run dev) &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "Shutting down services..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    ./stop.sh >/dev/null 2>&1 || true
    echo "All services stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo "======================================================================"
echo "  DIGITAL TWIN FOR SMALL BUSINESSES IS NOW RUNNING!"
echo "======================================================================"
echo "  • Frontend Application : http://localhost:5173"
echo "  • FastAPI Backend API  : http://127.0.0.1:8000"
echo "  • Interactive API Docs : http://127.0.0.1:8000/docs"
echo "  • Subsystem Health     : http://127.0.0.1:8000/api/health"
echo ""

sleep 3
if command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:5173" 2>/dev/null &
elif command -v open &>/dev/null; then
    open "http://localhost:5173" 2>/dev/null &
fi

echo "Press Ctrl+C at any time to shut down both servers."
wait
