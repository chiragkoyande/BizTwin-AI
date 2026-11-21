# GLOSSARY, REVISION CHEAT SHEET & DEFENCE TRAPS

> **Audience:** Final-Hour Viva Candidates, Quick Reviewers, and Exam Revision.  
> **Contents:** 1-Page Master Cheat Sheet, 50+ Term Glossary, Top 30 Difficult Defense Questions, Common Viva Traps, and Key Files to Memorize.

---

## 1. ONE-PAGE MASTER REVISION CHEAT SHEET

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               DIGITAL TWIN FOR SMALL BUSINESSES — VIVA CHEAT SHEET                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • CORE PURPOSE     : In-memory simulation replica of SMB supply chain operations to    │
│                      test business decisions before risking capital.                   │
│ • PRIMARY DATASET  : DataCo Supply Chain (180,519 rows, 65,752 orders, 2015-2018, USD) │
│ • DETECTED FLAW    : 54.8% late delivery risk in Standard Shipping -> $1.24M SLA drag. │
│ • PROPOSED FIX     : Shift 25% volume to First Class Express -> lifts margin to 16.7%. │
│ • BACKEND STACK    : Python 3.10+, FastAPI 0.115+, Uvicorn 0.30+, Pandas 2.2+, NumPy.  │
│ • FRONTEND STACK   : React 18+, Vite 8+, Recharts 2.15+ (SVG), Lucide React.           │
│ • FORECASTING      : Temporal Fusion Transformer (TFT) with P10, P50, P90 quantiles.   │
│                      Champion benchmark: MAE 198.70, RMSE 309.4, MAPE 4.76%.           │
│ • CAUSAL ENGINE    : Pearl's Do-Calculus Structural Causal Model (SCM) on a DAG.       │
│                      Interventions: do(Marketing=+0.82), do(Price=-0.45 elasticity).   │
│ • LOCALIZATION     : 5 Indic dialects (Hindi, Marathi, Gujarati, Tamil, Telugu).       │
│                      Strict technical acronym preservation (EBITDA, SLA, TFT, USD).    │
│ • TOTAL ROUTES     : 13 active REST API endpoints across 10 modular APIRouters.        │
│ • ONE-CLICK RUN    : run.bat (auto-installs runtimes, .venv, pip, npm, starts browser). │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 50+ TECHNICAL TERMS GLOSSARY

1. **Digital Twin**: A virtual computational representation of a physical system, asset, or business workflow that reflects its real-time or historical state.
2. **Structural Causal Model (SCM)**: A formal mathematical model linking endogenous variables to exogenous background factors via directed structural equations.
3. **Do-Calculus**: Judea Pearl's mathematical axiomatic system for transforming interventional probabilities ($P(Y|do(X))$) into observational probabilities.
4. **Counterfactual**: Answering what would have occurred under a hypothetical alternative past or policy intervention ($P(Y_x | x', y')$).
5. **Backdoor Criterion**: A graphical test to determine if a set of variables blocks all spurious confounding paths between a treatment and an outcome.
6. **Directed Acyclic Graph (DAG)**: A finite graph with directed edges and no closed loops, used to represent causal causal structures.
7. **Temporal Fusion Transformer (TFT)**: An attention-based deep neural network designed for multi-horizon time-series forecasting with interpretable feature gating.
8. **Quantile Loss**: An asymmetric loss metric that penalizes over-estimation and under-estimation differentially, allowing models to predict uncertainty intervals.
9. **P10 Quantile**: The 10th percentile forecast; 90% of actual values are expected to exceed this conservative lower bound.
10. **P50 Quantile**: The median forecast representing expected standard business trajectory.
11. **P90 Quantile**: The 90th percentile forecast representing optimistic upper bound capacity demand.
12. **Variable Selection Network (VSN)**: A component sub-network within TFT that selects relevant input features and suppresses noise.
13. **Mean Absolute Error (MAE)**: The average magnitude of absolute prediction errors: $\frac{1}{n}\sum |y - \hat{y}|$.
14. **Mean Absolute Percentage Error (MAPE)**: Relative percentage error: $\frac{100\%}{n}\sum \left|\frac{y - \hat{y}}{y}\right|$.
15. **Graph Neural Network (GNN)**: A neural network operating directly on graph topologies to generate node embeddings and predict missing links.
16. **GraphRAG**: Graph Retrieval-Augmented Generation, combining multi-hop knowledge graph queries with response generation to eliminate hallucinations.
17. **Index-Free Adjacency**: The property of native graph databases where nodes maintain direct in-memory memory pointers to connected neighbors.
18. **Cypher**: The declarative graph query language used by Neo4j (`MATCH`, `MERGE`, `CREATE`).
19. **Neo4j AuraDB**: Managed cloud-native Neo4j graph database instance.
20. **FastAPI**: Modern, high-performance web framework for building APIs with Python based on standard type hints.
21. **ASGI**: Asynchronous Server Gateway Interface, the modern Python standard for asynchronous web servers.
22. **Uvicorn**: High-speed ASGI server implementation built on `uvloop` and `httptools`.
23. **Pydantic**: Data validation library using Python type hints to parse, coerce, and validate request payloads.
24. **Pandas DataFrame**: 2-dimensional labeled data structure with columns of potentially different types in Python.
25. **LRU Cache**: Least Recently Used cache; keeps the most frequently used DataFrames in RAM for instant access.
26. **Ordinary Least Squares (OLS)**: Linear regression method that minimizes the sum of squared differences between observed and predicted targets.
27. **React 18**: Component-based JavaScript library for building declarative user interfaces using a Virtual DOM.
28. **Vite**: Modern frontend tooling that uses native browser ES modules during development for instant HMR.
29. **Recharts**: Declarative charting library built with React components and SVG rendering.
30. **Single Page Application (SPA)**: A web app that rewrites the DOM in place without making full page roundtrips to the server.
31. **Debouncing**: Delaying the execution of a function until a specified time has elapsed since the last time it was invoked.
32. **CORS**: Cross-Origin Resource Sharing; browser security mechanism controlling access between different domains/ports.
33. **OpenAPI / Swagger**: Standard specification for describing REST APIs, rendered interactively at `/docs`.
34. **Pydantic Field Constraints**: Rules defined using `Field(..., ge=..., le=...)` restricting valid parameter ranges.
35. **Sliding Memory Buffer**: A fixed-capacity queue where new items push out the oldest items once capacity is exceeded.
36. **Multi-Horizon Forecast**: Forecasting continuous trajectory sequences across several future time steps simultaneously.
37. **Elasticity of Demand**: A measure of how sensitive customer purchase quantities are to changes in selling price.
38. **SLA Penalty**: Service Level Agreement financial penalty incurred when an order arrives after the promised transit window.
39. **Acronym Preservation**: Preventing technical terms (like `EBITDA` or `SLA`) from being translated into nonsensical phonetics.
40. **Devanagari**: The alphabetic script used for writing Hindi and Marathi.
41. **Deep Linking**: Initializing UI state directly from URL hash or query parameters (`?page=assistant`).
42. **Controlled Component**: A React form element whose value is controlled entirely by React state.
43. **Holdout Evaluation**: Reserving a segment of historical data strictly for testing model accuracy without training leakage.
44. **Anomaly Tail Filter**: Pruning trailing incomplete collection periods from time-series to avoid biased modeling.
45. **BackgroundTasks**: A FastAPI utility for offloading long-running functions after returning an HTTP response.
46. **Tree Shaking**: Eliminating dead or unused code during JavaScript production bundling.
47. **Net Operating Margin**: Operating profit expressed as a percentage of total gross revenue.
48. **Working Capital**: The operating liquidity available to a business, calculated as current assets minus current liabilities.
49. **Gated Residual Network (GRN)**: TFT building block that applies non-linear transformations while allowing components to be skipped via skip-connections.
50. **Zero-Touch Execution**: A script design pattern where double-clicking a single file sets up all dependencies and runs the software without manual intervention.

---

## 3. TOP 30 DIFFICULT VIVA DEFENCE QUESTIONS

1. **Why does your application load the dataset into RAM instead of running SQL queries on disk?**  
   *Defense:* Because analytical slicing across 180K records in RAM using vectorized Pandas executes in 8ms, whereas disk-based SQLite queries would add I/O latency.
2. **Is the Temporal Fusion Transformer actually trained in Python when I click the button?**  
   *Defense:* No. Training a deep multi-horizon transformer on 180K rows requires hours on a GPU. We pre-computed the TFT quantile cones and serve them from `forecast_cache.json` for sub-50ms web interactions, with Scikit-Learn as an active fallback.
3. **How do you mathematically justify the causal marketing coefficient of +0.82?**  
   *Defense:* It represents empirical demand elasticity derived from the DataCo promotional response distribution, where a 10% marketing increase historically drove an 8.2% uplift in converted orders.
4. **What prevents the sliding buffer in `stream_service.py` from consuming all available server RAM?**  
   *Defense:* The buffer is hard-capped at 50 records in `_streaming_task()`. When the length exceeds 50, `STREAMING_BUFFER.pop(0)` evicts the oldest item.
5. **How does `data_service.py` handle CSV files with non-standard column headers?**  
   *Defense:* Using the `_pick()` helper function, which iterates through candidate column synonyms case-insensitively before falling back to default values.
6. **What happens if someone uploads a 200 MB CSV file?**  
   *Defense:* In `data.py`, `upload_dataset()` checks the incoming stream length against `MAX_UPLOAD_BYTES` (150 MB) and raises HTTP 413 Payload Too Large.
7. **Why did you use React state instead of Redux or Zustand?**  
   *Defense:* For our 10-view application, React's built-in `useState`, `useEffect`, and prop drilling from `App.jsx` provide complete state coverage without the architectural boilerplate and bundle bloat of Redux.
8. **Why are there no automated Pytest files in the repository?**  
   *Defense:* As an analytical research prototype, testing was focused on manual endpoint assertions and Vite compiler checks. Adding a formal Pytest suite is our primary production roadmap item.
9. **How do you defend the GraphRAG assistant if it doesn't use an OpenAI or Gemini API key?**  
   *Defense:* That is an intentional feature. Using deterministic keyword routing across structured knowledge triples guarantees 100% hallucination-free outputs, zero API subscription costs, zero token latency, and complete data privacy.
10. **What is the mathematical purpose of the anomaly tail trimmer in `data_service.py`?**  
    *Defense:* Real-world datasets often have incomplete collection in the final months. Trimming periods that drop below 65% of prior historical averages prevents predictive models from learning false collapse patterns.
11. **Why did you use Recharts instead of D3.js directly?**  
    *Defense:* D3 manipulates the DOM directly, which conflicts with React's Virtual DOM. Recharts wraps D3 math into native declarative React SVG components.
12. **What is the significance of the 0.942 AUC score in the Semantic Graph?**  
    *Defense:* It measures the discriminative power of the GNN link prediction model in identifying true operational delay paths over random edges.
13. **How does `run.bat` install Python without requiring Administrator rights?**  
    *Defense:* It passes the parameter `InstallAllUsers=0`, which installs Python into `%LOCALAPPDATA%\Programs\Python` without triggering Windows UAC elevation prompts.
14. **How does the system ensure cross-platform compatibility between Windows and Linux?**  
    *Defense:* Python paths use `pathlib.Path`, and we provide dual automation scripts: `.bat` for Windows and `.sh` with POSIX syntax for Linux and macOS.
15. **What is the difference between `P10` and `P90` in the Forecast module?**  
    *Defense:* P10 is the lower risk bound for financial capital reservation; P90 is the upper capacity bound for inventory and warehouse buffer sizing.
16. **Why does `causal_service.py` clamp net demand factor with `max(0.1, ...)`?**  
    *Defense:* To prevent negative demand quantities if a user applies extreme simultaneous price hikes and negative demand shocks.
17. **Where is the user's name saved when edited on the Settings page?**  
    *Defense:* In browser `localStorage` under `biztwin_user_profile`, which is read during initial component mount.
18. **Why is `uvicorn[standard]` specified instead of plain `uvicorn`?**  
    *Defense:* The `[standard]` extra installs `uvloop` (a fast C-based event loop) and `httptools` for production-grade request parsing.
19. **How does the application prevent duplicate nodes when executing Cypher queries?**  
    *Defense:* By enforcing unique constraints on entity IDs and using `MERGE` statements in `scripts/graph_builder.py`.
20. **What is the time complexity of building the semantic graph in `graph_service.py`?**  
    *Defense:* $O(N \log N)$ based on the underlying hash-grouping and quicksort routines in Pandas GroupBy.
21. **How is the delivery risk percentage calculated on the Dashboard?**  
    *Defense:* `(d['late_risk'].sum() / len(d)) * 100` evaluated over all 180,519 rows.
22. **What is the difference between `sales` and `order item total` in DataCo?**  
    *Defense:* `sales` represents gross item price multiplied by quantity; `order item total` represents net revenue after item-level discounts are subtracted.
23. **What is the role of `python-multipart` in `backend/requirements.txt`?**  
    *Defense:* It provides the underlying form-data streaming parser required by FastAPI to handle `UploadFile` requests.
24. **How are translation strings formatted when exporting an executive briefing?**  
    *Defense:* As a plain UTF-8 text file with structured ASCII dividers and timestamp headers, generated via browser `URL.createObjectURL(blob)`.
25. **Can the user change the backend URL if running on a remote server?**  
    *Defense:* Yes, the Settings page exposes a backend URL input that updates `localStorage.setItem('biztwin_api_base')`.
26. **What happens if `DataCoSupplyChainDataset.csv` is missing from the folder?**  
    *Defense:* `data_service.py` automatically falls back to `backend/data/sample_sales.csv` to ensure the platform still renders.
27. **Why is `sys.path.insert(0, str(APP_DIR))` necessary in `main.py`?**  
    *Defense:* To ensure that Python can locate the `app` package when running Uvicorn from either the project root or the `backend/` subdirectory.
28. **What is the role of `openpyxl`?**  
    *Defense:* It provides the backend engine allowing Pandas to parse `.xlsx` Microsoft Excel spreadsheets uploaded by business users.
29. **How does `stop.bat` identify which processes to kill?**  
    *Defense:* It queries `netstat -aon` for active listeners on port 8000 and 5173, isolates the process PID, and executes `taskkill /F /PID`.
30. **What is the overarching conclusion of this project?**  
    *Defense:* That causal AI and multi-modal graph architectures can be democratized into intuitive, low-latency tools that empower small business leaders to make risk-informed decisions.

---

## 4. COMMON VIVA TRAPS & HOW TO AVOID THEM

| Examiner Trap | What NOT to Say ❌ | What to Say Instead (Scientifically Accurate) ✅ |
| :--- | :--- | :--- |
| *"Did you train the deep neural network inside this FastAPI server?"* | *"Yes, it trains in real-time when the route is called."* | *"No, sir. Training a deep transformer on 180K records takes hours on a GPU. We pre-computed the TFT quantile cones into a JSON cache for sub-50ms web performance, and implemented Scikit-Learn as an active fallback."* |
| *"Is this connected to a live Neo4j AuraDB instance in the browser?"* | *"Yes, the frontend makes Cypher queries."* | *"The web application builds the semantic graph in-memory using Pandas in `graph_service.py` to remain fully portable without external database dependencies. We implemented Neo4j Cypher batch loading in `scripts/graph_builder.py` as an enterprise ingestion pipeline."* |
| *"Does your assistant use GPT-4 or Gemini?"* | *"Yes, it calls an external OpenAI API."* | *"No, sir. It is a deterministic GraphRAG assistant that uses keyword intent matching against verified knowledge graph triples and SCM outputs, guaranteeing zero hallucinations, zero latency, and zero token costs."* |
| *"How many users can log in simultaneously?"* | *"It supports unlimited authenticated users."* | *"In its current MVP architecture, user authentication is not implemented; it is a single-tenant local decision cockpit where user profile state is stored in client-side LocalStorage."* |

---

## 5. TOP 10 CRITICAL FILES TO MEMORIZE

1. **`backend/main.py`**: The 68-line backend entrypoint registering CORS and 10 APIRouters.
2. **`backend/app/services/data_service.py`**: Ingestion, normalization (`_normalize`), and LRU caching (`_cached_load`).
3. **`backend/app/services/causal_service.py`**: Pearl's Do-Calculus counterfactual mathematical simulation.
4. **`backend/app/services/forecast_service.py`**: TFT quantile loader and Scikit-learn fallback.
5. **`backend/app/services/graph_service.py`**: 5-Tier heterogeneous DAG builder and GNN risk scores.
6. **`backend/app/services/assistant_service.py`**: GraphRAG strategic assistant and grounded citations.
7. **`backend/app/services/translation_service.py`**: 5-dialect regional translation and acronym preservation.
8. **`frontend/biztwin-frontend/src/App.jsx`**: Frontend state orchestrator, URL routing, and slider debouncing.
9. **`scripts/graph_builder.py`**: Standalone Neo4j Cypher batch ingestion script.
10. **`run.bat` & `stop.bat`**: Automated one-click launcher and process management scripts.
