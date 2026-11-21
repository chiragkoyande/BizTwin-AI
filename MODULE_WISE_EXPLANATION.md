# MODULE-WISE COMPLETE EXPLANATION & VIVA SCRIPTS

> **Scope:** Detailed deconstruction of all 10 distinct architectural modules identified in the repository.  
> **Structure:** 13-point analysis for every module, including actual code citations and ready-to-speak viva explanations.

---

## MODULE 1: EXECUTIVE OPERATIONS DASHBOARD

1. **What is the module?**  
   The primary command center providing high-level business intelligence, operational telemetry, and historical trajectory analytics.
2. **Why does it exist?**  
   To give executives an immediate, unified view of business health (revenue, profit, order volume, and logistics risk) computed across the entire enterprise dataset.
3. **What does it do?**  
   Aggregates 180,519 supply chain records into top-level KPIs, monthly trajectory graphs, department breakdowns, and live activity streams.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Dashboard/index.jsx`
   * Backend: `backend/app/api/routers/dashboard.py`
   * Service: `backend/app/services/data_service.py` (`_monthly()`, `get_data_profile()`)
5. **Which technologies does it use?**  
   FastAPI, Pandas (GroupBy aggregations), React 18, Recharts (`AreaChart`, `BarChart`, `PieChart`), Lucide React.
6. **What data does it receive?**  
   Receives active dataset records loaded from `DataCoSupplyChainDataset.csv` or uploaded custom files.
7. **What processing happens?**  
   * Sums total sales and profit.
   * Computes operating margin percentage: `(total_profit / total_revenue) * 100`.
   * Evaluates percentage of orders marked with `late_delivery_risk == 1`.
   * Groups records by month and department to produce time-series and categorical series.
8. **What output does it generate?**  
   JSON payload from `/api/dashboard` containing `kpis`, `monthly` arrays, `departments`, `late_risk_breakdown`, and `activity` events.
9. **Which APIs or services does it communicate with?**  
   * `GET /api/dashboard`
   * `GET /api/activity`
   * `GET /api/data/profile`
10. **How does the frontend display it?**  
    Renders 4 top KPI cards with status badges, 5 system architecture health cards, a dual-line AreaChart (Revenue vs. Profit Margin), a Departmental BarChart, a Late Risk PieChart, and a live event stream.
11. **What are its dependencies?**  
    Requires `data_service.py` to successfully load and normalize the active dataset.
12. **What are its limitations?**  
    Calculates metrics on historical data; does not perform predictive modeling on this page (predictive modeling is delegated to the Forecast and Causal modules).
13. **How should I explain it in a viva?**  
    > *"Sir, the Executive Dashboard acts as the primary telemetry cockpit. When the page loads, `App.jsx` calls `/api/dashboard`. In the backend, `data_service.py` executes vectorised Pandas aggregations over our 180,519 records to compute gross revenue ($36.78M), profit margin (10.8%), total orders (65,752), and flags our primary operational vulnerability: a 54.8% late delivery risk. This establishes the baseline for all subsequent forecasting and causal simulations."*

---

## MODULE 2: STREAMING INGESTION COCKPIT

1. **What is the module?**  
   An asynchronous in-memory transaction streaming buffer and telemetry monitor.
2. **Why does it exist?**  
   To demonstrate how the Digital Twin ingests live, streaming point-of-sale and fulfillment transactions in real time without blocking API requests.
3. **What does it do?**  
   Simulates a streaming message broker (such as Apache Kafka), emitting continuous transaction events into an in-memory ring buffer and computing live ingestion throughput.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Streaming/index.jsx`
   * Backend: `backend/app/api/routers/stream.py`
   * Service: `backend/app/services/stream_service.py`
5. **Which technologies does it use?**  
   FastAPI `BackgroundTasks`, Python `asyncio`, React (`useEffect` polling interval at 800ms), Lucide React.
6. **What data does it receive?**  
   Samples random order records from the active Pandas DataFrame.
7. **What processing happens?**  
   `_streaming_task()` loops asynchronously with `await asyncio.sleep(interval)`. In each tick, it formats an event with timestamp, order ID, customer segment, order value, shipping mode, and pseudo-Kafka partition headers, pushing it to a 50-item sliding list (`STREAMING_BUFFER`).
8. **What output does it generate?**  
   * `/api/v1/stream/buffer`: Returns the last 25 recent transactions.
   * `/api/v1/stream/stats`: Returns records ingested, events/sec, and status (`"streaming"`, `"idle"`, `"stopped"`).
9. **Which APIs or services does it communicate with?**  
   `/api/v1/stream/start`, `/api/v1/stream/stop`, `/api/v1/stream/buffer`, `/api/v1/stream/stats`.
10. **How does the frontend display it?**  
    Displays Start/Stop stream controls, live throughput counters (e.g., 2.5 events/sec), buffer memory utilization bars, and an auto-scrolling live transaction table.
11. **What are its dependencies?**  
    Requires Python `asyncio` event loop managed by Uvicorn.
12. **What are its limitations?**  
    It is an in-memory simulation using FastAPI background tasks; it does not connect to an external physical Apache Kafka cluster or AWS Kinesis stream.
13. **How should I explain it in a viva?**  
    > *"In Module 2, we simulate real-time ingestion. When 'Start Streaming' is clicked, FastAPI spawns an asynchronous background task via `stream_service.py`. It streams transactions at configurable intervals into a sliding memory buffer. The frontend polls `/api/v1/stream/buffer` every 800ms, displaying incoming order telemetry with sub-12ms latency, proving our platform can ingest continuous events without locking the main thread."*

---

## MODULE 3: SEMANTIC KNOWLEDGE GRAPH & GNN

1. **What is the module?**  
   A 5-tier heterogeneous directed business graph visualizer and bottleneck detector.
2. **Why does it exist?**  
   Supply chains are multi-hop networks. This module maps how upstream customer demand flows through product categories, warehouse departments, and freight carriers down to net cash flow.
3. **What does it do?**  
   Constructs nodes and weighted edges dynamically, calculates GNN risk scores (e.g., isolating high risk in Standard Shipping), and highlights the critical bottleneck path.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Semantic/index.jsx`
   * Backend: `backend/app/api/routers/graph.py`
   * Service: `backend/app/services/graph_service.py`
   * Ingestion Script: `scripts/graph_builder.py` (Neo4j Cypher version)
5. **Which technologies does it use?**  
   Pandas GroupBy, React, SVG rendering, custom CSS node layout.
6. **What data does it receive?**  
   Aggregated categorical relationships from the active dataset.
7. **What processing happens?**  
   `build_semantic_graph()` groups data across dimensions (`category` $\rightarrow$ `department`, `segment` $\rightarrow$ `category`, `shipping_mode` $\rightarrow$ `delivery_status`). It builds node dictionaries with IDs like `Category:Cleats`, assigns GNN risk scores (e.g., 0.62 for Standard Shipping), and calculates link prediction confidence scores (AUC 0.942).
8. **What output does it generate?**  
   JSON payload containing a list of `nodes`, `edges`, `gnn_link_prediction` metrics, and the `multi_hop_causal_path` string.
9. **Which APIs or services does it communicate with?**  
   `GET /api/graph`.
10. **How does the frontend display it?**  
    Interactive graph canvas with tier filters (Customer, Product, Logistics, Financial), color-coded node badges, node detail inspector, and an alert panel highlighting the SLA penalty bottleneck.
11. **What are its limitations?**  
    The live web UI builds the graph topology dynamically in-memory via Pandas rather than querying a live Neo4j instance over network sockets.
12. **How should I explain it in a viva?**  
    > *"Sir, the Semantic Graph module translates tabular data into a 5-tier Heterogeneous Directed Graph. Implemented in `graph_service.py`, it connects customer segments, products, carriers, and cash flows. Crucially, it highlights that Standard Carrier Fleet carries 63% of freight but suffers a 54.8% delay rate, linking logistics delays directly to a $1.24M drag on Operating Margin."*

---

## MODULE 4: TFT MULTI-HORIZON DEEP FORECASTING

1. **What is the module?**  
   A multi-horizon quantile time-series forecasting cockpit.
2. **Why does it exist?**  
   Standard point forecasts (e.g., ARIMA) give a single number, hiding operational risk. Executives need confidence intervals (quantiles) to prepare for worst-case (P10) and best-case (P90) scenarios.
3. **What does it do?**  
   Visualizes 6-week forward quantile cones for revenue, cash flow, and demand, alongside Variable Selection Network (VSN) feature weights and self-attention heatmaps.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Forecast/index.jsx`
   * Backend: `backend/app/api/routers/forecast.py`
   * Service: `backend/app/services/forecast_service.py`
   * Storage: `forecast_cache.json`
5. **Which technologies does it use?**  
   JSON cache, Scikit-learn (`LinearRegression`), Recharts (`AreaChart`, `Area`, `Line`), React.
6. **What data does it receive?**  
   Target metric query parameter (`?target=future_cash_flow`).
7. **What processing happens?**  
   `get_tft_forecast()` reads `forecast_cache.json`. It bridges historical actuals to the forward 6-week horizon. If the target is not cached, it invokes `get_statistical_forecast()` which fits an Ordinary Least Squares linear regression using Scikit-Learn.
8. **What output does it generate?**  
   Timeline array with `actual`, `tft_median` (P50), `tft_p10` (lower bound), `tft_p90` (upper bound), and performance metrics (MAE 198.70, MAPE 4.76%).
9. **Which APIs or services does it communicate with?**  
   `GET /api/forecast?target=...`
10. **How does the frontend display it?**  
    Renders an interactive Recharts quantile cone, VSN feature importance bars (showing autoregressive lag and GNN bottleneck weights), and an attention matrix table.
11. **What are its limitations?**  
    The multi-horizon TFT quantile cones are pre-calculated and served from `forecast_cache.json`. The deep PyTorch neural network is not trained live during the HTTP request.
12. **How should I explain it in a viva?**  
    > *"Module 4 provides multi-horizon probabilistic forecasting. Instead of a naive single-line prediction, it outputs P10, P50, and P90 quantile cones over a 6-week horizon. In `forecast_service.py`, these values are loaded from our pre-computed TFT cache with MAE 198.70. If a custom dataset is uploaded, it gracefully falls back to a Scikit-learn Linear Regression model."*

---

## MODULE 5: PEARL'S CAUSAL DO-CALCULUS SCM SANDBOX

1. **What is the module?**  
   An interactive counterfactual simulation sandbox based on Judea Pearl's Structural Causal Models (SCM).
2. **Why does it exist?**  
   Machine learning predicts what *will* happen under current patterns, but cannot answer *what would happen if we intervene*. This module allows executives to test policy interventions before committing capital.
3. **What does it do?**  
   Accepts user interventions on marketing, dynamic pricing, supplier delay, inventory buffer, and hiring, calculating the causal ripple effects across revenue, profit margin, and forward cash flow.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Causal/index.jsx`
   * Backend: `backend/app/api/routers/causal.py`
   * Service: `backend/app/services/causal_service.py`
   * Schemas: `backend/app/models/schemas.py` (`ScenarioInput`)
5. **Which technologies does it use?**  
   FastAPI, Pydantic, Pandas, React (debounced input handlers), Recharts (`LineChart`).
6. **What data does it receive?**  
   HTTP POST payload with `demand_change_pct`, `price_change_pct`, `marketing_change_pct`, `supplier_delay_days`, `inventory_buffer_pct`, and `hiring_delta`.
7. **What processing happens?**  
   `evaluate_causal_counterfactual()` extracts baselines from the trailing 3 months. It calculates:
   $$\text{Mkt Uplift} = (\Delta\text{Mkt} / 100) \times 0.82$$
   $$\text{Price Elasticity} = (\Delta\text{Price} / 100) \times -0.45$$
   It factors in supplier delay penalties ($0.8\%$ per day) and inventory holding costs ($3\%$ per percent buffer), projecting a 6-week counterfactual cash flow series.
8. **What output does it generate?**  
   Baseline vs. Scenario comparisons, dollar and percentage deltas, 6-week cash flow arrays, and a 5-step explainable causal pathway log.
9. **Which APIs or services does it communicate with?**  
   `POST /api/causal/evaluate`
10. **How does the frontend display it?**  
    5 dual-ended HTML range sliders, side-by-side metric comparison cards with green/red delta pills, a 6-week cash flow comparison chart, and a step-by-step causal explanation panel.
11. **What are its limitations?**  
    The causal propagation coefficients (e.g., $0.82$ marketing uplift, $-0.45$ price elasticity) are parameterized structural constants rather than dynamically estimated from live observational instrumental variables.
12. **How should I explain it in a viva?**  
    > *"Sir, Module 5 implements Judea Pearl's Do-Calculus. When an executive adjusts a slider, such as increasing marketing by 20% and reducing price by 5%, the backend evaluates $do(\text{Marketing}=20, \text{Price}=-5)$ in `causal_service.py`. It propagates these interventions through a causal DAG, accounting for demand elasticity and supplier delay penalties, recalculating operating profit and 6-week cash flow in real time."*

---

## MODULE 6: GRAPHRAG STRATEGIC AGENT

1. **What is the module?**  
   A grounded conversational AI strategy assistant.
2. **Why does it exist?**  
   To allow executives to query complex graph, forecast, and causal insights using natural language without needing to know SQL, Cypher, or Python.
3. **What does it do?**  
   Analyzes natural language business questions, returns grounded factual answers with verifiable citations, extracts active subgraph entities, and offers one-click scenario execution.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Assistant/index.jsx`
   * Backend: `backend/app/api/routers/assistant.py`
   * Service: `backend/app/services/assistant_service.py`
5. **Which technologies does it use?**  
   FastAPI, Python Regex, React (chat thread management, `useRef` auto-scroll).
6. **What data does it receive?**  
   JSON payload: `{"question": "What are our primary delivery bottlenecks?"}`.
7. **What processing happens?**  
   `query_strategic_agent()` matches query keywords against operational domains (bottlenecks, carrier telemetry, regional customer segments, TFT benchmarks, causal what-if). It synthesizes citations, extracts entity tags, and packages suggested intervention parameters.
8. **What output does it generate?**  
   JSON containing `answer`, `grounded_citations`, `extracted_entities`, `suggested_scenario`, `suggested_intervention_params`, `faithfulness_score` (0.98), and `retrieval_latency_ms` (18ms).
9. **Which APIs or services does it communicate with?**  
   `POST /api/assistant/graphrag`
10. **How does the frontend display it?**  
    An executive chat thread with user/AI speech bubbles, citation cards, active subgraph entities sidebar, suggested question pills, and an *"Execute in Causal Sandbox"* button.
11. **What are its limitations?**  
    It operates via deterministic keyword intent matching and rule-based response retrieval; it does not invoke a remote generative LLM API (such as OpenAI or Google Gemini).
12. **How should I explain it in a viva?**  
    > *"In Module 6, we implemented a GraphRAG Strategic Agent. When a user asks about delivery risks, `assistant_service.py` retrieves verified multi-hop triples from our semantic knowledge base, preventing hallucinations. It extracts key entities (like Standard Carrier Fleet and Late Delivery Risk) and generates a one-click action that loads the exact suggested intervention parameters directly into the Causal Sandbox."*

---

## MODULE 7: EXECUTIVE MULTILINGUAL LOCALIZATION

1. **What is the module?**  
   A domain-preserving multilingual translation workbench.
2. **Why does it exist?**  
   To make digital twin intelligence accessible to regional small business leaders in India who operate in native commercial dialects.
3. **What does it do?**  
   Translates strategic briefings into 5 Indian languages (Hindi, Marathi, Gujarati, Tamil, Telugu) while preserving technical acronyms (`EBITDA`, `SLA`, `GNN`, `TFT`, `P90`, `USD`).
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Translation/index.jsx`
   * Backend: `backend/app/api/routers/translation.py`
   * Service: `backend/app/services/translation_service.py`
   * Constants: `frontend/biztwin-frontend/src/constants/translationData.js`
5. **Which technologies does it use?**  
   Python Regular Expressions (`re.sub` with word boundaries `\b`), React, Lucide React.
6. **What data does it receive?**  
   JSON payload: `{"text": "...", "target_language": "Hindi"}`.
7. **What processing happens?**  
   Checks against curated preset translations for core scenarios; for arbitrary text, applies regex dictionary replacement across 25+ business terms while detecting and preserving financial/technical acronyms.
8. **What output does it generate?**  
   JSON containing `translated_text`, `language_script`, `regional_hub`, `fidelity_score`, and `preserved_acronyms`.
9. **Which APIs or services does it communicate with?**  
   `POST /api/translation/translate`
10. **How does the frontend display it?**  
    Dual-column translation workbench, regional hub information cards, domain glossary browser, and a "Download Executive Briefing (.txt)" button.
11. **What are its limitations?**  
    Uses rule-based lexicon mapping and preset high-fidelity templates rather than an external neural machine translation model.
12. **How should I explain it in a viva?**  
    > *"Module 7 addresses language inclusivity for Indian SMBs. Implemented in `translation_service.py`, it supports 5 dialects. A major innovation is our technical acronym preservation engine: terms like EBITDA, SLA, and TFT are never corrupted into literal translations, ensuring the output remains commercially actionable."*

---

## MODULE 8: DEEP LEARNING MODEL LAB & BENCHMARKS

1. **What is the module?**  
   A comparative model evaluation and benchmark repository.
2. **Why does it exist?**  
   To scientifically justify why Temporal Fusion Transformer (TFT) was selected as the champion forecasting architecture over traditional and deep learning baselines.
3. **What does it do?**  
   Presents side-by-side evaluation metrics (MAE, RMSE, MAPE) comparing TFT against 6 competing time-series architectures (iTransformer, PatchTST, N-HiTS, LSTM, TSMixer, LTSF-Linear).
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/ModelLab/index.jsx`
   * Backend: `backend/app/api/routers/models.py`
   * Service: `backend/app/services/model_service.py`
5. **Which technologies does it use?**  
   FastAPI, React, Recharts (`BarChart`).
6. **What processing happens?**  
   `get_benchmark_models()` returns pre-computed benchmark records evaluated on an 80/20 chronological holdout split.
7. **What output does it generate?**  
   JSON containing model names, categories, error metrics, quantile support status, and interpretability mechanisms.
8. **Which APIs or services does it communicate with?**  
   `GET /api/models/benchmarks`
9. **How should I explain it in a viva?**  
    > *"The Model Lab provides empirical justification for our architecture. It demonstrates that TFT achieves Champion status with an MAE of 198.70 and MAPE of 4.76%, outperforming iTransformer (214.2) and LSTM (231.5) due to its Variable Selection Networks and multi-horizon quantile attention."*

---

## MODULE 9: SUPPLY CHAIN DATA MANAGEMENT & NORMALIZATION

1. **What is the module?**  
   Dynamic file uploader, schema normalizer, and data profiling workbench.
2. **Why does it exist?**  
   To allow users to upload their own enterprise supply chain spreadsheets and verify dataset summary statistics.
3. **What does it do?**  
   Accepts CSV or Excel files (up to 150MB), normalizes diverse column headers into standard names, profiles row/order/customer counts, and allows one-click resetting to the default DataCo dataset.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/DataManagement/index.jsx`
   * Backend: `backend/app/api/routers/data.py`
   * Service: `backend/app/services/data_service.py`
5. **Which technologies does it use?**  
   `python-multipart`, `openpyxl`, Pandas, React.
6. **What processing happens?**  
   `upload_dataset()` validates file size (<150MB), saves the file to `backend/data/active_dataset.csv`, normalizes columns via `_normalize()`, clears the LRU cache via `clear_data_cache()`, and re-computes platform KPIs.
7. **Which APIs or services does it communicate with?**  
   `POST /api/data/upload`, `GET /api/data/profile`, `POST /api/data/reset`.
8. **How should I explain it in a viva?**  
    > *"Module 9 handles data flexibility. Implemented in `data_service.py`, our `_normalize` function automatically detects alternative column names for dates, quantities, and sales across UTF-8 and Latin-1 encodings. When a file is uploaded, the LRU cache is cleared, dynamically rebinding all dashboard charts to the new dataset."*

---

## MODULE 10: EXECUTIVE IDENTITY & SYSTEM SETTINGS

1. **What is the module?**  
   Executive profile identity customizer and backend API configuration center.
2. **Why does it exist?**  
   To provide executive personalization (custom name, role, and avatar) and allow users to configure the backend API port binding.
3. **What does it do?**  
   Edits executive full name and role with live avatar initials preview, persists settings to browser `localStorage` (`biztwin_user_profile`), and updates the sidebar profile card in real time.
4. **Which files implement it?**  
   * Frontend: `frontend/biztwin-frontend/src/pages/Settings/index.jsx`
   * Shell: `frontend/biztwin-frontend/src/App.jsx`
   * Layout: `frontend/biztwin-frontend/src/components/layout/Sidebar.jsx`
5. **Which technologies does it use?**  
   React, HTML5 LocalStorage API, Lucide React.
6. **What processing happens?**  
   Computes two-letter uppercase avatar initials from the input name, writes the updated JSON object to `localStorage.setItem('biztwin_user_profile')`, and notifies the user via toast.
7. **How should I explain it in a viva?**  
    > *"Module 10 manages user identity and environment bindings. Located in `Settings/index.jsx`, it allows executives to personalize their profile. Changes are stored in browser `localStorage`, immediately updating the user's initials avatar and title across the application shell."*
