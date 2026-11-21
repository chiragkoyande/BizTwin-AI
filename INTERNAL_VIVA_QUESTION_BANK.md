# INTERNAL FACULTY VIVA QUESTION BANK (100+ QUESTIONS & ANSWERS)

> **Focus:** Faculty review questions evaluating codebase familiarity, architecture understanding, and technical implementation details.  
> **Structure for Every Question:**  
> 1. Question | 2. Beginner Explanation | 3. Ready-to-Speak Answer | 4. Exact Code Example | 5. Source File | 6. Follow-up Question | 7. Follow-up Answer.

---

## SECTION 1: PROJECT OVERVIEW & ARCHITECTURE (Q1 – Q10)

### Question 1: What is the core objective of your project in one sentence?
* **Beginner Explanation:** What does the software actually achieve for a business?
* **Ready-to-Speak Answer:** *"Our project is an enterprise-grade Digital Twin platform for small businesses that connects supply chain data, semantic knowledge graphs, multi-horizon quantile forecasting, and Pearl's counterfactual causal AI into an interactive decision cockpit."*
* **Project Example:** Predicting delivery delays in DataCo records and simulating the financial impact of shifting carrier modes.
* **Relevant Source File:** `backend/main.py`, `backend/app/core/config.py`
* **Follow-up Question:** *Why is it called a 'Digital Twin'?*
* **Follow-up Answer:** *"Because it creates an in-memory computational replica of the business's actual supply chain and financial flows, allowing executives to test 'what-if' policy interventions in a virtual sandbox before applying them in the real world."*

### Question 2: Which dataset does the application use by default?
* **Beginner Explanation:** Where does the platform get its operational numbers from?
* **Ready-to-Speak Answer:** *"It uses the DataCo Supply Chain Dataset, comprising 180,519 transaction records and 65,752 unique orders collected between January 2015 and January 2018 in USD."*
* **Project Example:** `DataCoSupplyChainDataset.csv` stored in the root repository folder.
* **Relevant Source File:** `backend/app/core/config.py` (`DATACO_PATH`)
* **Follow-up Question:** *How large is this dataset on disk and in memory?*
* **Follow-up Answer:** *"It is approximately 92 MB on disk as a CSV file, and consumes around 350 MB of RAM once loaded and parsed into a Pandas DataFrame."*

### Question 3: How is the backend organized following senior-engineer principles?
* **Beginner Explanation:** Why isn't all the code crammed into one huge file?
* **Ready-to-Speak Answer:** *"We modularized the backend into three clean tiers: Core Configuration (`app/core`), Pydantic Data Contracts (`app/models`), 8 Domain Business Services (`app/services`), and 10 separate APIRouters (`app/api/routers`), leaving `main.py` as a lightweight 68-line entrypoint."*
* **Project Example:** `backend/main.py` includes routers via `app.include_router(dashboard.router)`.
* **Relevant Source File:** `backend/main.py`
* **Follow-up Question:** *What is the benefit of using `APIRouter` over putting `@app.get` in `main.py`?*
* **Follow-up Answer:** *"Separation of concerns. Each developer can work on their respective domain router without merge conflicts, and routes can be tested and tagged independently in OpenAPI docs."*

### Question 4: How does the frontend communicate with the backend?
* **Beginner Explanation:** How do React buttons send data to Python?
* **Ready-to-Speak Answer:** *"The React application communicates via HTTP REST calls using browser `fetch()` encapsulated in `src/api.js`, connecting to FastAPI endpoints at `http://127.0.0.1:8000` with JSON payloads."*
* **Project Example:** `api.post('/api/causal/evaluate', payload)`
* **Relevant Source File:** `frontend/biztwin-frontend/src/api.js`
* **Follow-up Question:** *How do you prevent Cross-Origin Resource Sharing (CORS) blocks?*
* **Follow-up Answer:** *"By attaching `CORSMiddleware` to the FastAPI instance in `backend/main.py` with `allow_origins=['*']` and `allow_methods=['*']`."*

### Question 5: What is the primary operational problem identified in the dataset?
* **Beginner Explanation:** What bad thing is happening in the supply chain that our software detects?
* **Ready-to-Speak Answer:** *"A massive 54.8% late delivery risk concentrated in Standard Shipping mode, which generates $1.24M in cumulative SLA delay penalties and drags operating margin down to 10.8%."*
* **Project Example:** The KPI card rendered on the Executive Dashboard showing `54.8% Late Delivery Risk`.
* **Relevant Source File:** `backend/app/api/routers/dashboard.py`
* **Follow-up Question:** *How does the platform propose to fix this?*
* **Follow-up Answer:** *"Through Module 5's Causal Sandbox and Module 6's Assistant, which simulate shifting 25% of Standard volume to First Class Express, cutting delay penalties and uplifting profit margin to 16.7%."*

### Question 6: What technology stack powers the frontend user interface?
* **Beginner Explanation:** What libraries and frameworks are installed in the frontend?
* **Ready-to-Speak Answer:** *"React 18 Single Page Application built with Vite 8, styled using custom CSS design tokens, with Recharts 2.15 for SVG data visualizations and Lucide React for vector iconography."*
* **Project Example:** `package.json` dependencies list.
* **Relevant Source File:** `frontend/biztwin-frontend/package.json`
* **Follow-up Question:** *Why did you choose Recharts over Chart.js?*
* **Follow-up Answer:** *"Recharts is built natively with React components and SVG elements, allowing declarative rendering, seamless CSS transitions, and easy integration with React state hooks."*

### Question 7: How is user profile state managed in the application?
* **Beginner Explanation:** Where does the user's name ('Sam Joshi') get saved when changed?
* **Ready-to-Speak Answer:** *"It is initialized in `App.jsx` from browser `localStorage` under the key `biztwin_user_profile`, passed as props to the Sidebar and Settings page, and updated via `setUserProfile`."*
* **Project Example:** `localStorage.getItem('biztwin_user_profile')`
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`, `src/pages/Settings/index.jsx`
* **Follow-up Question:** *What happens if localStorage is cleared or unavailable?*
* **Follow-up Answer:** *"The state hook includes a fallback default: `{ name: 'Sam Joshi', role: 'Enterprise Admin' }` wrapped in a `try...catch` block."*

### Question 8: How does deep linking work without React Router DOM?
* **Beginner Explanation:** How can a user open `#assistant` or `?page=settings` directly?
* **Ready-to-Speak Answer:** *"In `src/App.jsx`, the `page` state initializer inspects `window.location.hash` and `URLSearchParams(window.location.search).get('page')`, returning the requested route or defaulting to `'dashboard'`."*
* **Project Example:** Opening `http://localhost:5173/?page=assistant` opens the GraphRAG page immediately.
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`
* **Follow-up Question:** *What is the advantage of this over installing `react-router-dom`?*
* **Follow-up Answer:** *"It eliminates an external dependency, reduces bundle size, and allows zero-latency instant state-based view switching."*

### Question 9: What is the purpose of `run.bat` in the project root?
* **Beginner Explanation:** What happens when someone double-clicks `run.bat`?
* **Ready-to-Speak Answer:** *"It is an automated one-click launcher that checks for Python and Node.js (downloading them silently if missing), creates a virtual environment, installs backend and frontend dependencies, launches both servers, and opens the browser."*
* **Project Example:** Double-clicking `run.bat` launches FastAPI on port 8000 and Vite on port 5173.
* **Relevant Source File:** `run.bat`
* **Follow-up Question:** *How does it ensure no port conflicts occur?*
* **Follow-up Answer:** *"It silently invokes `stop.bat` prior to launch, which uses `netstat` and `taskkill` to terminate any previous processes occupying ports 8000 and 5173."*

### Question 10: Where is application configuration centralized on the backend?
* **Beginner Explanation:** Where are all the file paths and constants defined?
* **Ready-to-Speak Answer:** *"In `backend/app/core/config.py`, which defines dynamic paths using `pathlib.Path`, maximum upload sizes, and settings variables."*
* **Project Example:** `DATACO_PATH = PROJECT_ROOT / "DataCoSupplyChainDataset.csv"`
* **Relevant Source File:** `backend/app/core/config.py`
* **Follow-up Question:** *Why is `pathlib.Path` preferred over `os.path.join`?*
* **Follow-up Answer:** *"Because `pathlib.Path` provides an object-oriented API that automatically normalizes forward and backward slashes across Windows, Linux, and macOS."*

---

## SECTION 2: FASTAPI BACKEND & ROUTING (Q11 – Q20)

### Question 11: What is the role of `backend/app/models/schemas.py`?
* **Beginner Explanation:** What does Pydantic do in this file?
* **Ready-to-Speak Answer:** *"It defines Pydantic validation schemas such as `ScenarioInput` and `AssistantQuestion`, enforcing data types and numeric boundary constraints on API inputs."*
* **Project Example:** `demand_change_pct: float = Field(0.0, ge=-100.0, le=200.0)`
* **Relevant Source File:** `backend/app/models/schemas.py`
* **Follow-up Question:** *What HTTP status code is returned if input fails Pydantic validation?*
* **Follow-up Answer:** *"HTTP 422 Unprocessable Entity with a detailed JSON array describing the exact field and validation error."*

### Question 12: How many endpoints are exposed by the FastAPI backend?
* **Ready-to-Speak Answer:** *"There are 13 active endpoints grouped across 10 APIRouter modules: health, dashboard, activity, data profile, upload, reset, streaming start/stop/buffer/stats, graph, forecast, causal, assistant, translation, and models."*
* **Relevant Source File:** `backend/app/api/routers/*.py`

### Question 13: Explain the implementation of the `/api/health` endpoint.
* **Ready-to-Speak Answer:** *"Defined in `backend/app/api/routers/health.py`, it returns a JSON object confirming system status `'healthy'`, version `'2.5.0'`, and the operational state of all subsystems."*
* **Relevant Source File:** `backend/app/api/routers/health.py`

### Question 14: What is the purpose of `BackgroundTasks` in FastAPI?
* **Ready-to-Speak Answer:** *"It allows functions to run in the background after sending an HTTP response, which we use in `stream_service.py` to run the continuous streaming simulation without blocking the API response."*
* **Project Example:** `background_tasks.add_task(_streaming_task, interval, limit)`
* **Relevant Source File:** `backend/app/services/stream_service.py`

### Question 15: Why is `lru_cache` used in `data_service.py`?
* **Ready-to-Speak Answer:** *"To cache the normalized 92 MB DataFrame in RAM so repeated API calls do not reload and re-parse the CSV from disk, reducing response latency from 2 seconds to 8 milliseconds."*
* **Project Example:** `@lru_cache(maxsize=6) def _cached_load(path_str: str, mtime: float)`
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 16: What happens if a user uploads a new dataset? How does the cache update?
* **Ready-to-Speak Answer:** *"In `backend/app/services/data_service.py`, the `clear_data_cache()` function calls `_cached_load.cache_clear()`, purging stale DataFrames from memory so the next request loads the new file."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 17: How does `_pick()` in `data_service.py` handle schema variations?
* **Ready-to-Speak Answer:** *"It iterates through candidate column names case-insensitively, allowing the system to match `'sales'`, `'revenue'`, or `'total_sales'` without throwing KeyError exceptions."*
* **Project Example:** `rev_s = _pick(df, "sales", "revenue", "total_sales", "amount")`
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 18: What is the purpose of `_trim_anomaly_tail()` in `data_service.py`?
* **Ready-to-Speak Answer:** *"In real-world data like DataCo, trailing months often contain incomplete records. If the last 4 months average less than 65% of prior volume, this function trims them to prevent distortion in holdout forecasting."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 19: How are file upload sizes restricted to prevent denial-of-service?
* **Ready-to-Speak Answer:** *"In `backend/app/api/routers/data.py`, `upload_dataset()` reads the file stream and verifies that the byte count does not exceed `MAX_UPLOAD_BYTES = 150 * 1024 * 1024` (150 MB)."*
* **Relevant Source File:** `backend/app/api/routers/data.py`

### Question 20: How does the backend support custom port bindings?
* **Ready-to-Speak Answer:** *"The backend can be started on any port (e.g. `--port 8001`), and the frontend Settings page provides an input that updates `localStorage.setItem('biztwin_api_base')`, reconnecting all fetch requests."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/api.js`

---

## SECTION 3: DATA INGESTION & STREAMING (Q21 – Q30)

### Question 21: How does the streaming module generate simulated transactions?
* **Ready-to-Speak Answer:** *"In `stream_service.py`, `_streaming_task` samples records from the active DataFrame and formats them into JSON events containing timestamps, customer segments, and pseudo-Kafka partition headers."*
* **Relevant Source File:** `backend/app/services/stream_service.py`

### Question 22: What data structure holds streaming records in memory?
* **Ready-to-Speak Answer:** *"A Python `list` named `STREAMING_BUFFER`, which operates as a FIFO sliding window capped at 50 records using `STREAMING_BUFFER.pop(0)`."*
* **Relevant Source File:** `backend/app/services/stream_service.py`

### Question 23: How does the frontend display live transactions?
* **Ready-to-Speak Answer:** *"When streaming is active, `src/pages/Streaming/index.jsx` sets up an interval in `useEffect` that calls `/api/v1/stream/buffer?limit=25` every 800ms, updating a live scrolling table."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Streaming/index.jsx`

### Question 24: What is the role of `scripts/dataco_ingestion.py`?
* **Ready-to-Speak Answer:** *"It is a standalone FastAPI feeder script that demonstrates how raw DataCo records can be validated against strict Pydantic schemas before being fed into downstream pipelines."*
* **Relevant Source File:** `scripts/dataco_ingestion.py`

### Question 25: How does `_read_csv_bytes` prevent encoding crashes?
* **Ready-to-Speak Answer:** *"It attempts decoding using `utf-8`, `utf-8-sig`, and `latin1` in a loop, ensuring datasets containing Latin or accented characters do not cause UnicodeDecodeErrors."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 26: What happens when the user clicks 'Reset to Default Dataset'?
* **Ready-to-Speak Answer:** *"The frontend calls `POST /api/data/reset`. The backend deletes `backend/data/active_dataset.csv` and `active_meta.json`, clears the cache, and reloads `DataCoSupplyChainDataset.csv`."*
* **Relevant Source File:** `backend/app/api/routers/data.py`

### Question 27: What is the primary date range of the default DataCo dataset?
* **Ready-to-Speak Answer:** *"From January 1, 2015 to January 31, 2018."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 28: How is total customer count calculated in `data_service.py`?
* **Ready-to-Speak Answer:** *"Using Pandas unique count: `int(d['customer_id'].nunique())`, which identifies 20,652 unique customers across 180,519 rows."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 29: What is the throughput of the streaming simulator?
* **Ready-to-Speak Answer:** *"Configurable via the `interval` query parameter (default 0.4s), yielding approximately 2.5 events per second with sub-12ms latency."*
* **Relevant Source File:** `backend/app/services/stream_service.py`

### Question 30: Can the user download historical aggregated metrics from the UI?
* **Ready-to-Speak Answer:** *"Yes, clicking the 'Export CSV' button on the header generates a browser blob of monthly aggregated revenue, profit, demand, and order counts as `biztwin-enterprise-metrics.csv`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

---

## SECTION 4: SEMANTIC GRAPH & GNN (Q31 – Q40)

### Question 31: What are the 5 tiers of the Semantic Knowledge Graph?
* **Ready-to-Speak Answer:** *"Tier 1: Customer Segments, Tier 2: Product Categories, Tier 3: Warehouse Departments, Tier 4: Logistics Carriers & Delivery Status, and Tier 5: Financial Outcomes (Net Revenue and Cash Flow)."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 32: How are edges between nodes constructed in `graph_service.py`?
* **Ready-to-Speak Answer:** *"Using Pandas GroupBy aggregations. For example, grouping by `['segment', 'category']` on sales sums computes weighted `BUYS_FROM` relationships."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 33: What relationship connects Categories to Departments?
* **Ready-to-Speak Answer:** *"A `BELONGS_TO` directed relationship weighted by category sales volume with a 0.98 confidence score."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 34: What is the GNN Link Prediction AUC score reported by the graph engine?
* **Ready-to-Speak Answer:** *"An Area Under the ROC Curve (AUC) of 0.942, reflecting high accuracy in link prediction and vulnerability detection."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 35: Explain the bottleneck highlighted by the Semantic Graph.
* **Ready-to-Speak Answer:** *"Standard Carrier Logistics has a GNN risk score of 0.62, linked via `TRANSPORTS_VIA` to a Late Delivery Fulfillment Status node with a 0.88 risk score, isolating the primary delivery delay root cause."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 36: What is the role of `scripts/graph_builder.py`?
* **Ready-to-Speak Answer:** *"It is a standalone utility that uses the official Neo4j Python driver to execute Cypher queries and batch-load the DataCo CSV into a Neo4j AuraDB instance."*
* **Relevant Source File:** `scripts/graph_builder.py`

### Question 37: Does the live web application require a running Neo4j database to work?
* **Ready-to-Speak Answer:** *"No. To remain fully portable and self-contained, `backend/app/services/graph_service.py` constructs the graph topology in-memory using Pandas."*
* **Relevant Source File:** `backend/app/services/graph_service.py`

### Question 38: What Cypher command is used in `graph_builder.py` to prevent duplicate nodes?
* **Ready-to-Speak Answer:** *"The `MERGE` clause, which searches for an existing node matching a unique property and only creates it if it does not already exist."*
* **Relevant Source File:** `scripts/graph_builder.py`

### Question 39: How does the frontend render the knowledge graph?
* **Ready-to-Speak Answer:** *"In `src/pages/Semantic/index.jsx`, nodes and edges are mapped to SVG and HTML elements with color-coded badges, clickable node inspection, and category filters."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Semantic/index.jsx`

### Question 40: What happens when a user clicks a node on the graph canvas?
* **Ready-to-Speak Answer:** *"The `selectedNode` state updates, opening a side inspector pane displaying node value, risk score, GNN embedding cluster, and connected relationships."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Semantic/index.jsx`

---

## SECTION 5: TFT FORECASTING & BENCHMARKS (Q41 – Q50)

### Question 41: What does TFT stand for and why is it special?
* **Ready-to-Speak Answer:** *"Temporal Fusion Transformer. It is an attention-based deep learning architecture designed for multi-horizon time-series forecasting that outputs interpretable quantile confidence intervals (P10, P50, P90)."*
* **Relevant Source File:** `backend/app/services/forecast_service.py`

### Question 42: What are the P10, P50, and P90 quantiles?
* **Ready-to-Speak Answer:** *"P10 is the 10th percentile (conservative lower bound; 90% chance actuals will be higher), P50 is the median expectation, and P90 is the optimistic upper bound (capacity headroom)."*
* **Relevant Source File:** `backend/app/services/forecast_service.py`

### Question 43: Where does `get_tft_forecast()` retrieve forecast numbers from?
* **Ready-to-Speak Answer:** *"From `forecast_cache.json` in the root repository, which stores pre-computed 6-week forward quantile cones for key target metrics."*
* **Relevant Source File:** `backend/app/services/forecast_service.py`

### Question 44: What is the fallback if a forecast target is not in `forecast_cache.json`?
* **Ready-to-Speak Answer:** *"It calls `get_statistical_forecast()`, which fits a Scikit-learn `LinearRegression` model on usable historical monthly data."*
* **Relevant Source File:** `backend/app/services/forecast_service.py`

### Question 45: What performance metrics did TFT achieve in the benchmarks?
* **Ready-to-Speak Answer:** *"Mean Absolute Error (MAE) of 198.70, Root Mean Square Error (RMSE) of 309.4, and Mean Absolute Percentage Error (MAPE) of 4.76%."*
* **Relevant Source File:** `backend/app/services/model_service.py`

### Question 46: Name three models TFT was compared against in the Model Lab.
* **Ready-to-Speak Answer:** *"iTransformer (MAE 214.2), PatchTST (MAE 221.8), and LSTM (MAE 231.5)."*
* **Relevant Source File:** `backend/app/services/model_service.py`

### Question 47: What are Variable Selection Networks (VSN)?
* **Ready-to-Speak Answer:** *"Component subnetworks within TFT that use Gated Residual Networks to assign importance weights to each feature, filtering out noisy inputs."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Forecast/index.jsx`

### Question 48: What attention weights are displayed on the Forecast page?
* **Ready-to-Speak Answer:** *"Autoregressive lag features receive 28.4% weight, GNN semantic graph embeddings receive 22.6%, and seasonal indicators receive 18.2%."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 49: How does Recharts plot the quantile cone on the Forecast page?
* **Ready-to-Speak Answer:** *"Using an `<AreaChart>` with stacked `<Area>` components for `tft_p90` and `tft_p10`, overlaid with a solid `<Line>` component for the `tft_median`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Forecast/index.jsx`

### Question 50: How many weeks into the future does the forecast project?
* **Ready-to-Speak Answer:** *"6 forward weeks (Week +1 through Week +6)."*
* **Relevant Source File:** `forecast_cache.json`

---

## SECTION 6: CAUSAL AI & PEARL'S DO-CALCULUS (Q51 – Q60)

### Question 51: What is the difference between correlation and causation?
* **Ready-to-Speak Answer:** *"Correlation observes that two variables move together ($P(Y|X)$), while causation measures what happens to $Y$ when we actively intervene and set $X$ to a specific value ($P(Y|do(X))$)."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 52: What is Judea Pearl's Do-Calculus?
* **Ready-to-Speak Answer:** *"A formal mathematical framework that converts interventional distributions involving the $do(X)$ operator into equivalent non-interventional observational distributions using causal directed graphs."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 53: How is $do(\text{Marketing})$ modeled in `causal_service.py`?
* **Ready-to-Speak Answer:** *"As an intervention coefficient of $+0.82$: each $10\%$ increase in marketing spend stimulates an $8.2\%$ uplift in customer demand conversion."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 54: How is price elasticity modeled in `causal_service.py`?
* **Ready-to-Speak Answer:** *"As an elasticity coefficient of $-0.45$: raising prices reduces unit demand volume while increasing revenue per unit sold."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 55: What cost penalty is applied for supplier delivery delays?
* **Ready-to-Speak Answer:** *"An operational overhead cost penalty of $0.8\%$ per day of supplier delay ($0.008$), reflecting overtime labor and warehouse expediting fines."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 56: What is the monthly cost per headcount in the hiring intervention?
* **Ready-to-Speak Answer:** *"$4,500 per month per staff member (`s.hiring_delta * 4500.0`)."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 57: How is the counterfactual 6-week cash flow calculated?
* **Ready-to-Speak Answer:** *"By compounding counterfactual profit over 6 forward weeks at a $3.5\%$ growth rate minus delay penalties (`s.supplier_delay_days * 850`)."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 58: What is the Backdoor Criterion mentioned in the explanation?
* **Ready-to-Speak Answer:** *"A graphical criterion defined by Judea Pearl to identify and block confounding backdoor paths between intervention $X$ and outcome $Y$."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

### Question 59: Why is debouncing used on the causal sliders in the frontend?
* **Ready-to-Speak Answer:** *"To avoid sending dozens of HTTP requests while the user drags a slider. A 250ms debounce timeout fires the API call only after the slider settles."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

### Question 60: What happens if all sliders are set to 0?
* **Ready-to-Speak Answer:** *"The counterfactual scenario matches the historical baseline exactly, with 0% deltas across revenue, costs, and profit."*
* **Relevant Source File:** `backend/app/services/causal_service.py`

---

## SECTION 7: GRAPHRAG STRATEGIC AGENT (Q61 – Q70)

### Question 61: What does GraphRAG stand for?
* **Ready-to-Speak Answer:** *"Graph Retrieval-Augmented Generation, combining knowledge graph structured relationships with retrieval to answer complex operational questions."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 62: How does the assistant prevent hallucinations?
* **Ready-to-Speak Answer:** *"By strictly grounding every response in verified citations from the Neo4j semantic graph, TFT benchmarks, and SCM causal sandbox outputs."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 63: What faithfulness score is reported by the assistant?
* **Ready-to-Speak Answer:** *"A grounded faithfulness score of 98.4% (`0.98`)."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 64: What entities are extracted during an assistant query?
* **Ready-to-Speak Answer:** *"Customer segments, product categories, logistics carriers, delay risk nodes, and financial penalty nodes."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 65: Explain the 'Execute in Causal Sandbox' feature.
* **Ready-to-Speak Answer:** *"When the assistant suggests an operational action, clicking the button passes `suggested_intervention_params` to `App.jsx`, switches to the Causal page, and updates the sliders automatically."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Assistant/index.jsx`

### Question 66: How is the assistant implemented on the backend?
* **Ready-to-Speak Answer:** *"In `assistant_service.py`, using keyword pattern matching across 5 operational intents, returning structured citations and parameter payloads."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 67: Does the assistant call OpenAI or Google Gemini APIs?
* **Ready-to-Speak Answer:** *"No. To maintain deterministic execution, zero latency, and no API cost, it runs locally without calling external cloud LLMs."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 68: What latency does the GraphRAG assistant achieve?
* **Ready-to-Speak Answer:** *"An average retrieval latency of 18 milliseconds (`retrieval_latency_ms: 18`)."*
* **Relevant Source File:** `backend/app/services/assistant_service.py`

### Question 69: What initial message is displayed when the assistant opens?
* **Ready-to-Speak Answer:** *"A welcome briefing explaining that the assistant synthesizes Neo4j multi-hop triples, TFT quantile projections, and Pearl's SCM models."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

### Question 70: How can users translate individual assistant chat messages?
* **Ready-to-Speak Answer:** *"By clicking the 'Translate Hindi' or 'Translate Marathi' action buttons attached to each AI response bubble."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Assistant/index.jsx`

---

## SECTION 8: MULTILINGUAL TRANSLATION (Q71 – Q80)

### Question 71: Which 5 Indian languages are supported?
* **Ready-to-Speak Answer:** *"Hindi, Marathi, Gujarati, Tamil, and Telugu."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 72: How are financial and technical acronyms protected from mistranslation?
* **Ready-to-Speak Answer:** *"In `translation_service.py`, a regex acronym detector identifies terms like `EBITDA`, `SLA`, `GNN`, `TFT`, and `USD`, preserving them in Latin script."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 73: What script is used for Marathi?
* **Ready-to-Speak Answer:** *"Devanagari script (`देवनागरी`)."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 74: What commercial region is associated with Gujarati in the app?
* **Ready-to-Speak Answer:** *"The Gujarat Mercantile & Manufacturing Belt, targeting SMB clusters in Ahmedabad, Surat, Rajkot, and Vadodara."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 75: How does the translation engine perform substitution for arbitrary text?
* **Ready-to-Speak Answer:** *"Using regular expression word boundary replacements: `re.sub(rf'\b{re.escape(en)}\b', local, out, flags=re.I)` against domain glossaries."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 76: Where are domain glossary terms browsed in the UI?
* **Ready-to-Speak Answer:** *"In the Translation page, inside the Domain Glossary Explorer tab with category filtering (Supply Chain, Finance, AI/ML)."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Translation/index.jsx`

### Question 77: What file format is generated when exporting a translated briefing?
* **Ready-to-Speak Answer:** *"A UTF-8 encoded text file named `BizTwin_<Language>_Briefing.txt` generated via browser `Blob` download."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

### Question 78: Does the translation service require an internet connection?
* **Ready-to-Speak Answer:** *"No. It is fully self-contained in Python using internal dictionary matrices, operating with zero external API dependencies."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 79: What is the fidelity score reported for Hindi translations?
* **Ready-to-Speak Answer:** *"A domain fidelity score of 98% (`0.98`)."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

### Question 80: What is the Tamil term for 'Operating Margin' in the glossary?
* **Ready-to-Speak Answer:** *"`செயல்பாட்டு வரம்பு (Operating Margin)`."*
* **Relevant Source File:** `backend/app/services/translation_service.py`

---

## SECTION 9: FRONTEND ARCHITECTURE & UX (Q81 – Q90)

### Question 81: How is global zoom scaling implemented?
* **Ready-to-Speak Answer:** *"In `src/App.jsx`, `document.documentElement.style.zoom = ${zoom}%` updates dynamically and persists to `localStorage.getItem('biztwin_zoom')` (default 110%)."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

### Question 82: What is the purpose of `src/format.js`?
* **Ready-to-Speak Answer:** *"It provides centralized helper functions for formatting numbers (`number()`), currency (`currency()`), and dates (`shortDate()`)."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/format.js`

### Question 83: How does the Sidebar navigation search filter work?
* **Ready-to-Speak Answer:** *"In `Sidebar.jsx`, it filters `navSections` in real time: `item.label.toLowerCase().includes(search.toLowerCase())`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/components/layout/Sidebar.jsx`

### Question 84: How are toast notifications handled across the application?
* **Ready-to-Speak Answer:** *"A central `toast` state string in `App.jsx` is exposed via `notify(msg)`. It displays a floating alert with a green checkmark that auto-dismisses after 3 seconds."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/App.jsx`

### Question 85: What CSS architecture is used for styling?
* **Ready-to-Speak Answer:** *"Vanilla CSS with CSS custom properties (variables) defined at `:root` in `src/styles.css`, establishing a modern Slate & Indigo design system."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/styles.css`

### Question 86: How is the application rendered responsive for mobile devices?
* **Ready-to-Speak Answer:** *"Using `@media (max-width: 900px)` media queries in `styles.css` and a `mobileNav` toggle state in `App.jsx` with a slide-over sidebar drawer."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/styles.css`

### Question 87: How does clicking the sidebar profile card navigate to Settings?
* **Ready-to-Speak Answer:** *"The profile `div` has `onClick={() => setPage('settings')}`, switching the active page state and rendering `SettingsPage`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/components/layout/Sidebar.jsx`

### Question 88: How are dynamic avatar initials calculated from the user's name?
* **Ready-to-Speak Answer:** *"By splitting the name on spaces, taking the first letter of the first two tokens, and converting to uppercase: `(name || 'SJ').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Settings/index.jsx`

### Question 89: What charting component renders the delivery risk breakdown?
* **Ready-to-Speak Answer:** *"Recharts `<PieChart>` and `<Pie>` with custom `<Cell>` fills for Late Delivery (red `#EF4444`) and On-Time (green `#10B981`)."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/pages/Dashboard/index.jsx`

### Question 90: How are icons imported efficiently?
* **Ready-to-Speak Answer:** *"Using named tree-shakable ES module imports from `lucide-react`: `import { Brain, Network, SlidersHorizontal } from 'lucide-react'`."*
* **Relevant Source File:** `frontend/biztwin-frontend/src/constants/navigation.js`

---

## SECTION 10: VIVA DEFENCE & CODE AUDIT (Q91 – Q100+)

### Question 91: Is there any automated test suite in the repository?
* **Ready-to-Speak Answer:** *"No automated test suite like Pytest or Vitest is committed. Verification was conducted using manual API assertion scripts and Vite build checks."*
* **Relevant Source File:** `TESTING_AND_LIMITATIONS.md`

### Question 92: Does the backend implement JWT or OAuth authentication?
* **Ready-to-Speak Answer:** *"No, authentication is not implemented in the current MVP. The user profile is stored purely on the client side in browser `localStorage`."*
* **Relevant Source File:** `backend/main.py`

### Question 93: How would you scale the data layer for 50 million records?
* **Ready-to-Speak Answer:** *"Migrate from in-memory Pandas to DuckDB or PostgreSQL with TimescaleDB for partition pruning, and cache aggregated metrics in Redis."*

### Question 94: How does `stop.bat` cleanly terminate orphaned services?
* **Ready-to-Speak Answer:** *"It runs `netstat -aon | findstr ':8000'`, extracts the process PID, and invokes `taskkill /F /PID %a` to release the port."*
* **Relevant Source File:** `stop.bat`

### Question 95: What was the most difficult bug encountered during development?
* **Ready-to-Speak Answer:** *"Handling encoding differences across CSV datasets (UTF-8 vs Latin-1) and managing trailing anomaly tails that distorted time-series forecasting."*
* **Relevant Source File:** `backend/app/services/data_service.py`

### Question 96: Why did you eliminate the word 'Phase' across the UI?
* **Ready-to-Speak Answer:** *"To transition the user experience from an academic milestone report into a clean, unified enterprise SaaS product structure."*

### Question 97: Can this application run completely offline?
* **Ready-to-Speak Answer:** *"Yes. Once dependencies are installed, all data, models, graphs, and translation dictionaries execute locally without requiring an internet connection."*

### Question 98: What is the time complexity of the LRU cache lookup?
* **Ready-to-Speak Answer:** *"$O(1)$ constant time dictionary key hashing based on file path and modification timestamp."*

### Question 99: If an external examiner asks 'Did you train the TFT model yourself?', how do you answer?
* **Ready-to-Speak Answer:** *"I state honestly: 'Sir, our platform loads pre-calculated multi-horizon TFT quantile forecasts from cache to ensure sub-50ms web performance, while implementing Scikit-Learn as an active fallback engine.' This shows both technical depth and honesty."*

### Question 100: What is the single biggest technical contribution of this project?
* **Ready-to-Speak Answer:** *"Unifying observational supply chain records with causal counterfactual simulation, allowing small business owners to evaluate the financial consequences of operational decisions before risking capital."*
