# DATABASE ARCHITECTURE & API REFERENCE MASTER GUIDE

> **Scope:** Complete specification of all data storage mechanisms, graph schemas, and every active REST API endpoint in the repository.  
> **Source Evidence:** Verified against `backend/app/api/routers/*.py`, `backend/app/core/config.py`, `scripts/graph_builder.py`, and `forecast_cache.json`.

---

## 1. DATA STORAGE & PERSISTENCE ARCHITECTURE

The application implements a multi-tiered hybrid storage architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE TIERS                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. In-Memory Tabular Store : Pandas DataFrame (Cached with LRU Cache)  │
│ 2. File-Based Primary Data : DataCoSupplyChainDataset.csv (92 MB)      │
│ 3. User Upload Data Store  : backend/data/active_dataset.csv           │
│ 4. Pre-Calculated ML Cache : forecast_cache.json (Quantile Cones)      │
│ 5. Graph Database (Remote) : Neo4j AuraDB (scripts/graph_builder.py)   │
│ 6. Browser Storage (Client): LocalStorage (User Profile, Zoom, Base)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. IN-MEMORY NORMALIZED PANDAS SCHEMA

When `data_service.py` executes `_normalize()`, it transforms raw CSV records into a standardized schema stored in memory:

| Normalized Column | Data Type | Source Field Mappings | Business Significance |
| :--- | :--- | :--- | :--- |
| `date` | `datetime64[ns]` | `Order date (DateOrders)`, `order_date`, `date` | Primary temporal axis for chronological sorting |
| `month` | `Period[M]` / `str` | Derived: `date.dt.to_period("M")` | Aggregation bucket for monthly time-series |
| `order_id` | `str` | `Order Id`, `order id` | Unique order transaction identifier |
| `customer_id`| `str` | `Customer Id`, `customer id` | Unique customer entity identifier |
| `product_id` | `str` | `Order Item Cardprod Id`, `product_id` | Unique SKU identifier |
| `category` | `str` | `Category Name`, `product_category` | Product line grouping (e.g., Cleats, Cardio) |
| `department` | `str` | `Department Name`, `department` | Organizational warehouse division (e.g., Apparel) |
| `region` | `str` | `Order Region`, `Order Country` | Geographic destination (e.g., Western Europe) |
| `segment` | `str` | `Customer Segment` | Customer classification (Consumer, Corporate) |
| `shipping_mode`| `str` | `Shipping Mode`, `shipping mode` | Logistics carrier mode (Standard, Express) |
| `delivery_status`| `str` | `Delivery Status` | Late Delivery, Shipping on time, Advance |
| `late_risk` | `float` / `int` | `Late_delivery_risk` | Binary indicator (1.0 = Late, 0.0 = On Time) |
| `ship_days` | `float` | `Days for shipping (real)` | Actual elapsed transit duration |
| `scheduled_days`| `float` | `Days for shipment (scheduled)` | SLA promised transit duration |
| `quantity` | `float` | `Order Item Quantity`, `quantity` | Units sold per line item |
| `revenue` | `float` | `Sales`, `revenue`, `total_sales` | Gross transaction top-line sales (USD) |
| `net_revenue` | `float` | `Order Item Total`, `net_revenue` | Revenue after item-level discounts |
| `profit` | `float` | `Order Profit Per Order`, `profit` | Net contribution margin (USD) |
| `discount` | `float` | `Order Item Discount Rate` | Applied promotional discount percentage |

---

## 3. NEO4J GRAPH SCHEMA & CONSTRAINTS

In `scripts/graph_builder.py`, the enterprise semantic supply chain graph is defined by the following Cypher schema constraints:

```cypher
// Schema Constraints
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (o:Order) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:Department) REQUIRE d.name IS UNIQUE;

// Relationship Merging Query
UNWIND $batch AS row
MERGE (c:Customer {id: row.customer_id})
  ON CREATE SET c.segment = row.customer_segment, c.country = row.customer_country
MERGE (o:Order {id: row.order_id})
  ON CREATE SET o.date = row.order_date, o.sales = row.sales, o.profit = row.order_profit,
                o.late_risk = row.late_delivery_risk, o.real_shipping_days = row.real_shipping_days
MERGE (d:Department {name: row.department_name})
MERGE (p:Product {id: row.product_id})
  ON CREATE SET p.category = row.product_category
MERGE (c)-[:PLACED]->(o)
MERGE (o)-[:CONTAINS {quantity: row.order_item_quantity, discount: row.order_item_discount_rate}]->(p)
MERGE (p)-[:BELONGS_TO]->(d)
```

---

## 4. COMPLETE API REFERENCE TABLE

The backend exposes **13 endpoints** across 10 functional domains. All routes are authenticated openly (`None`) with CORS enabled.

| Endpoint | Method | Source Router File | Purpose | Input Parameters / Body | Output Data | Auth |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | `health.py` | Platform root health & architecture manifest | None | Architecture manifest JSON | None |
| `/api/health` | `GET` | `health.py` | Health probe & engine state | None | Subsystem status dictionary | None |
| `/api/dashboard` | `GET` | `dashboard.py` | Executive KPIs, monthly trends, & risk data | None | Financial KPIs, monthly series, activity | None |
| `/api/activity` | `GET` | `dashboard.py` | Platform live subsystem activity events | None | Event telemetry list | None |
| `/api/data/profile` | `GET` | `data.py` | Active dataset metadata summary | None | Row counts, date bounds, revenue total | None |
| `/api/data/upload` | `POST` | `data.py` | Upload custom CSV or Excel dataset | `file: UploadFile` (Multipart) | Upload confirmation & row count | None |
| `/api/data/reset` | `POST` | `data.py` | Reset dataset back to DataCo default | None | Reset status confirmation | None |
| `/api/v1/stream/start` | `POST` | `stream.py` | Start background streaming worker | `interval: float`, `limit: int` (Query) | Task started confirmation | None |
| `/api/v1/stream/stop` | `POST` | `stream.py` | Stop background streaming worker | None | Task paused confirmation | None |
| `/api/v1/stream/buffer`| `GET` | `stream.py` | Retrieve recent streaming transactions | `limit: int = 25` (Query) | List of recent transaction objects | None |
| `/api/v1/stream/stats` | `GET` | `stream.py` | Ingestion throughput & status | None | Records ingested, events/sec | None |
| `/api/graph` | `GET` | `graph.py` | 5-tier heterogeneous graph topology | `limit: int = 10` (Query) | Nodes list, edges list, GNN AUC | None |
| `/api/forecast` | `GET` | `forecast.py` | TFT quantile forecast timeline | `target: str = "future_cash_flow"` (Query)| Quantile timeline (P10, P50, P90) | None |
| `/api/causal/evaluate`| `POST` | `causal.py` | Evaluate Pearl's Do-Calculus intervention | `ScenarioInput` (JSON Body) | Baseline, counterfactual delta, cash flow | None |
| `/api/assistant/graphrag`| `POST` | `assistant.py` | GraphRAG strategic conversational query | `AssistantQuestion` (JSON Body) | Answer, citations, extracted entities | None |
| `/api/translation/translate`| `POST`| `translation.py`| Domain-preserving Indic localization | `TranslationRequest` (JSON Body) | Translated text, script, acronyms | None |
| `/api/models/benchmarks`| `GET` | `models.py` | Comparative DL time-series metrics | `target: str = "revenue"` (Query) | Model benchmark records table | None |

---

## 5. DETAILED REQUEST & RESPONSE PAYLOAD SAMPLES

### 1. Causal Evaluation: `POST /api/causal/evaluate`

#### Request Payload:
```json
{
  "marketing_change_pct": 20.0,
  "price_change_pct": -5.0,
  "demand_change_pct": 0.0,
  "supplier_delay_days": -3,
  "inventory_buffer_pct": 10.0,
  "hiring_delta": 2
}
```

#### Response Payload (HTTP 200 OK):
```json
{
  "engine": "Pearl's Do-Calculus Structural Causal Model (SCM)",
  "intervention": {
    "do_marketing": "+20.0%",
    "do_price": "-5.0%",
    "do_supplier_delay": "-3 days",
    "do_inventory_buffer": "10.0%",
    "do_hiring": "2 personnel"
  },
  "baseline": {
    "revenue": 1050000.0,
    "operating_cost": 924000.0,
    "profit": 126000.0,
    "margin_pct": 12.0,
    "demand_units": 11500.0
  },
  "scenario": {
    "revenue": 1184025.0,
    "operating_cost": 986280.0,
    "profit": 197745.0,
    "margin_pct": 16.7,
    "estimated_demand_units": 13110.0
  },
  "delta": {
    "revenue": 134025.0,
    "operating_cost": 62280.0,
    "profit": 71745.0,
    "revenue_change_pct": 12.76,
    "profit_change_pct": 56.94
  },
  "cash_flow_projection": {
    "weeks": ["W+1", "W+2", "W+3", "W+4", "W+5", "W+6"],
    "baseline_cash_flow": [126000.0, 128520.0, 131090.4, 133712.2, 136386.4, 139114.1],
    "counterfactual_cash_flow": [197745.0, 204666.1, 211832.4, 219249.5, 226923.2, 234858.5]
  },
  "explainable_causal_pathway": [
    "1. Intervention do(Marketing=20.0%, Price=-5.0%) applied to root nodes.",
    "2. Causal graph propagation: Marketing uplifts Customer Conversion (+16.4%), Price elasticity adjusts Demand (+2.2%).",
    "3. Fulfillment constraint: Supplier delay of -3 days introduces 0.0% operational overhead.",
    "4. Counterfactual outcome: Net Revenue shifts by +12.8%, Profit margin settles at 16.7%.",
    "5. Confidence: 92.4% (Based on Pearl's Backdoor Criterion and historical DataCo bounds)."
  ],
  "currency": "USD"
}
```

---

### 2. GraphRAG Assistant: `POST /api/assistant/graphrag`

#### Request Payload:
```json
{
  "question": "What are our primary delivery bottlenecks?",
  "context_filter": "all"
}
```

#### Response Payload (HTTP 200 OK):
```json
{
  "engine": "GraphRAG Grounded Strategic Agent",
  "question": "What are our primary delivery bottlenecks?",
  "answer": "GNN Multi-Hop Causal Bottleneck Pathway: Standard Carrier logistics generates 54.8% late delivery risk on Consumer category orders (Cleats, Men's Footwear), driving $1.24M in cumulative SLA delay penalties and suppressing net operating margin to 10.8%. GNN holdout link prediction achieves AUC 0.942, isolating Standard Carrier routing as the primary causal vulnerability.",
  "grounded_citations": [
    "[GNN Heterogeneous Link Prediction: AUC 0.942]",
    "[5-Tier Semantic DAG: Consumer -> Cleats -> Central DC -> Standard Fleet -> Late Risk -> SLA Penalties]",
    "[Financial Impact Vector: -$1.24M Drag on Operating Margin]"
  ],
  "suggested_scenario": "Simulate shifting 25% of Standard Carrier volume to First Class Express in Causal AI Sandbox.",
  "reasoning_mode": "Multi-Hop Knowledge Graph + TFT Deep Forecast + Causal DAG Verification",
  "extracted_entities": [
    {"entity": "CustomerSegment:Consumer", "type": "Demand Root", "val": "60% Order Vol"},
    {"entity": "Category:Cleats & Footwear", "type": "Product Line", "val": "$7.32M Sales"},
    {"entity": "Logistics:Standard Carrier Fleet", "type": "Freight Mode", "val": "63% Freight"},
    {"entity": "FulfillmentStatus:Late Delivery Risk", "type": "Delay Bottleneck", "val": "54.8% Delay"},
    {"entity": "FinancialOutcome:SLA Delay Penalties", "type": "Cost Drag", "val": "-$1.24M Penalty"}
  ],
  "suggested_intervention_params": {
    "supplier_delay": -3,
    "marketing_change": 15,
    "price_change": 0
  },
  "faithfulness_score": 0.98,
  "retrieval_latency_ms": 18
}
```

---

### 3. Executive Translation: `POST /api/translation/translate`

#### Request Payload:
```json
{
  "text": "TFT projects demand will increase 14.8% next quarter, reaching $36.78M gross revenue.",
  "target_language": "Hindi"
}
```

#### Response Payload (HTTP 200 OK):
```json
{
  "status": "success",
  "source_text": "TFT projects demand will increase 14.8% next quarter, reaching $36.78M gross revenue.",
  "translated_text": "टेम्पोरल फ्यूजन ट्रांसफार्मर (TFT) तीसरी तिमाही में मांग 14.8% बढ़ने का अनुमान लगाता है, जिससे कुल सकल राजस्व $36.78M तक पहुंच जाएगा...",
  "target_language": "Hindi",
  "language_script": "Devanagari (देवनागरी)",
  "regional_hub": "North & Central India / NCR Commercial Belt",
  "target_hubs": "Delhi-NCR, Mumbai, UP, Rajasthan, MP SMBs",
  "fidelity_score": 0.98,
  "mode": "Domain-Preserving Executive Hindi Localization",
  "preservation_status": "Financial & Supply Chain Acronyms 100% Preserved",
  "preserved_acronyms": ["TFT"],
  "word_count": 13,
  "char_count": 84
}
```
