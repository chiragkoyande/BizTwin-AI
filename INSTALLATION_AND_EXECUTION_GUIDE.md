# INSTALLATION, EXECUTION & DEPLOYMENT GUIDE

> **Scope:** Complete execution handbook for running, configuring, and troubleshooting the platform on Windows, Linux, and macOS.  
> **Source Evidence:** Verified against `run.bat`, `stop.bat`, `run.sh`, `stop.sh`, `backend/requirements.txt`, and `frontend/biztwin-frontend/package.json`.

---

## 1. SYSTEM PREREQUISITES & COMPATIBILITY MATRIX

| Environment | Supported Runtimes | Minimum Version | Recommended Version |
| :--- | :--- | :--- | :--- |
| **Operating System** | Windows 10/11, Ubuntu 20.04+, Fedora 38+, macOS 12+ | 64-bit Architecture | Windows 11 / Ubuntu 22.04 LTS |
| **Python** | CPython 3.10, 3.11, 3.12, 3.14 | Python 3.10 | Python 3.11 or 3.12 |
| **Node.js** | Node.js Runtime & npm | Node.js 18.x LTS | Node.js 20.x or 22.x LTS |
| **System Memory** | RAM | 4 GB | 8 GB+ (DataCo 92MB dataset consumes ~350MB in RAM) |
| **Disk Space** | Storage | 2 GB Free | 5 GB Free (for `.venv` and `node_modules`) |

---

## 2. METHOD A: ZERO-TOUCH ONE-CLICK STARTUP (RECOMMENDED)

### For Windows Users (Clients & Evaluators)
Simply navigate to the project root and **double-click `run.bat`** (or `start.bat`).

```
BizTwinAI/
├── run.bat    <-- DOUBLE CLICK THIS FILE
└── stop.bat   <-- DOUBLE CLICK TO STOP
```

#### What `run.bat` Executes Internally:
1. **Checks for Python 3.10+**: If missing, downloads official Python 3.12 installer silently and adds to PATH.
2. **Checks for Node.js LTS**: If missing, downloads official Node.js 20 MSI installer silently.
3. **Creates `.venv`**: Generates an isolated Python virtual environment in the project root.
4. **Installs Backend Dependencies**: Runs `pip install -r backend/requirements.txt`.
5. **Installs Frontend Dependencies**: Runs `npm install` inside `frontend/biztwin-frontend`.
6. **Cleans Ports**: Calls `stop.bat` to terminate any previous orphaned processes on ports 8000 and 5173.
7. **Launches Both Servers**:
   - Backend API: `uvicorn main:app --host 127.0.0.1 --port 8000 --reload`
   - Frontend UI: `npm run dev`
8. **Auto-Opens Browser**: Waits 4 seconds and opens `http://localhost:5173`.
9. **Interactive Shutdown**: Pressing `[ENTER]` in the command window runs `stop.bat` and cleanly shuts down both servers.

---

### For Linux & macOS Users
Open a terminal in the project root:

```bash
# Make scripts executable
chmod +x run.sh stop.sh

# Run the project
./run.sh
```

To stop all background processes:
```bash
./stop.sh
```

---

## 3. METHOD B: MANUAL STEP-BY-STEP INSTALLATION

If you prefer to run each command manually in separate terminal windows:

### Terminal 1: Backend Setup & Execution

#### Step 1: Navigate to Backend Directory
```bash
# Windows
cd backend

# Linux / macOS
cd backend
```

#### Step 2: Create and Activate Virtual Environment
```bash
# Windows
python -m venv .venv
call .venv\Scripts\activate.bat

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

#### Step 3: Upgrade Pip and Install Dependencies
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```
*What this installs:* `fastapi`, `uvicorn[standard]`, `pandas`, `numpy`, `scikit-learn`, `python-multipart`, `openpyxl`, `neo4j`.

#### Step 4: Environment Configuration (Optional)
```bash
# Copy example environment configuration if needed
cp .env.example .env   # On Windows: copy .env.example .env
```

#### Step 5: Start the Uvicorn ASGI Server
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Verification:* Open `http://127.0.0.1:8000/api/health` in your browser. You should see `{"status": "healthy"}`.

---

### Terminal 2: Frontend Setup & Execution

#### Step 1: Navigate to Frontend Directory
```bash
# From project root
cd frontend/biztwin-frontend
```

#### Step 2: Install Node Dependencies
```bash
npm install
```
*What this installs:* `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `lucide-react`, `recharts`.

#### Step 3: Start the Vite Development Server
```bash
npm run dev
```
*Output:*
```
  VITE v8.3.8  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Step 4: Access the Application
Open your browser and navigate to:
**`http://localhost:5173`**

---

## 4. DOCKER & CONTAINERIZATION STATUS

* **Repository Status:** `Not found in repository`.
* **Explanation for Examiners:**  
  There is currently no `Dockerfile` or `docker-compose.yml` committed to the repository. The application is natively executed as a multi-process local deployment using Python virtual environments and Node package management.

---

## 5. PRODUCTION BUILD COMMANDS

To produce an optimized, production-ready static build of the frontend:

```bash
cd frontend/biztwin-frontend
npm run build
```

This compiles all JSX into minified HTML, CSS, and JavaScript inside `frontend/biztwin-frontend/dist/`:
* `dist/index.html` (0.54 kB)
* `dist/assets/index-*.css` (21.62 kB)
* `dist/assets/index-*.js` (773 kB minified Rollup chunk)

To preview the production build locally:
```bash
npm run preview
```

---

## 6. TROUBLESHOOTING & COMMON OPERATIONAL ERRORS

### Error 1: Port 8000 Already in Use
* **Symptom:** `ERROR: [Errno 98] Address already in use` or `WinError 10048`.
* **Cause:** A previous instance of Uvicorn or another local web server is still holding port 8000.
* **Fix (Windows):** Run `stop.bat`, or execute:
  ```cmd
  for /f "tokens=5" %a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %a
  ```
* **Fix (Linux/macOS):**
  ```bash
  fuser -k 8000/tcp
  ```

### Error 2: Port 5173 Already in Use
* **Symptom:** Vite starts on `http://localhost:5174/` instead of `5173`.
* **Cause:** Another node process is holding port 5173.
* **Fix:** The frontend automatically connects to `http://127.0.0.1:8000` regardless of the frontend port, but you can free port 5173 by running `stop.bat` (Windows) or `fuser -k 5173/tcp` (Linux).

### Error 3: Dataset File Not Found on Startup
* **Symptom:** HTTP 400 with message `"No dataset available. Upload a CSV first."`
* **Cause:** Neither `DataCoSupplyChainDataset.csv` nor `sample_sales.csv` could be located by `config.py`.
* **Fix:** Ensure `DataCoSupplyChainDataset.csv` is present in the repository root directory. If absent, the system automatically falls back to `backend/data/sample_sales.csv`.
