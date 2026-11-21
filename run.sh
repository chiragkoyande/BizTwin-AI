#!/usr/bin/env bash
# ==============================================================================
# Digital Twin for Small Businesses - One-Click Launcher (Linux / macOS)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================================"
echo "  AI-POWERED DIGITAL TWINS FOR SMALL BUSINESSES"
echo "  One-Click Automated Setup & Launch System"
echo "======================================================================"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Step 1: Verify Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
echo "[1/5] Verifying system prerequisites..."

PYTHON_BIN=""
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PY_VER=$(python --version 2>&1 | grep -oP '\d+\.\d+')
    if [ "$(echo "$PY_VER >= 3.10" | bc -l 2>/dev/null)" = "1" ] 2>/dev/null; then
        PYTHON_BIN="python"
    fi
fi

if [ -z "$PYTHON_BIN" ]; then
    echo ""
    echo "[ERROR] Python 3.10+ is required but not found."
    echo "Please install Python from: https://www.python.org/downloads/"
    echo ""
    echo "  Fedora/RHEL: sudo dnf install python3 python3-pip python3-venv"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip python3-venv"
    echo "  macOS: brew install python@3.12"
    echo ""
    exit 1
fi
echo "  [OK] Python ready: $($PYTHON_BIN --version 2>&1)"

if ! command -v node &>/dev/null; then
    echo ""
    echo "[ERROR] Node.js is required but not found."
    echo "Please install Node.js LTS from: https://nodejs.org/"
    echo ""
    echo "  Fedora/RHEL: sudo dnf install nodejs npm"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  macOS: brew install node"
    echo ""
    exit 1
fi

if ! command -v npm &>/dev/null; then
    echo "[ERROR] npm is required but not found. Install Node.js from https://nodejs.org/"
    exit 1
fi
echo "  [OK] Node.js ready: $(node --version)"
echo "  [OK] npm ready: v$(npm --version)"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Step 2: Virtual Environment
# ─────────────────────────────────────────────────────────────────────────────
echo "[2/5] Setting up Python virtual environment (.venv)..."
if [ ! -d ".venv" ]; then
    $PYTHON_BIN -m venv .venv
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to create virtual environment."
        echo "On Fedora/RHEL: sudo dnf install python3-venv"
        echo "On Ubuntu/Debian: sudo apt install python3-venv"
        exit 1
    fi
    echo "  [OK] Created .venv directory."
else
    echo "  [OK] Existing .venv directory found."
fi

# shellcheck disable=SC1091
source .venv/bin/activate

# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Backend Requirements
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[3/5] Syncing Backend Python packages (A to Z)..."
python3 -m pip install --upgrade pip --quiet 2>/dev/null
pip install -r backend/requirements.txt --quiet 2>/dev/null
if [ $? -ne 0 ]; then
    echo "  [RETRY] Installing with verbose output..."
    pip install -r backend/requirements.txt
    if [ $? -ne 0 ]; then
        echo "[ERROR] Could not install backend dependencies. Check network connectivity."
        exit 1
    fi
fi
echo "  [OK] All backend Python dependencies installed & verified."

# ─────────────────────────────────────────────────────────────────────────────
# Step 4: Frontend Requirements
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[4/5] Syncing Frontend packages (npm install A to Z)..."
cd "$SCRIPT_DIR/frontend/biztwin-frontend"
if [ ! -d "node_modules" ]; then
    echo "  Downloading all frontend modules (Vite, React, Recharts, Lucide)..."
    npm install --no-audit --no-fund
    if [ $? -ne 0 ]; then
        echo "[ERROR] npm install failed. Check network connectivity."
        cd "$SCRIPT_DIR"
        exit 1
    fi
    echo "  [OK] Frontend packages installed successfully."
else
    echo "  Verifying node_modules dependencies..."
    npm install --no-audit --no-fund --prefer-offline 2>/dev/null || npm install --no-audit --no-fund
    echo "  [OK] Frontend dependencies verified."
fi
cd "$SCRIPT_DIR"

# ─────────────────────────────────────────────────────────────────────────────
# Step 5: Environment Config, Clean Ports, Launch Services
# ─────────────────────────────────────────────────────────────────────────────
echo ""

# Ensure .env exists
if [ ! -f "backend/.env" ] && [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo "  [INFO] Initialized backend/.env from template."
fi

# Stop any lingering processes on ports
"$SCRIPT_DIR/stop.sh" >/dev/null 2>&1 || true

echo "[5/5] Launching Digital Twin Platform Services..."
echo ""

# Launch Backend (no --reload for client stability)
echo "  Starting Backend API Server (FastAPI on http://127.0.0.1:8000)..."
(cd "$SCRIPT_DIR/backend" && "$SCRIPT_DIR/.venv/bin/uvicorn" main:app --host 127.0.0.1 --port 8000) &
BACKEND_PID=$!

# Launch Frontend
echo "  Starting Frontend Dashboard (Vite on http://localhost:5173)..."
(cd "$SCRIPT_DIR/frontend/biztwin-frontend" && npm run dev) &
FRONTEND_PID=$!

# ─────────────────────────────────────────────────────────────────────────────
# Cleanup handler
# ─────────────────────────────────────────────────────────────────────────────
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    "$SCRIPT_DIR/stop.sh" >/dev/null 2>&1 || true
    echo "All services stopped cleanly. Goodbye!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ─────────────────────────────────────────────────────────────────────────────
# Readiness Probe: Wait for Backend API before opening browser
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "  Waiting for Backend API to become ready..."
API_READY=0
for i in $(seq 1 15); do
    if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:8000/api/health" 2>/dev/null | grep -q "200"; then
        API_READY=1
        break
    fi
    sleep 1
done

if [ "$API_READY" = "1" ]; then
    echo "  [OK] Backend API is online and responding."
else
    echo "  [INFO] Backend is still initializing (large dataset loading). Browser will open now."
fi

echo ""
echo "======================================================================"
echo "  DIGITAL TWIN FOR SMALL BUSINESSES IS RUNNING!"
echo "======================================================================"
echo ""
echo "  • Executive Cockpit : http://localhost:5173"
echo "  • FastAPI Backend   : http://127.0.0.1:8000"
echo "  • Interactive Docs  : http://127.0.0.1:8000/docs"
echo "  • Subsystem Health  : http://127.0.0.1:8000/api/health"
echo ""

# Open browser (cross-platform)
if command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:5173" 2>/dev/null &
elif command -v open &>/dev/null; then
    open "http://localhost:5173" 2>/dev/null &
elif command -v sensible-browser &>/dev/null; then
    sensible-browser "http://localhost:5173" 2>/dev/null &
fi

echo "----------------------------------------------------------------------"
echo "  Press Ctrl+C at any time to shut down both servers cleanly."
echo "----------------------------------------------------------------------"
echo ""
wait
