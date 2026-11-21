# EXTERNAL EXAMINER VIVA QUESTION BANK (150+ CATEGORIZED QUESTIONS)

> **Audience:** External University Examiners, Technical Evaluators, Industry Experts, and Defense Committees.  
> **Structure:** 14 Exhaustive Technical Categories covering deep architectural, algorithmic, full-stack, and defense questions with concise speakable answers.

---

## 1. BASIC PROJECT & DOMAIN QUESTIONS (Q1 – Q10)

1. **What is an AI Digital Twin in the context of small businesses?**  
   *Answer:* It is an in-memory computational model that replicates physical business operations (orders, shipping, inventory) and financial flows, allowing managers to test operational decisions virtually before real-world execution.
2. **What dataset drives this application?**  
   *Answer:* The DataCo Supply Chain Dataset containing 180,519 transactions and 65,752 orders between 2015 and 2018 in USD (`DataCoSupplyChainDataset.csv`).
3. **What is the primary business bottleneck uncovered by the platform?**  
   *Answer:* Standard Carrier mode accounts for 63% of freight volume but suffers a 54.8% late delivery rate, generating $1.24M in SLA penalties.
4. **How does this system differ from a traditional business intelligence dashboard (like PowerBI or Tableau)?**  
   *Answer:* Traditional BI dashboards display historical descriptive correlations ($P(Y|X)$). Our platform implements Pearl's Do-Calculus counterfactual simulation ($P(Y|do(X))$) and multi-horizon probabilistic quantile forecasting.
5. **Who is the intended end user?**  
   *Answer:* Small and medium enterprise owners, supply chain managers, financial controllers, and regional logistics operators in India.
6. **Can the platform process new datasets?**  
   *Answer:* Yes. Module 9 accepts CSV or Excel files up to 150 MB, automatically normalizes columns using `_normalize()` in `data_service.py`, and recalculates all dashboards.
7. **Is this application multi-tenant?**  
   *Answer:* In its current MVP implementation, it is single-tenant running locally per business deployment.
8. **What currency does the system use?**  
   *Answer:* It defaults to USD for the DataCo dataset and automatically adapts to INR if a generic Indian SME dataset is detected in `data_service.py`.
9. **How many primary functional modules exist in the UI?**  
   *Answer:* 10 modules: Dashboard, Ingestion Stream, Semantic Graph, TFT Forecast, Causal Sandbox, GraphRAG Assistant, Translation, Model Lab, Data Management, and Settings.
10. **What is the license and repository structure?**  
    *Answer:* A decoupled monolithic repository containing `backend/` (FastAPI), `frontend/biztwin-frontend/` (React/Vite), and `scripts/`.

---

## 2. PROGRAMMING LANGUAGES: PYTHON & JAVASCRIPT (Q11 – Q22)

11. **Why is Python used for the backend instead of Node.js?**  
    *Answer:* Python provides native, highly optimized data manipulation and scientific libraries (Pandas, NumPy, Scikit-learn) required for tabular aggregations across 180K records.
12. **What version of Python is required?**  
    *Answer:* Python 3.10 or higher.
13. **How does Python handle asynchronous execution in this project?**  
    *Answer:* Through Python's standard `asyncio` library integrated into FastAPI and Uvicorn, used specifically in `_streaming_task` in `stream_service.py`.
14. **What is the Global Interpreter Lock (GIL) and does it affect this project?**  
    *Answer:* The GIL allows only one native thread to execute Python bytecode at once. In our project, compute-heavy Pandas and NumPy operations release the GIL during C-level execution, minimizing bottlenecks.
15. **What is the purpose of `__init__.py` in backend folders?**  
    *Answer:* It marks directories as Python packages, enabling structured modular imports like `from app.services.causal_service import evaluate_causal_counterfactual`.
16. **Why is `pathlib.Path` preferred over `os.path`?**  
    *Answer:* `pathlib` provides an object-oriented API that automatically normalizes path separators across Windows (`\`) and Unix (`/`), preventing cross-platform crashes.
17. **What is ES Module (ESM) syntax in JavaScript?**  
    *Answer:* Standardized JavaScript module syntax using `import` and `export` statements, natively supported by Vite for instant development bundling.
18. **What is the difference between `let`, `const`, and `var` in modern JavaScript?**  
    *Answer:* `const` creates block-scoped immutable bindings, `let` creates block-scoped mutable bindings, and `var` creates function-scoped hoisted variables. The frontend strictly uses `const` and `let`.
19. **What is a JavaScript Promise and where is it used?**  
    *Answer:* An object representing the eventual completion or failure of an asynchronous operation. Used in `src/api.js` via `async/await` wrapping browser `fetch()`.
20. **What is JSX in React?**  
    *Answer:* A syntax extension for JavaScript that allows writing HTML-like component markup directly inside JavaScript files, compiled into `React.createElement` by Vite.
21. **How does JavaScript handle floating point arithmetic issues in the UI?**  
    *Answer:* Helper functions in `src/format.js` use `Intl.NumberFormat` and `.toFixed()` to ensure currency and percentages display cleanly without rounding artifacts.
22. **What is the role of `chcp 65001` in `run.bat`?**  
    *Answer:* It changes the Windows command prompt code page to UTF-8, ensuring unicode characters, progress checkmarks, and banners display correctly without distortion.

---

## 3. FRONTEND ARCHITECTURE: REACT 18 & VITE (Q23 – Q35)

23. **What is a Single Page Application (SPA)?**  
    *Answer:* A web application that loads a single HTML page (`index.html`) and dynamically rewrites the DOM as the user interacts with the app, without making full-page requests to the server.
24. **How is view routing implemented in `App.jsx`?**  
    *Answer:* Using state-based view switching (`const [page, setPage] = useState(...)`) paired with a `switch(page)` statement that renders the corresponding page component.
25. **How does the frontend handle browser reload without losing the current page?**  
    *Answer:* In `src/App.jsx`, the initial state initializer checks `window.location.hash` and the `?page=` URL search parameter, maintaining the active route on reload.
26. **What is the React Virtual DOM?**  
    *Answer:* An in-memory lightweight representation of the real DOM. When state changes, React diffs the Virtual DOM and updates only the altered DOM nodes for maximum performance.
27. **What is the purpose of `useEffect` in `src/App.jsx`?**  
    *Answer:* It triggers `loadPlatformData()` when the component mounts and executes debounced causal evaluations whenever slider values change.
28. **Why is debouncing applied to causal slider inputs?**  
    *Answer:* To prevent firing hundreds of rapid HTTP POST requests while a user drags a slider. A 250ms `setTimeout` ensures only the final settled value triggers an API call.
29. **What is `useRef` used for in `Assistant/index.jsx`?**  
    *Answer:* It attaches to a dummy `div` at the bottom of the chat list, calling `.scrollIntoView({ behavior: 'smooth' })` to automatically scroll down when new messages arrive.
30. **How does Recharts render charts?**  
    *Answer:* It generates responsive SVG (Scalable Vector Graphics) elements wrapped inside `<ResponsiveContainer width="100%" height={...}>`.
31. **What is the difference between controlled and uncontrolled components in React?**  
    *Answer:* Controlled components (like our profile inputs in `Settings/index.jsx`) have their value driven by React state (`value={nameInput}` with `onChange`), while uncontrolled components store their own state in the DOM.
32. **What is the role of `localStorage` in the frontend?**  
    *Answer:* It persists user profile identity (`biztwin_user_profile`), custom zoom level (`biztwin_zoom`), and backend API URL (`biztwin_api_base`) across browser restarts.
33. **How does the global zoom feature work?**  
    *Answer:* When the zoom buttons in `Topbar.jsx` are clicked, `App.jsx` updates `document.documentElement.style.zoom = ${zoom}%`, scaling the entire interface seamlessly.
34. **Why is Vite faster than Webpack?**  
    *Answer:* Vite leverages native browser ES modules during development and pre-bundles dependencies using esbuild (written in Go), avoiding full project re-bundling on every save.
35. **What happens during `npm run build`?**  
    *Answer:* Vite invokes Rollup to compile JSX, tree-shake unused code, bundle CSS, and minify JavaScript into the production `dist/` directory in under 1 second.

---

## 4. BACKEND & ASGI ARCHITECTURE: FASTAPI & UVICORN (Q36 – Q48)

36. **What is ASGI and how does Uvicorn implement it?**  
    *Answer:* Asynchronous Server Gateway Interface. Uvicorn acts as the network server that accepts TCP connections and translates HTTP requests into asynchronous ASGI event dictionaries for FastAPI.
37. **How does FastAPI automatically generate API documentation?**  
    *Answer:* By reading route decorators, type annotations, and Pydantic schemas to generate an OpenAPI 3.0 compliant JSON schema, rendered interactively at `/docs` (Swagger UI) and `/redoc`.
38. **What is the purpose of `APIRouter`?**  
    *Answer:* It modularizes endpoint definitions into separate domain files (`app/api/routers/`) before merging them into the central `FastAPI` app instance in `main.py`.
39. **How are HTTP exceptions handled in FastAPI?**  
    *Answer:* Using `raise HTTPException(status_code, detail="...")`, which returns clean JSON error structures to the client.
40. **How does FastAPI parse incoming JSON request bodies?**  
    *Answer:* When a route parameter is typed as a Pydantic `BaseModel` (e.g. `scenario: ScenarioInput`), FastAPI reads the request body stream, parses the JSON, and validates it against the schema.
41. **What is the purpose of `@app.on_event("startup")` in `main.py`?**  
    *Answer:* It defines lifecycle hooks that execute once when the server boots, used here to verify dataset readiness and log service states.
42. **Why is `allow_origins=["*"]` used in `CORSMiddleware`?**  
    *Answer:* To allow local development across different ports (`localhost:5173` talking to `127.0.0.1:8000`) without browser security blocks.
43. **What is the difference between synchronous (`def`) and asynchronous (`async def`) routes in FastAPI?**  
    *Answer:* `async def` routes run directly on the main event loop and must not contain blocking I/O calls. Synchronous `def` routes are automatically dispatched to an external thread pool by FastAPI to prevent event loop blocking.
44. **How are background tasks executed in FastAPI?**  
    *Answer:* By adding a `BackgroundTasks` parameter to the route function and calling `background_tasks.add_task(func, *args)`, which runs `func` after the HTTP response has been transmitted.
45. **What is the role of `python-multipart`?**  
    *Answer:* It parses `multipart/form-data` request payloads, enabling the file upload endpoint `/api/data/upload` to receive files up to 150 MB.
46. **What is the purpose of `backend/app/core/config.py`?**  
    *Answer:* It isolates file system paths, environment settings, and platform constants into a single maintainable source of truth.
47. **How does the backend ensure it works when imported from different directories?**  
    *Answer:* `backend/main.py` executes `sys.path.insert(0, str(APP_DIR))` to ensure `app.*` imports resolve regardless of current working directory.
48. **How does Uvicorn reload code during development?**  
    *Answer:* The `--reload` flag launches a file-watcher process that monitors Python files and triggers an instant worker reload whenever changes are saved.

---

## 5. DATABASE & PERSISTENCE: PANDAS, NEO4J & CYPHER (Q49 – Q60)

49. **Why does the live application use in-memory Pandas instead of a traditional SQL database?**  
    *Answer:* For a 180,000-row read-heavy analytical dashboard, an in-memory Pandas DataFrame with LRU caching provides sub-10ms response times without requiring external database installation or configuration.
50. **What is the purpose of `scripts/graph_builder.py`?**  
    *Answer:* It provides an enterprise ingestion pipeline that loads `DataCoSupplyChainDataset.csv` into a remote Neo4j AuraDB instance using Cypher queries.
51. **What is index-free adjacency in Neo4j?**  
    *Answer:* A property of native graph databases where nodes store direct physical pointers to adjacent relationship records, making graph traversals $O(1)$ per hop regardless of total database size.
52. **Explain the `MERGE` clause in Cypher.**  
    *Answer:* `MERGE` matches existing nodes based on unique keys (like `customer_id`), or creates them if not found, preventing duplicate entities.
53. **What is the purpose of `UNWIND $batch AS row` in Cypher?**  
    *Answer:* It takes a list of dictionary parameters and unrolls them into individual rows inside a single query execution, enabling high-speed batch ingestion.
54. **What unique constraints are created in `graph_builder.py`?**  
    *Answer:* Unique constraints on `Customer.id`, `Order.id`, `Product.id`, and `Department.name`.
55. **How does `data_service.py` optimize memory consumption?**  
    *Answer:* By dropping invalid rows early, casting string categories with `.astype(str).str.strip()`, converting numeric series with `pd.to_numeric(..., errors='coerce')`, and caching the parsed object with `@lru_cache`.
56. **What happens if a user uploads an Excel file?**  
    *Answer:* `data_service.py` detects the `.xlsx` extension and parses it using `pd.read_excel(path)` powered by the `openpyxl` engine.
57. **How does `_monthly()` aggregate data in Pandas?**  
    *Answer:* It creates a `month` column via `d['date'].dt.to_period('M').astype(str)`, groups by `month`, and aggregates sums of `revenue`, `profit`, `quantity`, and unique counts of `order_id`.
58. **Where is dataset metadata stored upon upload?**  
    *Answer:* In `backend/data/active_meta.json`, which records the original filename, row count, and timestamp.
59. **What is LRU Cache?**  
    *Answer:* Least Recently Used Cache. A caching strategy that keeps the most recently accessed objects in RAM and evicts the least recently used entries when `maxsize` is reached.
60. **How is the graph constructed in `graph_service.py` without Neo4j?**  
    *Answer:* It runs Pandas GroupBy aggregations across categorical pairs (`category` + `department`, `segment` + `category`, `shipping_mode` + `delivery_status`) and builds node/edge dictionaries in memory.

---

## 6. API ARCHITECTURE & DATA CONTRACTS (Q61 – Q72)

61. **What is a REST API?**  
    *Answer:* Representational State Transfer. An architectural style that uses standard HTTP methods (`GET`, `POST`) and stateless JSON payloads to manage resources.
62. **What endpoint provides data for the main dashboard?**  
    *Answer:* `GET /api/dashboard`, returning financial KPIs, monthly trajectory arrays, and categorical breakdowns.
63. **What endpoint evaluates causal interventions?**  
    *Answer:* `POST /api/causal/evaluate`, accepting a JSON body matching `ScenarioInput` and returning counterfactual scenario comparisons.
64. **What endpoint handles GraphRAG strategic questions?**  
    *Answer:* `POST /api/assistant/graphrag`, accepting `AssistantQuestion` and returning grounded answers with citations and extracted entities.
65. **What endpoint handles multilingual translations?**  
    *Answer:* `POST /api/translation/translate`, accepting `TranslationRequest` and returning localized text with technical acronym preservation.
66. **What endpoint streams live transactions?**  
    *Answer:* `GET /api/v1/stream/buffer?limit=25`, returning the most recent transactions from the sliding memory buffer.
67. **How does `POST /api/data/upload` work?**  
    *Answer:* It receives a multipart form file stream, verifies the byte size is under 150 MB, saves it to `backend/data/active_dataset.csv`, normalizes columns, and clears the LRU cache.
68. **What HTTP status code is returned when a dataset is missing?**  
    *Answer:* HTTP 400 Bad Request with an explanation string.
69. **How are JSON responses serialized in FastAPI?**  
    *Answer:* FastAPI automatically encodes native Python dictionaries, lists, and Pydantic models into JSON formatted strings with `application/json` content type.
70. **Why are GET requests used for fetching forecasts and POST requests used for causal evaluation?**  
    *Answer:* In accordance with REST conventions: `GET` is used for idempotent read queries (`/api/forecast?target=revenue`), while `POST` is used for sending complex parameter payloads (`/api/causal/evaluate`).
71. **What is an API contract?**  
    *Answer:* A formal agreement between client and server defining exact endpoint paths, expected HTTP methods, required request headers/bodies, and response structures, enforced here by Pydantic.
72. **What endpoint provides comparative benchmark model evaluation?**  
    *Answer:* `GET /api/models/benchmarks`, returning side-by-side performance metrics for 7 deep learning time-series architectures.

---

## 7. AI & MACHINE LEARNING: TIME-SERIES & TFT (Q73 – Q85)

73. **What is the Temporal Fusion Transformer (TFT)?**  
    *Answer:* A state-of-the-art deep learning architecture for multi-horizon time-series forecasting that combines recurrent layers for local processing with self-attention for long-term temporal dependencies.
74. **What is multi-horizon forecasting?**  
    *Answer:* Forecasting a continuous trajectory across multiple future time steps ($t+1, t+2, \dots, t+K$) simultaneously, rather than a single step forward.
75. **What is quantile loss?**  
    *Answer:* An asymmetric loss function used in regression to predict specific quantiles ($\tau \in (0, 1)$): $\mathcal{L}_{\tau}(y, \hat{y}) = \max(\tau(y - \hat{y}), (1-\tau)(\hat{y} - y))$.
76. **Why are quantiles important for supply chain decision-making?**  
    *Answer:* They provide actionable risk bounds: P10 represents worst-case conservative demand for cash flow defense, while P90 represents peak demand for warehouse capacity planning.
77. **What is Mean Absolute Percentage Error (MAPE)?**  
    *Answer:* A normalized error metric expressing forecasting error as a percentage: $\text{MAPE} = \frac{100\%}{n} \sum \left|\frac{y - \hat{y}}{y}\right|$. TFT achieved 4.76% in our benchmarks.
78. **What is Mean Absolute Error (MAE)?**  
    *Answer:* The average magnitude of absolute errors between predictions and actuals: $\text{MAE} = \frac{1}{n} \sum |y - \hat{y}|$. TFT achieved 198.70.
79. **How does TFT achieve interpretability?**  
    *Answer:* Through Variable Selection Networks (VSN) that output feature importance weights and temporal self-attention layers that visualize which historical time steps most influenced predictions.
80. **What is an inverted transformer (iTransformer)?**  
    *Answer:* An architecture that applies self-attention across variate channels rather than time tokens, achieving an MAE of 214.2 in our benchmarks.
81. **What is PatchTST?**  
    *Answer:* A time-series transformer that segments series into sub-series patches before applying attention, achieving an MAE of 221.8 in our benchmarks.
82. **Why does TFT outperform standard LSTM?**  
    *Answer:* Standard LSTMs (MAE 231.5) suffer from vanishing gradients over long horizons and cannot dynamically weigh feature importance or output non-parametric quantiles.
83. **How is the Scikit-learn Linear Regression fallback implemented in `forecast_service.py`?**  
    *Answer:* It fits an Ordinary Least Squares trendline on monthly historical sequences: `lin = LinearRegression().fit(X, y)` and predicts future intervals clamped at zero with `np.maximum(0, ...)`.
84. **What is chronological holdout splitting?**  
    *Answer:* An evaluation protocol where the oldest 80% of data is used for training and the newest 20% is held out for testing, preventing temporal data leakage.
85. **Why are TFT forecasts loaded from a JSON cache in this web application?**  
    *Answer:* To ensure instant sub-50ms user interactions in the web browser; training deep neural networks on 180K rows requires hours on dedicated GPU infrastructure.

---

## 8. CAUSAL AI & PEARL'S DO-CALCULUS (Q86 – Q98)

86. **What is Judea Pearl's Causal Hierarchy (The Ladder of Causation)?**  
    *Answer:* Tier 1: Association (Seeing / Correlation: $P(Y|X)$), Tier 2: Intervention (Doing / Policy: $P(Y|do(X))$), and Tier 3: Counterfactuals (Imagining / Retrospection: $P(Y_x|x', y')$).
87. **What is the $do(\cdot)$ operator?**  
    *Answer:* A mathematical operator that simulates a physical intervention by replacing the natural structural equation of variable $X$ with a constant $x$, severing all incoming causal arrows to $X$ in the DAG.
88. **What is a Structural Causal Model (SCM)?**  
    *Answer:* A formal system consisting of exogenous background variables ($U$), endogenous variables ($V$), and a set of structural functions ($F$) where each variable is determined by its parents: $V_i = f_i(\text{PA}_i, U_i)$.
89. **What is a Directed Acyclic Graph (DAG)?**  
    *Answer:* A graph with directed edges and no closed loops, representing causal dependencies where an arrow from $A \rightarrow B$ signifies that $A$ causes $B$.
90. **What is confounding bias?**  
    *Answer:* A distortion that arises when a common cause influences both the treatment and the outcome, creating a false statistical correlation.
91. **What is the Backdoor Criterion?**  
    *Answer:* A graphical condition that identifies a set of variables $Z$ that blocks all spurious backdoor paths between treatment $X$ and outcome $Y$ without including any descendants of $X$.
92. **How does `causal_service.py` model Marketing intervention?**  
    *Answer:* As an uplift factor: `mkt_effect = (s.marketing_change_pct / 100.0) * 0.82`, boosting customer conversion and gross demand.
93. **How does `causal_service.py` model Price intervention?**  
    *Answer:* As price elasticity of demand: `price_effect = (s.price_change_pct / 100.0) * -0.45`, shifting demand inversely with price while increasing unit margins.
94. **How does supplier delay affect costs in `causal_service.py`?**  
    *Answer:* It increases operating overhead by 0.8% per delay day (`supplier_penalty = max(0.0, s.supplier_delay_days) * 0.008`) and penalizes weekly cash flows.
95. **What is counterfactual profit?**  
    *Answer:* Counterfactual revenue minus counterfactual cost (factoring in demand factors, supplier penalties, inventory holding, and staffing costs).
96. **Can the causal simulator handle hiring decisions?**  
    *Answer:* Yes. `s.hiring_delta` adds or subtracts personnel at $4,500/month per head, adjusting operational throughput and operating costs.
97. **What is the explainable causal pathway returned by the API?**  
    *Answer:* A step-by-step text log detailing how the intervention traversed the DAG, from root nodes to demand elasticity down to final operating margin and confidence.
98. **Why is Causal AI superior to standard machine learning for decision makers?**  
    *Answer:* Machine learning fails under policy changes because the correlation patterns in the training data break. Causal AI models the underlying mechanisms, remaining robust under interventions.

---

## 9. GENERATIVE AI & GRAPHRAG (Q99 – Q110)

99. **What is Retrieval-Augmented Generation (RAG)?**  
    *Answer:* An AI pattern that retrieves relevant external facts before generating a response, ensuring outputs are grounded in verified domain data.
100. **How does GraphRAG improve on traditional vector-based RAG?**  
    *Answer:* Vector RAG matches text similarity on flat document chunks. GraphRAG traverses multi-hop entity relationships (e.g., Customer $\rightarrow$ Carrier $\rightarrow$ Penalty), answering complex connected queries.
101. **How is the GraphRAG assistant implemented in `assistant_service.py`?**  
    *Answer:* Using keyword intent routing across operational clusters, retrieving grounded facts, citations, and parameter payloads from the knowledge base.
102. **What are grounded citations?**  
    *Answer:* Explicit source attribution tags returned with each answer (e.g., `[GNN Heterogeneous Link Prediction: AUC 0.942]`) proving the fact originated from the data.
103. **What is hallucination in AI and how is it eliminated here?**  
    *Answer:* Hallucination is when an AI fabricates plausible-sounding but false information. By using deterministic retrieval grounded in structured data triples, hallucinations are eliminated.
104. **What entities are extracted when a user asks about delivery risks?**  
    *Answer:* `CustomerSegment:Consumer`, `Category:Cleats`, `Logistics:Standard Carrier Fleet`, `FulfillmentStatus:Late Delivery Risk`, and `FinancialOutcome:SLA Delay Penalties`.
105. **What is the role of `suggested_intervention_params` in the assistant response?**  
    *Answer:* It pre-packages actionable numerical slider values (e.g., `{"supplier_delay": -3, "marketing_change": 15}`) that can be sent directly to the Causal Sandbox.
106. **How does the frontend handle clicking 'Execute in Causal Sandbox'?**  
    *Answer:* It invokes `executeInterventionInSandbox(params)`, updates the slider states in `App.jsx`, and switches the active view to `'causal'`.
107. **What is the faithfulness score reported by the assistant?**  
    *Answer:* 98.4% grounded faithfulness, reflecting verifiable alignment with underlying data triples.
108. **Why does the assistant not call an external LLM API?**  
    *Answer:* To eliminate external cloud costs, third-party token limits, network latency, and data privacy concerns for sensitive enterprise supply chain figures.
109. **What is the average response latency of the assistant?**  
    *Answer:* 18 milliseconds (`retrieval_latency_ms: 18`), enabling instantaneous conversational interactivity.
110. **How does the assistant support regional multilingual localization?**  
    *Answer:* Each message bubble includes action buttons allowing users to translate the specific insight into Hindi or Marathi on demand.

---

## 10. MULTILINGUAL LOCALIZATION & NLP (Q111 – Q120)

111. **Why is multilingual localization critical for Indian SMBs?**  
    *Answer:* Most Indian enterprise software is in English, but millions of MSME operators conduct daily business in regional commercial languages like Hindi, Gujarati, Marathi, Tamil, or Telugu.
112. **How does `translation_service.py` translate text?**  
    *Answer:* Through a hybrid engine combining curated high-fidelity templates for core operational scenarios with regex word-boundary dictionary substitutions for arbitrary text.
113. **What is technical acronym preservation?**  
    *Answer:* Ensuring domain acronyms (`EBITDA`, `SLA`, `GNN`, `TFT`, `P10`, `P90`, `USD`) are kept in standard Latin script rather than transliterated into confusing phonetics.
114. **What regex pattern identifies technical acronyms?**  
    *Answer:* `[acr for acr in acronym_list if re.search(rf"\b{re.escape(acr)}\b", text, flags=re.I)]`.
115. **What dialect information is returned for Gujarati?**  
    *Answer:* Script: `Gujarati (ગુજરાતી)`, Region: Gujarat Mercantile & Manufacturing Belt, Target Hubs: Ahmedabad, Surat, Rajkot, Vadodara SMBs.
116. **What is the fidelity score for Marathi localization?**  
    *Answer:* 97% domain fidelity (`0.97`).
117. **How does the domain glossary tab work in the Translation page?**  
    *Answer:* It lets users browse term pairs across 3 categories (Supply Chain, Finance, AI/ML) and copy localized definitions to their clipboard.
118. **How is the translated briefing exported?**  
    *Answer:* Via `downloadTranslatedBriefing()` in `App.jsx`, which creates a text `Blob` and downloads `BizTwin_<Language>_Briefing.txt`.
119. **What happens if a word is not in the translation dictionary?**  
    *Answer:* The engine safely keeps the original English word in place, ensuring the sentence remains readable and grammatical.
120. **Can this localization module be extended to other languages?**  
    *Answer:* Yes. Adding a new language simply requires defining its metadata and dictionary map in `translation_service.py` and `translationData.js`.

---

## 11. SECURITY, VALIDATION & DATA INTEGRITY (Q121 – Q130)

121. **How is input validation enforced on the backend?**  
    *Answer:* Using Pydantic `BaseModel` classes with explicit type annotations and `Field(..., ge=..., le=...)` boundary constraints.
122. **What prevents malicious file uploads from crashing the server?**  
    *Answer:* File uploads are restricted to `.csv` and `.xlsx` extensions, limited to 150 MB, and parsed using streaming buffers with explicit exception handling.
123. **How does the system prevent Cross-Site Scripting (XSS)?**  
    *Answer:* React automatically escapes string variables rendered in JSX before inserting them into the DOM, preventing injection of malicious `<script>` tags.
124. **Where are environment secrets stored?**  
    *Answer:* In `backend/.env`, which is ignored by `.gitignore` so database passwords and API keys are never committed to public repositories.
125. **Is user authentication implemented in the current code?**  
    *Answer:* No. The application currently operates as an open local intelligence cockpit without user logins or password hashing.
126. **What prevents SQL injection in this application?**  
    *Answer:* The web application does not run raw SQL query strings; all tabular transformations are executed via compiled Pandas DataFrame operations.
127. **What prevents Cypher injection in `scripts/graph_builder.py`?**  
    *Answer:* Using parameterized Cypher queries: `session.run(query, batch=df_records)` passes parameters separately from the query syntax.
128. **How does the application prevent out-of-memory crashes on large datasets?**  
    *Answer:* By reading CSV files with `low_memory=False`, filtering invalid rows early, and capping the streaming sliding buffer to 50 items.
129. **What is the maximum file upload size?**  
    *Answer:* 150 Megabytes, defined as `MAX_UPLOAD_BYTES = 150 * 1024 * 1024` in `backend/app/core/config.py`.
130. **How are corrupted CSV dates handled during ingestion?**  
    *Answer:* `pd.to_datetime(date_s, errors="coerce")` converts unparseable date strings to `NaT` (Not a Time), which are subsequently pruned via `dropna()`.

---

## 12. AUTOMATION & DEPLOYMENT: RUN.BAT & RUN.SH (Q131 – Q140)

131. **What is the primary feature of `run.bat`?**  
    *Answer:* Zero-touch automated launching: it verifies/installs Python and Node.js silently, sets up `.venv`, installs packages, frees ports, starts both servers, and opens the browser.
132. **How does `run.bat` install Python if missing?**  
    *Answer:* It executes a PowerShell command to download `python-3.12.3-amd64.exe` from `python.org` and runs it with `/quiet InstallAllUsers=0 PrependPath=1`.
133. **How does `run.bat` install Node.js if missing?**  
    *Answer:* It downloads `node-v20.13.1-x64.msi` via PowerShell and invokes `msiexec /i ... /qn /norestart`.
134. **How does `run.bat` update PATH in the active session without restarting?**  
    *Answer:* By appending `%LOCALAPPDATA%\Programs\Python\Python312` and `C:\Program Files\nodejs` directly to `%PATH%` in the batch script.
135. **What does `stop.bat` do?**  
    *Answer:* It terminates processes by window title (`Digital Twin - Backend API*`) and kills PIDs holding ports 8000, 5173, and 5174 using `netstat` and `taskkill`.
136. **How does `run.sh` handle process cleanup on Linux?**  
    *Answer:* It uses a bash `trap cleanup SIGINT SIGTERM EXIT` hook that kills child backend/frontend PIDs and executes `./stop.sh` upon exit.
137. **Why are the backend and frontend launched in separate windows on Windows?**  
    *Answer:* To allow developers to inspect backend FastAPI logs and frontend Vite HMR compilation messages independently without log interleaving.
138. **What port does the frontend run on?**  
    *Answer:* Port 5173 by default (or 5174 if 5173 is busy).
139. **What port does the backend API run on?**  
    *Answer:* Port 8000 on `127.0.0.1` (localhost).
140. **How long does `run.bat` wait before launching the browser?**  
    *Answer:* 4 seconds (`timeout /t 4 /nobreak >nul`), ensuring both Uvicorn and Vite have completed initialization.

---

## 13. TESTING & CODE QUALITY DEFENCE (Q141 – Q145)

141. **What testing suites are currently committed to the repository?**  
    *Answer:* There are no automated unit testing suites (`pytest` or `vitest`) committed in the repository. Verification relies on manual API test scripts and Vite build checks.
142. **How do you verify backend endpoints are functioning correctly?**  
    *Answer:* By running automated Python verification scripts using `urllib.request` that assert HTTP 200 status codes and valid JSON schemas across all 13 routes.
143. **How do you verify the frontend has no syntax or import errors?**  
    *Answer:* By running `npm run build`, which triggers the Rollup production compiler to validate all imports, JSX syntax, and CSS rules.
144. **What diagnostic query is built into `scripts/graph_builder.py`?**  
    *Answer:* `run_graph_diagnostics()`, which queries Neo4j for node counts across Customers, Orders, Products, and Departments and verifies relationship totals.
145. **What is the code quality status of `backend/main.py`?**  
    *Answer:* It was refactored from a 1,500-line monolithic script down to a clean, modular 68-line coordinator that delegates to domain routers.

---

## 14. ADVANCED TECHNICAL & SCALING DEFENCE (Q146 – Q155)

146. **How would you scale this application to support 50 million transactions?**  
    *Answer:* Replace in-memory Pandas with an embedded columnar analytical engine like DuckDB or a distributed database like ClickHouse/TimescaleDB, caching pre-aggregated monthly metrics in Redis.
147. **How would you deploy this application in a cloud environment?**  
    *Answer:* Containerize using Docker: deploy the FastAPI backend on AWS ECS or Google Cloud Run, host the React static build on AWS S3/CloudFront, and run Neo4j on Neo4j AuraDB.
148. **How would you replace the rule-based assistant with a live LLM?**  
    *Answer:* Connect `assistant_service.py` to an open-weights LLM (such as Llama-3-8B via vLLM) using LangChain or LlamaIndex to dynamically convert user questions into Cypher queries against Neo4j.
149. **How would you train the Temporal Fusion Transformer on fresh data?**  
    *Answer:* Using `pytorch-forecasting`, defining a `TimeSeriesDataSet` with categorical embeddings, continuous reals, and quantile loss, training on an NVIDIA GPU cluster.
150. **What is index-free adjacency and why does it matter for supply chain graphs?**  
    *Answer:* It means every node directly references its connected neighbors in memory. Traversing a 5-hop supply chain path takes constant time ($O(k)$) regardless of whether the graph contains 100 or 100 million nodes.
151. **What happens if two users upload datasets at the same time?**  
    *Answer:* In the current single-instance MVP, the second upload would overwrite `backend/data/active_dataset.csv`. In production, uploads would be assigned unique UUIDs and user-scoped database schemas.
152. **How does the system ensure numerical reproducibility in causal simulation?**  
    *Answer:* All causal equations in `causal_service.py` are deterministic linear elasticity models computed on floating point numbers, producing identical outputs for identical inputs.
153. **What is the difference between Ordinary Least Squares (OLS) and Quantile Regression?**  
    *Answer:* OLS models the conditional mean $\mathbb{E}[Y|X]$ by minimizing squared errors, while Quantile Regression models specific percentiles $Q_{\tau}(Y|X)$ by minimizing asymmetric absolute loss.
154. **Why is the data anomaly tail filter important for machine learning?**  
    *Answer:* If the last few months of an extracted dataset represent incomplete historical collection, training an ML model on that drop-off would cause the model to falsely predict an imminent business collapse.
155. **If you had 3 months to continue this project, what single feature would you build next?**  
    *Answer:* Implement live Cypher query generation using an open-weights LLM connected to a live Neo4j AuraDB cluster, transforming the assistant into a fully autonomous GraphRAG query agent.
