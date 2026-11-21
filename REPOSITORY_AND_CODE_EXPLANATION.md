# REPOSITORY STRUCTURE & SOURCE CODE EXPLANATION

> **Scope:** File-by-file and folder-by-folder architectural breakdown of the complete repository.  
> **Source Evidence:** Verified directly against `/backend/`, `/frontend/biztwin-frontend/`, `/scripts/`, and root directories.

---

## 1. HIGH-LEVEL REPOSITORY LAYOUT

```
BizTwinAI/
├── backend/                              # FastAPI Python Backend Application
│   ├── app/
│   │   ├── api/
│   │   │   ├── routers/                  # 10 Domain-Specific APIRouters
│   │   │   │   ├── assistant.py          # /api/assistant/graphrag
│   │   │   │   ├── causal.py             # /api/causal/evaluate
│   │   │   │   ├── dashboard.py          # /api/dashboard, /api/activity
│   │   │   │   ├── data.py               # /api/data/upload, /api/data/profile, /api/data/reset
│   │   │   │   ├── forecast.py           # /api/forecast, /api/v1/forecast/models
│   │   │   │   ├── graph.py              # /api/graph
│   │   │   │   ├── health.py             # /, /health, /api/health
│   │   │   │   ├── models.py             # /api/models/benchmarks
│   │   │   │   ├── stream.py             # /api/v1/stream/*
│   │   │   │   └── translation.py        # /api/translation/translate
│   │   ├── core/
│   │   │   └── config.py                 # File paths, Settings, constants
│   │   ├── models/
│   │   │   └── schemas.py                # Pydantic data validation schemas
│   │   └── services/                     # 8 Core Domain Business Services
│   │       ├── assistant_service.py      # Grounded reasoning & intent matching
│   │       ├── causal_service.py         # Pearl's Do-Calculus DAG simulation
│   │       ├── data_service.py           # Ingestion, normalization, caching
│   │       ├── forecast_service.py       # TFT cache loader & linear regression
│   │       ├── graph_service.py          # In-memory heterogeneous DAG builder
│   │       ├── model_service.py          # DL model benchmarks records
│   │       ├── stream_service.py         # In-memory streaming sliding buffer
│   │       └── translation_service.py    # 5-dialect localization & acronym preservation
│   ├── data/
│   │   └── sample_sales.csv              # Fallback minimal sales data
│   ├── main.py                           # Application entrypoint & CORS setup
│   └── requirements.txt                  # Python dependencies
│
├── frontend/biztwin-frontend/            # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/layout/
│   │   │   ├── Sidebar.jsx               # Navigation bar, brand, profile card
│   │   │   └── Topbar.jsx                # Breadcrumbs, zoom, port indicator
│   │   ├── constants/
│   │   │   ├── graphData.js              # Graph schema visual constants
│   │   │   ├── navigation.js             # Nav items hierarchy & badges
│   │   │   └── translationData.js        # Multilingual presets & glossary
│   │   ├── pages/                        # 10 Modular Page Components
│   │   │   ├── Assistant/index.jsx       # GraphRAG Strategy Cockpit
│   │   │   ├── Causal/index.jsx          # Causal AI Sandbox
│   │   │   ├── Dashboard/index.jsx       # Executive Operations Dashboard
│   │   │   ├── DataManagement/index.jsx  # CSV Uploader & Data Profiler
│   │   │   ├── Forecast/index.jsx        # TFT Multi-Horizon Forecast Cones
│   │   │   ├── ModelLab/index.jsx        # Deep Learning Benchmark Lab
│   │   │   ├── Semantic/index.jsx        # Semantic Graph Visualizer
│   │   │   ├── Settings/index.jsx        # Executive Profile & Port Binder
│   │   │   ├── Streaming/index.jsx       # Ingestion Stream Buffer
│   │   │   └── Translation/index.jsx     # Multilingual Executive Localization
│   │   ├── api.js                        # Centralized Fetch API Client
│   │   ├── App.jsx                       # Top-Level SPA Routing & Global State
│   │   ├── format.js                     # Number, currency, date formatters
│   │   ├── main.jsx                      # DOM mount point
│   │   └── styles.css                    # Unified Design System Stylesheet
│   ├── index.html                        # HTML shell entry point
│   ├── package.json                      # Frontend dependencies & scripts
│   └── vite.config.js                    # Vite configuration
│
├── scripts/                              # Standalone Utilities & Pipeline Feeders
│   ├── dataco_ingestion.py               # Standalone streaming feeder API
│   └── graph_builder.py                  # Neo4j Cypher batch ingestion script
│
├── DataCoSupplyChainDataset.csv          # 180,519-row DataCo Primary Dataset (92MB)
├── forecast_cache.json                   # Pre-calculated TFT quantile forecasts
├── run.bat / start.bat                   # Windows One-Click Launchers
├── stop.bat                              # Windows Process & Port Terminator
├── run.sh / stop.sh                      # Linux / macOS Launchers
└── CLIENT_QUICKSTART.md                  # Client Quickstart & Reference Guide
```

---

## 2. BACKEND SOURCE CODE EXPLANATION

### `backend/main.py`
* **File Path:** `backend/main.py`
* **Purpose:** The primary entry point for the FastAPI backend application.
* **Contains:**
  - Search path configuration: `sys.path.insert(0, str(APP_DIR))` ensures all internal imports work cleanly.
  - FastAPI application instantiation: `app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)`.
  - CORS Middleware registration: `CORSMiddleware` configured with `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]`.
  - Router inclusions: Registers all 10 modular APIRouters from `app.api.routers`.
  - Startup event handler: `@app.on_event("startup")` logs backend initialization and dataset readiness.
* **Important Variables:** `app`, `APP_DIR`.
* **Inputs & Outputs:** Receives OS execution commands; returns the configured FastAPI ASGI application callable.
* **Dependencies:** `fastapi`, `app.core.config`, `app.api.routers.*`.
* **Contribution:** Acts as the central junction box binding all backend routes, security policies, and lifecycle events.

---

### `backend/app/core/config.py`
* **File Path:** `backend/app/core/config.py`
* **Purpose:** Centralized path configuration and application settings.
* **Contains:**
  - `APP_DIR`: Resolved path to `backend/`.
  - `PROJECT_ROOT`: Resolved path to the repository root directory.
  - `DATA_DIR`: Path to `backend/data/`.
  - `ACTIVE_PATH`: Path to `backend/data/active_dataset.csv`.
  - `META_PATH`: Path to `backend/data/active_meta.json`.
  - `SAMPLE_PATH`: Path to `backend/data/sample_sales.csv`.
  - `DATACO_PATH`: Path to `DataCoSupplyChainDataset.csv` in project root.
  - `FORECAST_CACHE_PATH`: Path to `forecast_cache.json` in project root.
  - `MAX_UPLOAD_BYTES`: File upload limit set to 150 MB (`150 * 1024 * 1024`).
  - `Settings` class: Defines `PROJECT_NAME`, `VERSION`, `DESCRIPTION`, and `CORS_ORIGINS`.
* **Contribution:** Eliminates hardcoded strings and relative path errors across the backend.

---

### `backend/app/models/schemas.py`
* **File Path:** `backend/app/models/schemas.py`
* **Purpose:** Defines Pydantic data contracts for API request validation.
* **Contains:**
  - `ScenarioInput`: Validates causal intervention sliders (`demand_change_pct`, `price_change_pct`, `marketing_change_pct`, `supplier_delay_days`, `inventory_buffer_pct`, `hiring_delta`).
  - `AssistantQuestion`: Validates chat requests (`question: str`, `context_filter: Optional[str]`).
  - `TranslationRequest`: Validates translation inputs (`text: str`, `target_language: str`).
* **Contribution:** Provides bulletproof gatekeeping: any malformed client request is rejected with a clear 422 error before invoking business logic.

---

### `backend/app/services/data_service.py`
* **File Path:** `backend/app/services/data_service.py`
* **Purpose:** Core data engine: loading, auto-detecting, normalizing, and caching supply chain datasets.
* **Key Functions:**
  - `_pick(df, *names)`: Case-insensitive column resolver that searches for alternate headers (e.g., finding `"sales"` if `"revenue"` is absent).
  - `_num(series, default)`: Safely coerces series to numeric floats, filling invalid tokens with `default`.
  - `_read_csv_bytes(raw)`: Tries `utf-8`, `utf-8-sig`, and `latin1` decoders to prevent character encoding crashes.
  - `_normalize(df)`: Maps raw supply chain columns to standardized names (`order_id`, `customer_id`, `category`, `revenue`, `profit`, `late_risk`, `shipping_mode`).
  - `@lru_cache(maxsize=6) _cached_load(path_str, mtime)`: Caches parsed DataFrames in RAM keyed by file modification time.
  - `get_data()`: Priority loader: returns `active_dataset.csv` if uploaded, falls back to `DataCoSupplyChainDataset.csv`, and finally `sample_sales.csv`.
  - `_monthly(d)`: Aggregates records into monthly time periods (`month`, `revenue`, `profit`, `demand`, `orders`).
  - `_trim_anomaly_tail(series, target)`: Identifies if trailing months represent incomplete collection (<65% of historical average) and drops them from holdout ML modeling.
* **Contribution:** Powers all platform metrics. Guarantees that every number rendered on screen is computed from the active dataset.

---

### `backend/app/services/causal_service.py`
* **File Path:** `backend/app/services/causal_service.py`
* **Purpose:** Implements Pearl's Structural Causal Model (SCM) counterfactual mathematics.
* **Key Function:**
  - `evaluate_causal_counterfactual(s: ScenarioInput)`:
    - Calculates baseline values from the trailing 3 months of usable data.
    - Applies structural intervention formulas:
      $$\text{Marketing Effect} = (\Delta\text{Mkt} / 100) \times 0.82$$
      $$\text{Price Elasticity} = (\Delta\text{Price} / 100) \times -0.45$$
      $$\text{Net Demand Factor} = \max(0.1, 1.0 + (\Delta\text{Demand} / 100) + \text{Mkt Effect} + \text{Price Effect})$$
    - Computes counterfactual revenue: $\text{Base Rev} \times \text{Net Demand} \times (1 + \Delta\text{Price})$.
    - Computes counterfactual cost factoring in supplier delay penalties ($0.8\%$ per day) and inventory holding ($3\%$ per percent buffer).
    - Generates 6-week forward counterfactual cash flow trajectories.
* **Contribution:** Bridges academic causal graph theory with concrete executive decision simulation.

---

### `backend/app/services/forecast_service.py`
* **File Path:** `backend/app/services/forecast_service.py`
* **Purpose:** Multi-horizon forecasting loader with Scikit-learn regression fallback.
* **Key Functions:**
  - `_load_tft_cache()`: Reads pre-computed TFT predictions from `forecast_cache.json`.
  - `get_tft_forecast(target)`: Maps requested targets (`future_cash_flow`, `revenue`, `demand`) to cache records. Formats historical and forecast intervals into a unified timeline with P10, P50, and P90 quantile fields.
  - `get_statistical_forecast(target, horizon)`: Algorithmic fallback using Scikit-Learn `LinearRegression` fitted on historical monthly sequences.
* **Contribution:** Provides the time-series forecasting data visualized in the TFT Forecast page.

---

### `backend/app/services/graph_service.py`
* **File Path:** `backend/app/services/graph_service.py`
* **Purpose:** In-memory Heterogeneous Semantic Business Graph builder.
* **Key Function:**
  - `build_semantic_graph(limit)`: Runs multi-dimensional Pandas GroupBy operations across `category`, `department`, `customer_segment`, `region`, and `shipping_mode` to construct a 5-tier directed graph of interconnected nodes and weighted edges. Assigns GNN risk scores and returns link prediction telemetry.
* **Contribution:** Feeds the visual interactive network canvas in the Semantic Graph module.

---

### `backend/app/services/assistant_service.py`
* **File Path:** `backend/app/services/assistant_service.py`
* **Purpose:** GraphRAG conversational AI strategy assistant.
* **Key Function:**
  - `query_strategic_agent(question)`: Performs keyword pattern matching against operational categories (`carrier`, `bottleneck`, `tft`, `causal`, `segment`). Returns grounded answers, citations, extracted subgraph entities, and suggested parameter payloads for the Causal Sandbox.
* **Contribution:** Acts as the AI copilot translating user queries into interactive sandbox actions.

---

### `backend/app/services/translation_service.py`
* **File Path:** `backend/app/services/translation_service.py`
* **Purpose:** Domain-preserving regional language localization engine.
* **Key Functions:**
  - Contains preset high-fidelity translations for core strategic scenarios in Hindi, Marathi, Gujarati, Tamil, and Telugu.
  - Implements dynamic token replacement (`re.sub`) for arbitrary texts using custom domain dictionaries.
  - Preserves critical financial acronyms (`EBITDA`, `SLA`, `GNN`, `TFT`, `P10`, `P90`, `USD`).
* **Contribution:** Delivers the localization capabilities in the Translation page and Assistant quick-actions.

---

### `backend/app/services/stream_service.py`
* **File Path:** `backend/app/services/stream_service.py`
* **Purpose:** In-memory transaction streaming buffer and telemetry generator.
* **Key Functions:**
  - `_streaming_task(interval, limit)`: Asynchronous background worker that samples records, adds simulated Kafka partition headers, and pushes events into `STREAMING_BUFFER` (capped at 50 records).
  - `start_streaming()`, `stop_streaming()`, `get_buffer()`, `get_stats()`.
* **Contribution:** Drives the real-time telemetry and streaming table in the Ingestion Stream module.

---

### `backend/app/services/model_service.py`
* **File Path:** `backend/app/services/model_service.py`
* **Purpose:** Benchmark evaluation store comparing TFT against 6 baseline architectures.
* **Contribution:** Feeds the comparative performance tables in the Model Lab module.

---

## 3. FRONTEND SOURCE CODE EXPLANATION

### `frontend/biztwin-frontend/src/main.jsx`
* **File Path:** `frontend/biztwin-frontend/src/main.jsx`
* **Purpose:** The JavaScript application root.
* **Contains:**
  - Mounts `<App />` into the DOM element `<div id="root"></div>` using React 18's `createRoot()`.
  - Wraps the application in `<React.StrictMode>`.

---

### `frontend/biztwin-frontend/src/App.jsx`
* **File Path:** `frontend/biztwin-frontend/src/App.jsx`
* **Purpose:** The central Single Page Application (SPA) shell, state coordinator, and router.
* **Key State Variables:**
  - `page`: Active navigation ID (reads from URL hash/param `?page=...`, defaults to `'dashboard'`).
  - `userProfile`: Stores executive name and role (`name`, `role`), synced with `localStorage`.
  - `dashboard`: Stores dataset KPIs and monthly telemetry from `/api/dashboard`.
  - `streamingActive`, `streamBuffer`, `streamStats`: Streaming telemetry.
  - `causalResult`: Output from `/api/causal/evaluate`.
  - `chatMessages`: Chat history for the GraphRAG assistant.
* **Key Functions:**
  - `loadPlatformData()`: Fetches `/api/dashboard`, `/api/activity`, and `/api/data/profile`.
  - `handleCausalRun()`: Debounced evaluation triggering `/api/causal/evaluate` whenever slider inputs change.
  - `executeInterventionInSandbox(params)`: Receives suggested parameters from the AI assistant, switches page to `'causal'`, and updates sliders automatically.
* **Contribution:** Connects every page, sidebar, topbar, and API call together into a unified workflow.

---

### `frontend/biztwin-frontend/src/api.js`
* **File Path:** `frontend/biztwin-frontend/src/api.js`
* **Purpose:** Standardized HTTP client wrapping browser `fetch()`.
* **Contains:**
  - `getApiBase()`: Resolves API URL (reads `localStorage.getItem('biztwin_api_base')`, defaults to `http://127.0.0.1:8000`).
  - `setApiBase(url)`: Updates API base URL dynamically.
  - `api.get(endpoint)`: Sends GET requests and parses JSON.
  - `api.post(endpoint, body)`: Sends JSON POST requests with `Content-Type: application/json`.
  - `api.upload(endpoint, formData)`: Sends multipart form data for file uploads.
* **Contribution:** Centralizes all network communication and error interception.

---

### `frontend/biztwin-frontend/src/pages/Dashboard/index.jsx`
* **Purpose:** Renders the executive operations overview.
* **Components:**
  - Top KPI cards: Gross Revenue, Operating Margin %, Total Orders, Late Delivery Risk %.
  - 5 Architectural telemetry status cards (Streaming, Semantic Graph, TFT Forecast, Causal SCM, GraphRAG Agent).
  - Trajectory AreaChart: Monthly Revenue vs. Net Operating Margin.
  - Departmental Breakdown BarChart.
  - Delivery Risk PieChart.
  - Live Subsystem Activity Stream.

---

### `frontend/biztwin-frontend/src/pages/Causal/index.jsx`
* **Purpose:** Interactive Causal AI Sandbox.
* **Components:**
  - 5 Live Sliders: Marketing Spend ($\pm 100\%$), Dynamic Price ($\pm 50\%$), Supplier Delay ($-30$ to $+60$ days), Inventory Buffer ($\pm 50\%$), Hiring Delta ($-20$ to $+50$).
  - Scenario comparison summary cards (Baseline vs. Counterfactual with colored percentage deltas).
  - 6-Week Cash Flow Projection LineChart.
  - Causal Pathway Explanation List detailing Pearl's Do-Calculus graph propagation.

---

### `frontend/biztwin-frontend/src/pages/Forecast/index.jsx`
* **Purpose:** Temporal Fusion Transformer (TFT) forecasting cockpit.
* **Components:**
  - Target Metric Selector (`future_cash_flow`, `revenue`, `inventory_levels`).
  - Multi-Horizon Quantile Cone AreaChart (Historical Actuals + P10/P50/P90 projection).
  - Variable Selection Network (VSN) feature importance horizontal progress bars.
  - Self-Attention temporal weights heatmap table.

---

### `frontend/biztwin-frontend/src/pages/Semantic/index.jsx`
* **Purpose:** 5-Tier Semantic DAG and GNN link prediction visualizer.
* **Components:**
  - Tier filter pills (All, Customer, Product, Logistics, Financial).
  - SVG/Grid interactive graph canvas with color-coded nodes.
  - Node Details Inspector pane (shows value, risk score, GNN cluster, connected edges).
  - Bottleneck pathway tracer highlighting Standard Shipping late delivery risk.

---

### `frontend/biztwin-frontend/src/pages/Assistant/index.jsx`
* **Purpose:** GraphRAG conversational strategic copilot.
* **Components:**
  - Chat thread history with grounded citation cards.
  - Active Subgraph Entities inspector sidebar.
  - Suggested question quick-pills.
  - Direct *"Execute in Causal Sandbox"* action button transferring parameters to the simulator.
  - Multi-language translation triggers on chat messages.

---

### `frontend/biztwin-frontend/src/pages/Translation/index.jsx`
* **Purpose:** Executive Multilingual Localization workbench.
* **Components:**
  - Language dialect selector (Hindi, Marathi, Gujarati, Tamil, Telugu).
  - Dialect metadata card (Script, commercial region, target SMB hubs).
  - Translation input/output comparison boxes.
  - Domain glossary explorer with category filtering.
  - Downloadable briefing text generator (`BizTwin_<Lang>_Briefing.txt`).

---

### `frontend/biztwin-frontend/src/pages/Settings/index.jsx`
* **Purpose:** User profile customizer and system configuration.
* **Components:**
  - Executive Profile & User Identity panel: Full Name and Executive Title inputs with live initials avatar preview and LocalStorage persistence.
  - Backend API Port binder allowing custom URL connections.

---

## 4. STANDALONE SCRIPTS EXPLANATION

### `scripts/graph_builder.py`
* **File Path:** `scripts/graph_builder.py`
* **Purpose:** Standalone batch ingestion script that loads `DataCoSupplyChainDataset.csv` into a remote Neo4j AuraDB instance.
* **Classes & Methods:**
  - `Neo4jKnowledgeGraph(uri, user, password)`: Manages database connections using `GraphDatabase.driver()`.
  - `create_constraints()`: Enforces unique constraints on `Customer.id`, `Order.id`, `Product.id`, and `Department.name`.
  - `ingest_records(df_records)`: Executes an unrolled Cypher query with `UNWIND $batch AS row` to construct nodes and `PLACED`, `CONTAINS`, `BELONGS_TO` edges.
  - `run_graph_diagnostics()`: Runs count queries to verify graph population.

---

### `scripts/dataco_ingestion.py`
* **File Path:** `scripts/dataco_ingestion.py`
* **Purpose:** A standalone FastAPI microservice demonstrating streaming data validation with Pydantic.
* **Classes:**
  - `DataCoTransactionSchema(BaseModel)`: Validates 15 supply chain fields.
  - `DataCoPipeline.load_and_clean_data(file_path)`: Cleans and parses DataCo records.
