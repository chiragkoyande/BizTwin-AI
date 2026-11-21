# Digital Twin for Small Businesses

Enterprise-grade Digital Twin Platform powered by Multi-Modal Graph Neural Networks (GNN), Temporal Fusion Transformers (TFT), and Pearl's Counterfactual Structural Causal Models (SCM).

> 📖 **Comprehensive Academic & Viva Guide:** See [PROJECT_MASTER_GUIDE_AND_VIVA_HANDBOOK.md](PROJECT_MASTER_GUIDE_AND_VIVA_HANDBOOK.md) for the complete 20-chapter architectural blueprint, source-code breakdown, technology masterclass, and 285+ viva question bank.  
> 🚀 **Client Quickstart:** See [CLIENT_QUICKSTART.md](CLIENT_QUICKSTART.md) for the one-click `run.bat` deployment guide.

---

## ⚡ Quickstart (One-Click Launch)

### Windows (Client One-Click)
Simply **double-click `run.bat`** (or `start.bat`) in the root folder.
* Automatically verifies **Python 3.10+** and **Node.js** prerequisites.
* Creates an isolated Python virtual environment (`.venv`).
* Installs all backend dependencies from `backend/requirements.txt` (A to Z).
* Installs all frontend packages via `npm install` (A to Z).
* Starts both the FastAPI backend (`http://127.0.0.1:8000`) and Vite UI (`http://localhost:5173`).
* Automatically opens your default web browser to the dashboard.
* **To stop:** Press `[ENTER]` in the launcher window or double-click **`stop.bat`**.

### macOS / Linux
```bash
chmod +x run.sh stop.sh
./run.sh
```
To stop: `./stop.sh`

---

## 1. Prerequisites

- Python 3.10+ (3.11 or 3.12 recommended)
- Node.js 20+ and npm
- About 2 GB of free memory while the API is running

---

## 2. Start the backend (Terminal 1)

From the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

Check it:

- Health: http://127.0.0.1:8000/api/health
- Swagger docs: http://127.0.0.1:8000/docs

The first request loads and normalizes the 96 MB DataCo CSV, so it takes a few seconds.
Later requests are cached.

---

## 3. Start the frontend (Terminal 2)

```bash
cd frontend/biztwin-frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173

The frontend calls `http://127.0.0.1:8000` by default. To use a different API URL, create
`frontend/biztwin-frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then restart the Vite dev server.

---

## 4. Five-minute presentation flow

1. **Dashboard** — point out the live dataset badge, 180,519 rows, `$36.78M` revenue,
   `12.0%` margin and the data-quality note about the incomplete last four months.
   Revenue growth is computed on complete months only.
2. **Forecasting** — run **Next 3 months** for revenue. Show the actual-vs-forecast line and
   the model table. Say plainly: *naive, linear trend and random forest are compared on a
   chronological 80/20 holdout; the lowest-MAE model is selected. No TFT is trained.*
3. **Model Lab** — show the same real holdout MAE/RMSE/MAPE values. No fabricated experiments.
4. **What-If Simulator** — move **Marketing spend change** from +20% to +50%. Revenue and
   profit update from the backend. Call the outputs *assumption-driven estimates, not causal
   effects*.
5. **Financial What-If** — show baseline vs scenario P&L and read the cash-flow caveat:
   receivables, payables and payment timing are not in the dataset.
6. **Semantic Graph** — click category/region nodes. Explain that it is an association graph
   computed from CSV group-bys (belongs-to, sold-in, buys), not Neo4j and not a GNN.
   Line width is relative revenue; the caveat is on screen.
7. **Data Manager** — show the dataset profile and the reset-to-DataCo button. Optionally
   upload `backend/data/sample_sales.csv` to demonstrate a 72-row INR dataset, then reset.
   Uploading the full DataCo CSV is supported but unnecessary for the demo.
8. **AI Translation / Business Assistant** — translate the sample insight to Hindi, then ask
   *Top category*. State honestly: phrase-level dictionary translation and a rule-based
   assistant; this is not an LLM.

---

## 5. Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service status |
| GET | `/api/data/profile` | Rows, columns, date range, revenue, missing values |
| GET | `/api/dashboard` | Metrics, monthly series, insights, warnings |
| GET | `/api/semantic/summary` | Rule-based narrative summary |
| GET | `/api/forecast?target=revenue&horizon=3` | Forecast + holdout metrics |
| GET | `/api/models?target=revenue` | Model comparison |
| POST | `/api/scenario` | What-if estimate |
| POST | `/api/financial` | P&L comparison |
| GET | `/api/graph` | Association graph from the active CSV |
| POST | `/api/translation` | Hindi/Marathi phrase-level translation |
| POST | `/api/assistant` | Rule-based data Q&A |
| POST | `/api/data/upload` | Upload CSV/XLSX (`multipart/form-data`, field `file`) |
| POST | `/api/data/reset` | Remove the upload and return to DataCo |
| GET | `/api/activity` | Recent activity shown on the dashboard |

Example scenario request:

```json
{
  "demand_change_pct": 15,
  "price_change_pct": -5,
  "marketing_change_pct": 20,
  "supplier_delay_days": 3
}
```

---

## 6. Dataset and upload format

The API chooses the active dataset in this order:

1. `backend/data/active_dataset.csv` (last successful upload)
2. `DataCoSupplyChainDataset.csv` in the project root
3. `backend/data/sample_sales.csv` (72 rows, INR)

DataCo columns are detected automatically. A generic sales CSV needs:

- a date column: `order date (DateOrders)`, `order_date`, `date`, `timestamp`, or `month`
- a quantity column: `Order Item Quantity`, `quantity`, `units_sold`, `demand`, or `qty`
- a revenue column (`Sales`, `revenue`, `total_sales`, `amount`) **or** a price column
  (`unit_price`, `price`, `selling_price`)

Optional fields improve the output: order ID, customer ID, product ID, category, department,
region, segment, shipping mode, delivery status, late-delivery risk, profit, discount.

Currency is USD for DataCo-shaped files and INR for the bundled sample/generic uploads.

---

## 7. What is real vs. what is a baseline

**Computed from the data**

- Revenue, profit, margin, orders, demand, average order value, regional/category leaders
- Monthly series and growth on complete months
- Late-delivery-risk percentage (where the column exists)
- Association graph from group-bys in the active CSV
- Upload validation, normalization and profiling

**Real but deliberately simple**

- Forecasting: naive carry-forward, linear trend, and a random forest with lag features.
  Models are scored on a chronological holdout, then the best one is refit for the forecast.
- What-If/Financial: a three-month baseline multiplied by explicit assumptions
  (marketing elasticity, demand-to-cost factor, supplier-delay factor). These are not
  estimated causal coefficients.
- Translation: phrase dictionary replacement for Hindi and Marathi.
- Assistant: keyword-routed answers computed from dashboard metrics.

**Not implemented**

- TFT, LSTM, XGBoost, GNN or Neo4j-based graph learning in the demo path
- Causal inference (DoWhy, interventions, counterfactual validation)
- LLM-generated text
- Cash-flow forecasting (requires receivables/payables/payment timing)
- Inventory or marketing-spend data (the What-If inputs are assumptions)

Do not describe the demo as a validated causal digital twin. The honest description is:
*an end-to-end business analytics prototype with transparent statistical baselines, an
assumption-driven scenario simulator, and a data-derived association graph.*

---

## 8. Troubleshooting

**The dashboard says “Could not load data”.**
Check the backend is running at http://127.0.0.1:8000/api/health. If it is on another port,
set `VITE_API_URL` and restart Vite.

**`ModuleNotFoundError` in the backend.**
Activate the virtual environment and reinstall: `pip install -r requirements.txt`.

**The first page load is slow.**
The API is reading the 96 MB DataCo CSV and building the cache. Wait a few seconds and refresh.

**Port 8000 already in use.**
Stop the other process or run `uvicorn main:app --port 8001`, then point `VITE_API_URL` at it.

**The latest four months look low.**
That is real DataCo coverage, not a bug. The dashboard shows a warning, and modelling excludes
the incomplete tail. Dashboard totals and the graph still use all rows.

**Reset after a demo upload.**
Data Manager → **Reset to DataCo default**.

---

## 9. Project layout

```text
BizTwinAI/
├── DataCoSupplyChainDataset.csv     # default 96 MB dataset
├── forecast_cache.json              # pre-computed TFT model quantiles & timeline
├── backend/
│   ├── main.py                      # FastAPI app entry point (clean router mounts, ~68 lines)
│   ├── requirements.txt
│   ├── data/sample_sales.csv        # 72-row INR demo dataset
│   └── app/                         # Senior-engineer modular backend architecture
│       ├── core/config.py           # Paths, CORS, and platform settings
│       ├── models/schemas.py        # Pydantic request & response schemas
│       ├── services/                # Core domain business logic & ML algorithms
│       │   ├── data_service.py      # Ingestion, normalization, caching & profiling
│       │   ├── stream_service.py    # Phase 1: Real-time streaming buffer & background task
│       │   ├── graph_service.py     # Phase 2: 5-Tier Semantic DAG & GNN link prediction
│       │   ├── forecast_service.py  # Phase 3A: TFT multi-horizon forecasting & baselines
│       │   ├── causal_service.py    # Phase 3B: Pearl's do-calculus SCM counterfactual engine
│       │   ├── assistant_service.py # Phase 4: GraphRAG multi-hop grounded agent
│       │   ├── translation_service.py # Multilingual executive localization & SMB glossary
│       │   └── model_service.py     # Deep learning benchmark leaderboard metadata
│       └── api/routers/             # Dedicated APIRouter modules
│           ├── health.py            # System health & status endpoints
│           ├── dashboard.py         # Executive dashboard metrics & platform activity
│           ├── stream.py            # Phase 1 streaming controls & buffer
│           ├── data.py              # Dataset upload, reset, and profile
│           ├── graph.py             # Phase 2 semantic graph endpoints
│           ├── forecast.py          # Phase 3A TFT & statistical forecast endpoints
│           ├── causal.py            # Phase 3B Pearl do-calculus counterfactual endpoints
│           ├── assistant.py         # Phase 4 GraphRAG AI strategy assistant endpoints
│           ├── translation.py       # Executive translation & glossary endpoints
│           └── models.py            # Model Lab benchmark leaderboard endpoints
├── frontend/biztwin-frontend/
│   ├── src/App.jsx                  # Modular router & shell (~630 lines)
│   ├── src/components/layout/       # Reusable layout components (Sidebar, Topbar)
│   ├── src/constants/               # Curated navigation, graph topology, translation data
│   ├── src/pages/                   # Dedicated modular view components (10 pages)
│   │   ├── Dashboard/               # Executive dashboard with TFT cone & health score
│   │   ├── Phase1Streaming/         # Ingestion stream table & pipeline specs
│   │   ├── Phase2Semantic/          # Interactive 5-tier semantic DAG & GNN embeddings
│   │   ├── Phase3AForecast/         # TFT multi-horizon forecast & VSN attention weights
│   │   ├── Phase3BCausal/           # Pearl's do-calculus decision sandbox & SCM delta
│   │   ├── Phase4Assistant/         # Grounded GraphRAG conversational cockpit & i18n
│   │   ├── Translation/             # Multilingual localization workbench & glossary matrix
│   │   ├── ModelLab/                # Deep learning benchmark leaderboard table
│   │   ├── DataManagement/          # Dataset upload & schema validation
│   │   └── Settings/                # Backend URL & deployment preferences
│   ├── src/api.js                   # API client configuration
│   ├── src/format.js                # Currency, numerical, and date formatters
│   └── src/styles.css               # Global application design tokens & theme
├── scripts/                         # Offline utilities & standalone runners
│   ├── dataco_ingestion.py          # Phase 1 ingestion feeder
│   └── graph_builder.py             # Neo4j knowledge graph builder
├── docs/screenshots/                # Architecture & UI screenshots
├── dataco_ingestion.py              # Backward-compatible root runner shim
└── graph_builder.py                 # Backward-compatible root runner shim
```

`graph_builder.py` reads Neo4j credentials from environment variables only. Never commit
credentials; rotate any key that has been shared.
