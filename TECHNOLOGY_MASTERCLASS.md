# COMPLETE TECHNOLOGY MASTERCLASS & VIVA PREPARATION

> **Scope:** Exhaustive technical deep-dive into every language, framework, library, and tool discovered in the actual source code repository.  
> **Methodology:** 14-point pedagogical breakdown for each technology to enable total mastery during viva examinations.

---

## TABLE OF CONTENTS

1. [Python 3.10+](#1-python-310)
2. [FastAPI](#2-fastapi)
3. [Uvicorn (ASGI Server)](#3-uvicorn-asgi-server)
4. [Pydantic](#4-pydantic)
5. [Pandas](#5-pandas)
6. [NumPy](#6-numpy)
7. [Scikit-learn](#7-scikit-learn)
8. [Neo4j & Cypher Query Language](#8-neo4j--cypher-query-language)
9. [OpenPyXL & Python-Multipart](#9-openpyxl--python-multipart)
10. [React 18+](#10-react-18)
11. [Vite Build Tool](#11-vite-build-tool)
12. [Recharts Data Visualization Library](#12-recharts-data-visualization-library)
13. [Lucide React](#13-lucide-react)
14. [Windows Batch & Bash Automation](#14-windows-batch--bash-automation)

---

## 1. PYTHON 3.10+

### 1. What is it?
Python is a high-level, interpreted, dynamically typed, multi-paradigm programming language celebrated for its readable syntax, extensive standard library, and dominance in data engineering and machine learning.

### 2. What does it do?
It powers the entire backend server, data transformation pipelines, mathematical causal modeling, streaming background tasks, and API request handling.

### 3. Why is it used in this project?
Python was chosen because it seamlessly bridges high-performance data processing libraries (Pandas, NumPy, Scikit-learn) with modern asynchronous web frameworks (FastAPI), allowing complex supply chain calculations to be written in concise, maintainable code.

### 4. How does it work?
Python source code (`.py`) is compiled into intermediate bytecode (`.pyc`) stored in `__pycache__`, which is then executed by the Python Virtual Machine (CPython). In this project, Python runs asynchronously via `asyncio` inside the Uvicorn ASGI server.

### 5. Where is it used in the repository?
Every backend logic file under `backend/`, the ingestion scripts in `scripts/`, and root utilities.

### 6. Which files use it?
* `backend/main.py`
* `backend/app/core/config.py`
* `backend/app/models/schemas.py`
* All 8 services in `backend/app/services/`
* All 10 routers in `backend/app/api/routers/`
* `scripts/dataco_ingestion.py` and `scripts/graph_builder.py`

### 7. How does it communicate with other technologies?
Python communicates with the frontend by serializing native dictionaries into JSON strings returned over HTTP via FastAPI. It communicates with files using `pathlib.Path` and with external databases using the `neo4j` driver.

### 8. Beginner-Friendly Example
```python
# Simple Python dictionary serialized to JSON
def calculate_margin(revenue: float, cost: float) -> dict:
    profit = revenue - cost
    margin_pct = (profit / revenue) * 100 if revenue > 0 else 0.0
    return {"profit": round(profit, 2), "margin_pct": round(margin_pct, 1)}
```

### 9. Project-Specific Use Case
In `backend/app/services/causal_service.py`, Python computes counterfactual demand elasticity:
```python
mkt_effect = (s.marketing_change_pct / 100.0) * 0.82
price_effect = (s.price_change_pct / 100.0) * -0.45
net_demand_factor = max(0.1, 1.0 + (s.demand_change_pct / 100.0) + mkt_effect + price_effect)
```

### 10. Advantages & Limitations
* **Advantages:** Fast prototyping, massive data science ecosystem, cross-platform compatibility (`pathlib`).
* **Limitations:** Global Interpreter Lock (GIL) limits multi-core CPU threading for pure Python code; interpreted execution is slower than C++/Rust.

### 11. Alternatives
Node.js/TypeScript (Fast for I/O, but weaker data science ecosystem), Go (Super fast concurrency, lacks Pandas/NumPy ecosystem).

### 12. Important Technical Terms
`CPython`, `asyncio`, `Type Hints`, `LRU Cache`, `List Comprehension`, `GIL`, `Virtual Environment (.venv)`.

### 13. Common Errors
* `ModuleNotFoundError`: Virtual environment not activated or package missing.
* `TypeError: unsupported operand type(s)`: Attempting math operations on un-coerced strings.

### 14. Viva Questions
* **Q:** *Why did you use Python instead of Node.js for the backend?*  
  **A:** Because our Digital Twin core involves data slicing, quantile processing, and array manipulation on 180,000 supply chain records, where Python's Pandas and NumPy outperform JavaScript engines.
* **Q:** *What is the role of `sys.path.insert(0, str(APP_DIR))` in `backend/main.py`?*  
  **A:** It ensures the `backend/` directory is prepended to Python's module search path so absolute imports like `from app.core.config import settings` work regardless of the current working directory.

---

## 2. FASTAPI

### 2. What is it?
FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints, Starlette, and Pydantic.

### 2. What does it do?
It defines HTTP endpoints (`GET`, `POST`), validates incoming request bodies, manages background tasks, provides CORS middleware, and auto-generates interactive Swagger UI documentation at `/docs`.

### 3. Why is it used in this project?
Traditional frameworks like Flask require manual serialization and third-party validation libraries. FastAPI provides native asynchronous (`async def`) support, sub-millisecond route dispatch, and automatic OpenAPI schema generation out of the box.

### 4. How does it work?
FastAPI uses Python type annotations. When a route receives a request, FastAPI passes the payload to Pydantic for validation. If valid, the controller function runs; if invalid, FastAPI returns a detailed HTTP 422 Unprocessable Entity error automatically.

### 5. Where is it used in the repository?
Centralized in `backend/main.py` and distributed across all modules in `backend/app/api/routers/`.

### 6. Which files use it?
* `backend/main.py` (Creates `FastAPI()` app instance, binds middleware, includes routers)
* `backend/app/api/routers/*.py` (Instantiates `APIRouter()` instances for clean modular separation)
* `scripts/dataco_ingestion.py`

### 7. How does it communicate with other technologies?
It accepts JSON payloads sent by Axios/Fetch from the React frontend, passes data to backend Python services, and serializes Python dictionary returns into standard JSON responses over HTTP.

### 8. Beginner-Friendly Example
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/api/greet")
def greet(name: str = "User"):
    return {"message": f"Hello, {name}!"}
```

### 9. Project-Specific Use Case
In `backend/app/api/routers/causal.py`:
```python
from fastapi import APIRouter
from app.models.schemas import ScenarioInput
from app.services.causal_service import evaluate_causal_counterfactual

router = APIRouter(tags=["Causal AI Sandbox"])

@router.post("/api/causal/evaluate")
def evaluate_scenario(scenario: ScenarioInput):
    return evaluate_causal_counterfactual(scenario)
```

### 10. Advantages & Limitations
* **Advantages:** Extremely fast (benchmarks comparable to NodeJS/Go), automatic Swagger UI (`/docs`), automated Pydantic schema validation.
* **Limitations:** Async programming requires strict avoidance of blocking I/O calls inside `async def` routes.

### 11. Alternatives
Flask (Synchronous, lacks native type validation), Django REST Framework (Heavyweight, includes ORM overhead).

### 12. Important Technical Terms
`APIRouter`, `ASGI`, `Pydantic validation`, `Dependency Injection`, `CORS Middleware`, `OpenAPI / Swagger`.

### 13. Common Errors
* `422 Unprocessable Entity`: The JSON request payload missed a required field or supplied the wrong data type.
* `CORS error`: Frontend blocked because `CORSMiddleware` was missing or origins were misconfigured.

### 14. Viva Questions
* **Q:** *How does FastAPI handle CORS, and why is it needed in this project?*  
  **A:** Since the React frontend runs on port 5173 and the FastAPI backend runs on port 8000, browser cross-origin security blocks requests unless the backend sends `Access-Control-Allow-Origin: *` headers, which `CORSMiddleware` in `backend/main.py` handles.
* **Q:** *What is the difference between `FastAPI` and `APIRouter`?*  
  **A:** `FastAPI` is the top-level application container that binds the web server. `APIRouter` is a mini-application that groups related endpoints into modular files before being included into `app.include_router()`.

---

## 3. UVICORN (ASGI SERVER)

### 1. What is it?
Uvicorn is a lightning-fast ASGI (Asynchronous Server Gateway Interface) web server implementation for Python, built on `uvloop` and `httptools`.

### 2. What does it do?
It acts as the production and development HTTP server that listens on a network socket (e.g., `127.0.0.1:8000`), receives incoming TCP requests, translates HTTP bytes into ASGI event dictionaries, feeds them into FastAPI, and sends the HTTP response back to the client.

### 3. Why is it used in this project?
Python web applications cannot listen to HTTP sockets on their own; they need a gateway interface. Uvicorn is the official standard ASGI server recommended for FastAPI.

### 4. How does it work?
Uvicorn creates an asynchronous event loop. When a client sends a request, Uvicorn accepts the connection non-blockingly, processes the request pipeline, and handles thousands of concurrent requests using Python's `asyncio`.

### 5. Where is it used in the repository?
Referenced in `backend/requirements.txt`, executed in `run.bat` and `run.sh`, and used to run the backend via terminal command:
`uvicorn main:app --host 127.0.0.1 --port 8000 --reload`

### 6. Which files use it?
* `backend/requirements.txt`
* `run.bat`, `run.sh`
* `CLIENT_QUICKSTART.md`, `README.md`

### 7. How does it communicate with other technologies?
Uvicorn binds directly to the operating system's network socket and invokes the FastAPI callable `main:app`.

### 8. Beginner-Friendly Example
```bash
# Start server with live hot-reloading on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 9. Project-Specific Use Case
In `run.bat`, Uvicorn is launched in a dedicated background command shell:
```bat
start "Digital Twin - Backend API" cmd /k "cd /d ""%BACKEND_DIR%"" && call ""%VENV_DIR%\Scripts\activate.bat"" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
```

### 10. Advantages & Limitations
* **Advantages:** Extremely low memory footprint, high throughput, hot-reload (`--reload`) watches file changes during development.
* **Limitations:** In heavy production environments, Uvicorn is usually run under Gunicorn as a process manager to manage multiple worker threads.

### 11. Alternatives
Hypercorn, Daphne, Gunicorn with Uvicorn workers.

### 12. Important Technical Terms
`ASGI`, `Event Loop`, `uvloop`, `Hot-Reloading`, `TCP Socket Binding`.

### 13. Common Errors
* `ERROR: [Errno 98] Address already in use`: Another process is already holding port 8000 (solved in this project by `stop.bat` / `stop.sh`).

### 14. Viva Questions
* **Q:** *What does ASGI stand for and how does it differ from WSGI?*  
  **A:** ASGI stands for Asynchronous Server Gateway Interface. Unlike WSGI (Web Server Gateway Interface) which is synchronous and blocks worker threads during I/O, ASGI supports asynchronous execution, WebSockets, and long-polling background tasks.

---

## 4. PYDANTIC

### 1. What is it?
Pydantic is a data validation and settings management library using Python type annotations.

### 2. What does it do?
It defines structured data contracts (schemas). It parses, coerces, and validates incoming JSON payloads to ensure fields match expected types and value constraints (e.g., numbers are positive, values fall between bounds).

### 3. Why is it used in this project?
In a Causal AI simulator, sending invalid parameters (such as a negative marketing budget or non-numeric string) would crash the mathematical simulation. Pydantic acts as a gatekeeper, rejecting bad inputs before business logic executes.

### 4. How does it work?
When a request body arrives, Pydantic inspects the fields against class definitions inheriting from `BaseModel`. It coerces types (e.g., converting the string `"15"` to float `15.0`) and evaluates field constraints (`ge=-100`, `le=200`).

### 5. Where is it used in the repository?
Centralized in `backend/app/models/schemas.py` and `scripts/dataco_ingestion.py`.

### 6. Which files use it?
* `backend/app/models/schemas.py`
* `scripts/dataco_ingestion.py`
* Imported across routers (`causal.py`, `assistant.py`, `translation.py`)

### 7. How does it communicate with other technologies?
FastAPI uses Pydantic schemas as function arguments. FastAPI passes the validated Pydantic object into backend services as strongly-typed attributes (e.g., `s.marketing_change_pct`).

### 8. Beginner-Friendly Example
```python
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    username: str
    age: int = Field(..., ge=18, le=100)
```

### 9. Project-Specific Use Case
In `backend/app/models/schemas.py`:
```python
class ScenarioInput(BaseModel):
    demand_change_pct: float = Field(0.0, ge=-100.0, le=200.0)
    price_change_pct: float = Field(0.0, ge=-50.0, le=100.0)
    marketing_change_pct: float = Field(0.0, ge=-100.0, le=300.0)
    supplier_delay_days: int = Field(0, ge=-30, le=60)
    inventory_buffer_pct: float = Field(0.0, ge=-50.0, le=100.0)
    hiring_delta: int = Field(0, ge=-20, le=50)
    baseline_revenue: Optional[float] = None
    baseline_cost: Optional[float] = None
```

### 10. Advantages & Limitations
* **Advantages:** Fast C-based validation (Pydantic V2 core is written in Rust), human-readable error messages, automated schema generation for OpenAPI.
* **Limitations:** Strict type enforcement requires careful definition of optional fields.

### 11. Alternatives
Marshmallow, Cerberus, manual dictionary validation.

### 12. Important Technical Terms
`BaseModel`, `Field Constraints`, `Type Coercion`, `Serialization`, `Optional Fields`.

### 13. Common Errors
* `ValidationError`: Request payload failed constraint check (e.g., supplier delay exceeded 60 days).

### 14. Viva Questions
* **Q:** *What happens if a user submits a price change of -80% in the causal sandbox?*  
  **A:** Pydantic immediately rejects the request with HTTP 422 before the causal engine runs, because `price_change_pct` has a strict constraint `ge=-50.0`.

---

## 5. PANDAS

### 1. What is it?
Pandas is a high-performance open-source data manipulation and analysis library built on top of NumPy for the Python programming language.

### 2. What does it do?
It ingests the 180,519-row DataCo supply chain CSV, parses timestamps, extracts financial and operational subsets, performs GroupBy aggregations, trims anomaly tails, and computes platform KPIs.

### 3. Why is it used in this project?
Rather than setting up an external SQL database server, Pandas allows the entire 92 MB supply chain dataset to be loaded directly into RAM, providing sub-millisecond in-memory slicing and aggregation.

### 4. How does it work?
Pandas stores data in two primary structures: `Series` (1D labeled arrays) and `DataFrame` (2D tabular labeled structures). It executes columnar operations compiled in C, making mathematical operations on 180K rows instantaneous.

### 5. Where is it used in the repository?
Core engine of `backend/app/services/data_service.py`, `graph_service.py`, `forecast_service.py`, and `scripts/`.

### 6. Which files use it?
* `backend/app/services/data_service.py`
* `backend/app/services/graph_service.py`
* `backend/app/services/forecast_service.py`
* `backend/app/services/causal_service.py`
* `scripts/dataco_ingestion.py`
* `scripts/graph_builder.py`

### 7. How does it communicate with other technologies?
It reads raw CSV bytes via `io.BytesIO(raw)` and exports dictionary records via `.to_dict(orient="records")` which FastAPI serializes to JSON.

### 8. Beginner-Friendly Example
```python
import pandas as pd
df = pd.DataFrame([{"product": "Cleats", "sales": 150}, {"product": "Gloves", "sales": 80}])
total_sales = df["sales"].sum() # 230
```

### 9. Project-Specific Use Case
In `backend/app/services/data_service.py`, dynamic grouping and monthly aggregation:
```python
def _monthly(d: pd.DataFrame) -> pd.DataFrame:
    return (
        d.assign(month=d["date"].dt.to_period("M").astype(str))
        .groupby("month", as_index=False)
        .agg(
            revenue=("revenue", "sum"),
            net_revenue=("net_revenue", "sum"),
            profit=("profit", "sum"),
            demand=("quantity", "sum"),
            orders=("order_id", "nunique"),
        )
        .sort_values("month")
        .reset_index(drop=True)
    )
```

### 10. Advantages & Limitations
* **Advantages:** Vectorized speed, rich time-series tools (`to_period("M")`), flexible schema handling.
* **Limitations:** Memory intensive (a 92 MB CSV consumes ~350 MB RAM as an in-memory DataFrame); non-distributed (runs on a single machine).

### 11. Alternatives
Polars (Rust-based, faster on multi-core), PySpark (Distributed big-data alternative), DuckDB (Embedded SQL alternative).

### 12. Important Technical Terms
`DataFrame`, `Series`, `GroupBy`, `Aggregation`, `Vectorization`, `DatetimeIndex`, `PeriodIndex`.

### 13. Common Errors
* `KeyError`: Column name does not exist (mitigated in this project by the `_pick()` helper function).
* `SettingWithCopyWarning`: Modifying a slice of a DataFrame without `.copy()`.

### 14. Viva Questions
* **Q:** *Why does the first request to the API take 2-3 seconds, while subsequent requests take less than 10 milliseconds?*  
  **A:** Because `data_service.py` uses `@lru_cache(maxsize=6)`. The first request reads and normalizes the 92 MB CSV from disk; all subsequent requests retrieve the already normalized DataFrame directly from RAM.

---

## 6. NUMPY

### 1. What is it?
NumPy (Numerical Python) is the foundational scientific computing library in Python, providing multidimensional arrays, matrices, and high-level mathematical functions.

### 2. What does it do?
It handles numerical array reshaping, vector arithmetic, bounding constraints (`np.maximum`), and linear regression coordinate generation.

### 3. Why is it used in this project?
Pandas and Scikit-learn depend directly on NumPy array memory buffers (`ndarray`). In the forecasting fallback engine, NumPy prepares array matrices for statistical fitting.

### 4. How does it work?
NumPy stores elements in contiguous memory blocks with homogeneous C data types, bypassing Python's pointer overhead and executing SIMD (Single Instruction Multiple Data) CPU operations.

### 5. Where is it used in the repository?
In `backend/app/services/forecast_service.py` and `scripts/dataco_ingestion.py`.

### 6. Which files use it?
* `backend/app/services/forecast_service.py`
* `scripts/dataco_ingestion.py`

### 7. How does it communicate with other technologies?
NumPy converts Pandas Series (`usable["revenue"].to_numpy(dtype=float)`) into matrices passed into Scikit-learn's `.fit()` method.

### 8. Beginner-Friendly Example
```python
import numpy as np
# Reshape 1D array to 2D matrix required by Scikit-Learn
x = np.arange(5).reshape(-1, 1)
```

### 9. Project-Specific Use Case
In `backend/app/services/forecast_service.py`:
```python
y = usable["revenue"].to_numpy(dtype=float)
lin = LinearRegression().fit(np.arange(len(y)).reshape(-1, 1), y)
future_x = np.arange(len(y), len(y) + horizon).reshape(-1, 1)
preds = np.maximum(0, lin.predict(future_x))
```

### 10. Advantages & Limitations
* **Advantages:** Unmatched calculation speed, foundational standard for all Python AI/ML libraries.
* **Limitations:** Does not natively support GPU acceleration without CuPy or PyTorch.

### 11. Alternatives
PyTorch tensors, TensorFlow constants, standard Python `math` module.

### 12. Important Technical Terms
`ndarray`, `broadcasting`, `vectorization`, `reshape(-1, 1)`, `contiguous memory`.

### 13. Viva Questions
* **Q:** *Why is `np.arange(len(y)).reshape(-1, 1)` used before calling Scikit-Learn's `LinearRegression.fit()`?*  
  **A:** Scikit-Learn estimators require feature matrices ($X$) to be 2-dimensional `(n_samples, n_features)`. `reshape(-1, 1)` turns a 1D sequence of length $N$ into an $N \times 1$ column matrix.

---

## 7. SCIKIT-LEARN

### 1. What is it?
Scikit-learn is the standard Python machine learning library providing simple and efficient tools for predictive data analysis, regression, clustering, and model evaluation.

### 2. What does it do?
It provides the `LinearRegression` model used in `forecast_service.py` as an algorithmic fallback when pre-calculated TFT cache entries are unavailable.

### 3. Why is it used in this project?
To ensure the Digital Twin is resilient: if a user uploads a new custom CSV dataset that does not have pre-calculated deep transformer cache entries, the platform does not crash—it falls back to fitting a linear trendline on historical data.

### 4. How does it work?
`LinearRegression()` fits a line using Ordinary Least Squares (OLS), minimizing the residual sum of squares between observed targets and predictions: $\min_{w} ||Xw - y||_2^2$.

### 5. Where is it used in the repository?
In `backend/app/services/forecast_service.py`.

### 6. Which files use it?
* `backend/app/services/forecast_service.py`
* `backend/requirements.txt`

### 7. How does it communicate with other technologies?
Takes NumPy arrays prepared from Pandas DataFrames, predicts forward trajectory arrays, and formats them into JSON timeline arrays for the frontend.

### 8. Beginner-Friendly Example
```python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4]])
y = np.array([10, 20, 30, 40])
model = LinearRegression().fit(X, y)
next_prediction = model.predict([[5]]) # Returns [50.0]
```

### 9. Project-Specific Use Case
Implemented in `get_statistical_forecast()` in `backend/app/services/forecast_service.py`.

### 10. Advantages & Limitations
* **Advantages:** Instantaneous execution (<5ms), zero GPU requirement, stable convergence.
* **Limitations:** Linear models cannot capture seasonality, non-linear interactions, or quantile uncertainties (P10/P90), which is why Temporal Fusion Transformers are benchmarked as Champion.

### 11. Alternatives
Statsmodels (ARIMA/SARIMAX), Prophet, PyTorch Forecasting.

### 12. Important Technical Terms
`Ordinary Least Squares (OLS)`, `Regression Coefficient`, `Residuals`, `Fit and Predict`.

### 13. Viva Questions
* **Q:** *Is the actual Temporal Fusion Transformer trained inside this code?*  
  **A:** No. As verified in `forecast_service.py`, the TFT multi-horizon quantile forecast cones are pre-calculated and loaded from `forecast_cache.json`. Scikit-learn's `LinearRegression` is implemented as the active fallback engine.

---

## 8. NEO4J & CYPHER QUERY LANGUAGE

### 1. What is it?
Neo4j is the world's leading native graph database engine, and Cypher is its declarative graph query language (analogous to SQL for relational tables).

### 2. What does it do?
It models enterprise supply chain data as nodes (entities) and directed relationships (edges) instead of flat tables.

### 3. Why is it used in this project?
Supply chains are inherently networks (Customers $\rightarrow$ Orders $\rightarrow$ Products $\rightarrow$ Departments $\rightarrow$ Carriers). Relational databases require expensive recursive multi-table JOINs to trace delay bottlenecks. Graph databases traverse multi-hop paths with constant index-free adjacency.

### 4. How does it work?
In `scripts/graph_builder.py`, the official Python driver connects to Neo4j using the Bolt binary protocol (`bolt://` or `neo4j+s://`). It executes Cypher queries using `session.run()`.

### 5. Where is it used in the repository?
In `scripts/graph_builder.py` and `backend/requirements.txt` (`neo4j>=5.20`).

### 6. Which files use it?
* `scripts/graph_builder.py`
* `backend/requirements.txt`

### 7. How does it communicate with other technologies?
The Python `neo4j` driver communicates over encrypted TLS sockets with Neo4j AuraDB cloud instances.

### 8. Beginner-Friendly Example
```cypher
// Match customer purchases and return total spend
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:CONTAINS]->(p:Product)
RETURN c.id, sum(o.sales) AS total_spend
ORDER BY total_spend DESC LIMIT 5;
```

### 9. Project-Specific Use Case
In `scripts/graph_builder.py`:
```cypher
UNWIND $batch AS row
MERGE (c:Customer {id: row.customer_id})
ON CREATE SET c.segment = row.customer_segment, c.country = row.customer_country
MERGE (o:Order {id: row.order_id})
MERGE (c)-[:PLACED]->(o)
```

### 10. Advantages & Limitations
* **Advantages:** Native multi-hop traversal, intuitive schema matching real-world supply chains.
* **Limitations:** Requires a running Neo4j instance. *(Architectural note: The demo web application builds the semantic graph directly from Pandas in `graph_service.py` to remain 100% self-contained)*.

### 11. Alternatives
Amazon Neptune, ArangoDB, Memgraph, NetworkX (In-memory Python library).

### 12. Important Technical Terms
`Nodes`, `Relationships`, `Labels`, `Cypher`, `MERGE`, `UNWIND`, `Index-Free Adjacency`.

### 13. Viva Questions
* **Q:** *Does the web application fail if Neo4j is offline?*  
  **A:** No. `scripts/graph_builder.py` is a standalone utility for loading records into Neo4j AuraDB. The live web application serves graph queries from `backend/app/services/graph_service.py`, which constructs the graph topology in-memory from Pandas.

---

## 9. OPENPYXL & PYTHON-MULTIPART

### 1. What are they?
* **OpenPyXL**: A Python library to read and write Excel 2010 `xlsx/xlsm/xltx/xltm` files.
* **Python-Multipart**: An Apache 2.0 licensed streaming multipart/form-data parser for Python.

### 2. What do they do?
* `python-multipart` enables FastAPI to receive file uploads (`UploadFile`) over HTTP POST requests.
* `openpyxl` allows the backend to parse uploaded `.xlsx` spreadsheets in addition to `.csv` files.

### 3. Why are they used in this project?
Small business owners often manage inventory in Microsoft Excel rather than raw CSV files. These libraries allow the Digital Twin to accept both formats seamlessly.

### 4. Where are they used in the repository?
Referenced in `backend/requirements.txt` and utilized in `backend/app/api/routers/data.py` (`UploadFile`) and `backend/app/services/data_service.py` (`pd.read_excel`).

### 5. Viva Questions
* **Q:** *How does the file uploader handle file limits?*  
  **A:** `config.py` defines `MAX_UPLOAD_BYTES = 150 * 1024 * 1024` (150 MB). In `data.py`, `file.read()` enforces this threshold to protect server memory from denial-of-service exhaustion.

---

## 10. REACT 18+

### 1. What is it?
React is a declarative, component-based front-end JavaScript library developed by Meta for building dynamic user interfaces.

### 2. What does it do?
It renders the entire single-page application (SPA), manages UI state (active tab, slider positions, chat history), and re-renders components when data updates.

### 3. Why is it used in this project?
The Digital Twin interface requires real-time interactivity: moving a causal slider must immediately update financial KPI cards and Recharts graphs without a full page reload. React's Virtual DOM enables this responsiveness.

### 4. How does it work?
React maintains an in-memory Virtual DOM. When state changes (`useState`), React re-computes the Virtual DOM diff and applies only the minimal necessary updates to the actual browser DOM.

### 5. Where is it used in the repository?
Every file in `frontend/biztwin-frontend/src/`.

### 6. Which files use it?
* `src/main.jsx` (Mounts root React component)
* `src/App.jsx` (State orchestration & shell)
* All 10 page modules in `src/pages/`
* Layout components in `src/components/layout/`

### 7. Beginner-Friendly Example
```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked: {count}</button>;
}
```

### 8. Project-Specific Use Case
In `src/App.jsx`, managing user profile and deep linking state:
```jsx
const [page, setPage] = useState(() => {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) return hash;
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'dashboard';
  } catch {
    return 'dashboard';
  }
});
```

### 9. Viva Questions
* **Q:** *What React hooks are used in this project?*  
  **A:** `useState` (for slider values, chat messages, active navigation), `useEffect` (for triggering data fetching on mount and debounced causal evaluation), and `useRef` (for auto-scrolling chat history).

---

## 11. VITE BUILD TOOL

### 1. What is it?
Vite is a next-generation frontend build tool that provides a lightning-fast development server and optimized Rollup production builds.

### 2. What does it do?
It compiles JSX, serves modules using native ES Modules (ESM) during development with instant Hot Module Replacement (HMR), and bundles assets into minified static files (`dist/`) for production.

### 3. Why is it used in this project?
Traditional bundlers like Webpack become slow as applications grow. Vite starts dev servers in under 300 milliseconds because it does not bundle all files ahead of time.

### 4. Viva Questions
* **Q:** *Why does Vite build faster than Webpack?*  
  **A:** Vite leverages native browser ES modules during development and pre-bundles dependencies using esbuild (written in Go, which is 10-100x faster than JavaScript-based bundlers).

---

## 12. RECHARTS DATA VISUALIZATION LIBRARY

### 1. What is it?
Recharts is a composable, declarative charting library built with React components and D3.js SVG rendering.

### 2. What does it do?
It renders the interactive graphical elements:
* Multi-Horizon Quantile Cones (`AreaChart` with stacked SVG areas for P10, P50, P90).
* Historical Revenue vs. Profit Trajectories (`AreaChart`).
* Causal 6-Week Cash Flow Projections (`LineChart`).
* Departmental Revenue Breakdown (`BarChart`).
* Delivery Risk Distributions (`PieChart`).

### 3. Viva Questions
* **Q:** *How is the TFT quantile cone rendered in Recharts?*  
  **A:** In `src/pages/Forecast/index.jsx`, an `AreaChart` is used where the P10-to-P90 upper confidence bounds are rendered using semi-transparent `<Area dataKey="tft_p90" stroke="#818CF8" fill="#EEF2FF" />` and the median expectation is plotted as `<Line dataKey="tft_median" stroke="#4F46E5" strokeWidth={3} />`.

---

## 13. LUCIDE REACT

### 1. What is it?
Lucide React is a clean, lightweight icon library providing customizable SVG icons as native React components.

### 2. What does it do?
It renders all UI icons across navigation menus, KPI status badges, slider controls, and buttons (e.g., `Brain`, `Network`, `SlidersHorizontal`, `Sparkles`, `Languages`, `Activity`).

---

## 14. WINDOWS BATCH & BASH AUTOMATION

### 1. What are they?
* **Windows Batch (`.bat`)**: The native command-line scripting language of the Windows Command Prompt (`cmd.exe`).
* **Bash (`.sh`)**: The standard Unix shell and command language for Linux and macOS.

### 2. What do they do?
They provide automated one-click launcher scripts (`run.bat`, `stop.bat`, `run.sh`, `stop.sh`) that verify prerequisites, download missing runtimes silently, configure virtual environments, install packages, and orchestrate server lifecycles.

### 3. Viva Questions
* **Q:** *How does `stop.bat` free ports without rebooting?*  
  **A:** It runs `netstat -aon | findstr ":8000"`, extracts the 5th token (the Process Identifier / PID), and calls `taskkill /F /PID <PID>` to terminate the process holding the port.
