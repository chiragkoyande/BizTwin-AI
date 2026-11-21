# SYSTEM ARCHITECTURE & DATA FLOW SPECIFICATION

> **Scope:** Architectural blueprint reconstructed strictly from the codebase implementation.  
> **Diagrams:** High-level system topology, frontend-backend communications, data relationships, API lifecycle, AI pipelines, user journeys, and process deployment.

---

## 1. ARCHITECTURAL OVERVIEW

The **Digital Twin for Small Businesses** platform follows a decoupled, two-tier client-server architecture consisting of:
1. **Frontend Presentation Tier**: A React 18 Single Page Application (SPA) built with Vite, utilizing client-side routing, modular page views, and Recharts SVG graphics.
2. **Backend Services Tier**: A modular FastAPI (Python 3.10+) REST API operating an in-memory data engine (Pandas/NumPy), an analytical Causal AI simulation engine, and an in-memory streaming transaction buffer.

```mermaid
flowchart TD
    subgraph ClientTier["CLIENT PRESENTATION TIER (Browser :5173)"]
        UI["React 18 SPA Shell (App.jsx)"]
        Nav["Sidebar & Topbar Navigation"]
        Pages["10 Modular Views (Dashboard, Causal, Graph, etc.)"]
        Store["Browser LocalStorage (User Profile, Zoom, API Base)"]
        UI --> Nav
        UI --> Pages
        UI <--> Store
    end

    subgraph APITier["BACKEND SERVICES TIER (FastAPI :8000)"]
        Server["Uvicorn ASGI Server"]
        Router["10 Modular APIRouters (/api/*)"]
        Validation["Pydantic Schemas (ScenarioInput, Question)"]
        Server --> Router
        Router --> Validation
    end

    subgraph ServiceTier["DOMAIN SERVICES LAYER"]
        DataSvc["Data Service (LRU Cache, Normalization)"]
        CausalSvc["Causal SCM Service (Do-Calculus Engine)"]
        GraphSvc["Graph Service (Heterogeneous DAG Builder)"]
        FcstSvc["Forecast Service (TFT Cache & Linear Fallback)"]
        StreamSvc["Stream Service (Async Sliding Buffer)"]
        AssistSvc["Assistant Service (Intent Dispatcher)"]
        TransSvc["Translation Service (5-Dialect Localization)"]
        ModelSvc["Model Service (Benchmark Store)"]
    end

    subgraph StorageTier["DATA & STORAGE LAYER"]
        ActiveCSV["DataCoSupplyChainDataset.csv (180K Rows)"]
        ActiveMeta["active_dataset.csv / active_meta.json"]
        TFTCache["forecast_cache.json (P10/P50/P90 Cones)"]
        Neo4jRemote["Neo4j AuraDB (Optional / Standalone Script)"]
    end

    ClientTier -- "HTTP REST (JSON) / CORS" --> APITier
    Validation --> ServiceTier
    DataSvc <--> ActiveCSV
    DataSvc <--> ActiveMeta
    FcstSvc <--> TFTCache
    CausalSvc --> DataSvc
    GraphSvc --> DataSvc
    AssistSvc --> DataSvc
```

---

## 2. FRONTEND-TO-BACKEND COMMUNICATION ARCHITECTURE

The frontend communicates with the backend asynchronously using native `fetch()` wrapped inside `src/api.js`.

```mermaid
sequenceDiagram
    autonumber
    actor User as Executive / User
    participant View as React Page (e.g., Causal)
    participant Client as api.js (Fetch Client)
    participant Backend as FastAPI Router (/api/causal/evaluate)
    participant Schema as Pydantic (ScenarioInput)
    participant Service as causal_service.py
    participant Data as data_service.py (LRU Cache)

    User->>View: Adjusts Marketing Slider to +25%
    Note over View: Debounces input by 250ms
    View->>Client: api.post('/api/causal/evaluate', payload)
    Client->>Backend: HTTP POST http://127.0.0.1:8000/api/causal/evaluate
    Backend->>Schema: Validate field constraints (ge=-100, le=300)
    Schema-->>Backend: Validated ScenarioInput Object
    Backend->>Service: evaluate_causal_counterfactual(scenario)
    Service->>Data: get_data() -> DataFrame (from RAM cache)
    Data-->>Service: Active Dataset Baseline Metrics
    Note over Service: Calculates Pearl's SCM propagation & counterfactual delta
    Service-->>Backend: Return dictionary with scenario & cash flow
    Backend-->>Client: HTTP 200 OK (application/json)
    Client-->>View: Parsed JSON Result
    View-->>User: Recharts graph & delta badges update instantly
```

---

## 3. DATA AND ENTITY RELATIONSHIPS

The platform models supply chain data into a 5-Tier Heterogeneous DAG. The relationships verified in `graph_service.py` and `scripts/graph_builder.py` are structured as follows:

```mermaid
erDiagram
    CUSTOMER_SEGMENT ||--o{ CATEGORY : "BUYS_FROM (Weight: Revenue)"
    CATEGORY ||--|| DEPARTMENT : "BELONGS_TO (Weight: Revenue * 1.5)"
    CATEGORY ||--o{ REGION : "DISTRIBUTED_IN (Weight: Sales)"
    LOGISTICS_CARRIER ||--o{ FULFILLMENT_STATUS : "TRANSPORTS_VIA (Weight: Order Count)"
    CATEGORY ||--|| FINANCIAL_OUTCOME : "FLOWS_TO (Net Revenue)"
    FINANCIAL_OUTCOME ||--|| OPERATING_CASH_FLOW : "DETERMINES_MARGIN (Profit = Rev * Margin)"

    CUSTOMER_SEGMENT {
        string id PK "CustomerSegment:Consumer"
        string label "Consumer"
        float gnn_risk_score "0.15"
        int gnn_cluster "2"
    }

    CATEGORY {
        string id PK "Category:Cleats"
        string label "Cleats"
        float value "$7.32M Sales"
        float gnn_risk_score "0.25"
    }

    LOGISTICS_CARRIER {
        string id PK "Logistics:Standard Shipping"
        string label "Standard Shipping"
        float gnn_risk_score "0.62 (High Risk)"
    }

    FULFILLMENT_STATUS {
        string id PK "FulfillmentStatus:Late Delivery Risk"
        string label "Late Delivery"
        float gnn_risk_score "0.88 (Critical Bottleneck)"
    }
```

---

## 4. API REQUEST LIFECYCLE

When an HTTP request enters the FastAPI server:

```mermaid
flowchart LR
    A["HTTP Request"] --> B["Uvicorn Socket Listener"]
    B --> C["CORSMiddleware Verification"]
    C --> D{"Origin Allowed?"}
    D -- No --> E["403 Forbidden"]
    D -- Yes --> F["FastAPI Router Matching"]
    F --> G{"Route Exists?"}
    G -- No --> H["404 Not Found"]
    G -- Yes --> I["Pydantic Body / Query Validation"]
    I --> J{"Valid Types & Bounds?"}
    J -- No --> K["422 Unprocessable Entity"]
    J -- Yes --> L["Execute Domain Service Function"]
    L --> M["FastAPI JSON Response Serialization"]
    M --> N["HTTP 200 OK Response"]
```

---

## 5. ANALYTICAL AI & SIMULATION PIPELINE

```mermaid
flowchart TD
    subgraph IngestionStage["1. INGESTION & ANOMALY FILTER"]
        Raw["DataCoSupplyChainDataset.csv (180,519 rows)"] --> MultiEnc["Multi-Encoding Reader (UTF-8, Latin-1)"]
        MultiEnc --> Norm["Column Normalizer (_normalize)"]
        Norm --> TailFilter["Anomaly Tail Trimmer (_trim_anomaly_tail)"]
        TailFilter --> RAMCache["In-Memory LRU Cached DataFrame"]
    end

    subgraph SimulationStage["2. MULTI-MODEL ANALYTICAL CORE"]
        RAMCache --> SCM["Pearl's Causal Do-Calculus Engine (Linear Elasticity DAG)"]
        RAMCache --> Graph["5-Tier Semantic Graph Builder (Pandas GroupBy)"]
        RAMCache --> Fallback["Scikit-learn Linear Regression (Statistical Fallback)"]
        JSONCache["forecast_cache.json"] --> TFT["TFT Multi-Horizon Quantile Forecaster (P10, P50, P90)"]
    end

    subgraph StrategicStage["3. EXECUTIVE INTELLIGENCE & LOCALIZATION"]
        SCM --> Cockpit["GraphRAG Assistant Intent Dispatcher"]
        Graph --> Cockpit
        TFT --> Cockpit
        Cockpit --> Translation["5-Dialect Localization (Regex Token Preservation)"]
    end
```

---

## 6. COMPLETE USER JOURNEY MAP

```mermaid
flowchart TD
    Start(["User Opens Application"]) --> Dash["1. Executive Dashboard: Observes 54.8% Late Delivery Risk & $1.24M SLA drag"]
    Dash --> Sem["2. Semantic Graph: Drills down into GNN Bottleneck; traces Standard Shipping carrier mode"]
    Sem --> Assist["3. GraphRAG Assistant: Asks 'What are our primary delivery bottlenecks?'"]
    Assist --> Action["4. One-Click Scenario Trigger: Clicks 'Simulate shifting volume to Express'"]
    Action --> Causal["5. Causal AI Sandbox: Parameters transferred automatically; adjusts Supplier Delay to -3 days"]
    Causal --> Outcome["6. Evaluates Counterfactuals: Verifies +$42,000 cash recovery and 16.7% profit margin"]
    Outcome --> Trans["7. Executive Translation: Selects Gujarati/Hindi; exports localized briefing for regional team"]
    Trans --> End(["Informed Decision Executed"])
```

---

## 7. PROCESS & DEPLOYMENT ARCHITECTURE

The application runs as two coordinated asynchronous processes on the host machine:

```mermaid
flowchart TD
    Launcher["run.bat / run.sh"] --> Pre{"Check Python & Node.js"}
    Pre -- Missing --> AutoInst["Automated Silent Runtime Downloader"]
    Pre -- Verified --> Venv["Activate Python .venv"]
    AutoInst --> Venv
    Venv --> PortClean["stop.bat: Free Ports 8000 & 5173"]
    PortClean --> Proc1["Process 1: Uvicorn (FastAPI) on 127.0.0.1:8000"]
    PortClean --> Proc2["Process 2: Node.js (Vite) on 127.0.0.1:5173"]
    Proc1 --> Ready{"Health Probe OK?"}
    Proc2 --> Ready
    Ready -- Yes --> Browser["Open Web Browser at http://localhost:5173"]
```

---

## 8. INFERRED VS. VERIFIED ARCHITECTURAL CONNECTIONS

To maintain strict scientific accuracy:

1. **Verified Code Connection**: The communication between the React frontend and FastAPI backend over HTTP JSON REST endpoints (`/api/*`) is fully verified in `src/api.js` and `backend/main.py`.
2. **Verified Code Connection**: Causal counterfactual modeling in `causal_service.py` is actively computed from historical baselines calculated dynamically by Pandas.
3. **Inferred/Standalone Connection**: The connection between the application and a live Neo4j database instance. While `scripts/graph_builder.py` contains a complete Cypher ingestion script, the demo web application runs standalone without requiring an active Neo4j server, constructing its semantic graph directly from Pandas in `graph_service.py`.
4. **Verified Cache Connection**: TFT deep forecasting quantile cones are loaded from `forecast_cache.json`. The deep neural network training script itself is not part of the active web server runtime.
