import asyncio
from datetime import datetime
import os
from typing import List, Optional
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field

app = FastAPI(
    title="DataCo Multi-Modal Ingestion & Graph Feeder",
    description="Phase 1: Validated streaming connected to Neo4j and Causal/TFT ML pipelines.",
    version="1.1.0"
)

# Enable CORS so your future React / Next.js webapp can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE_PATH = os.getenv("DATACO_CSV_PATH", "DataCoSupplyChainDataset.csv")
if not os.path.exists(CSV_FILE_PATH):
    parent_candidate = os.path.join(os.path.dirname(__file__), "..", "DataCoSupplyChainDataset.csv")
    if os.path.exists(parent_candidate):
        CSV_FILE_PATH = os.path.abspath(parent_candidate)
INGESTED_BUFFER: List[dict] = []
IS_STREAMING = False

# ---------------------------------------------------------
# 1. UPDATED PYDANTIC SCHEMA (Added 3 fields for Causal & Graph)
# ---------------------------------------------------------
class DataCoTransactionSchema(BaseModel):
    order_id: int
    order_date: datetime
    customer_id: int
    customer_segment: str
    customer_country: str
    product_id: int
    product_category: str
    department_name: str
    order_item_quantity: int = Field(..., gt=0)
    sales: float = Field(..., gt=0)
    order_profit: float
    order_item_discount_rate: float = Field(..., ge=0.0, le=1.0)
    real_shipping_days: int = Field(..., ge=0)
    scheduled_shipping_days: int = Field(..., ge=0)
    late_delivery_risk: int = Field(..., ge=0, le=1)

# ---------------------------------------------------------
# 2. DATA CLEANING PIPELINE
# ---------------------------------------------------------
class DataCoPipeline:
    @staticmethod
    def load_and_clean_data(file_path: str, sample_size: Optional[int] = None) -> pd.DataFrame:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File '{file_path}' not found.")

        cols_to_use = [
            'Order Id', 'order date (DateOrders)', 'Customer Id', 'Customer Segment', 
            'Customer Country', 'Order Item Cardprod Id', 'Category Name', 'Department Name',
            'Order Item Quantity', 'Sales', 'Order Profit Per Order', 'Order Item Discount Rate',
            'Days for shipping (real)', 'Days for shipment (scheduled)', 'Late_delivery_risk'
        ]

        df = pd.read_csv(file_path, encoding='latin1', usecols=cols_to_use)
        df = df.dropna(subset=['Order Id', 'Customer Id', 'Order Item Cardprod Id', 'order date (DateOrders)']).copy()

        df.rename(columns={
            'Order Id': 'order_id',
            'order date (DateOrders)': 'order_date',
            'Customer Id': 'customer_id',
            'Customer Segment': 'customer_segment',
            'Customer Country': 'customer_country',
            'Order Item Cardprod Id': 'product_id',
            'Category Name': 'product_category',
            'Department Name': 'department_name',
            'Order Item Quantity': 'order_item_quantity',
            'Sales': 'sales',
            'Order Profit Per Order': 'order_profit',
            'Order Item Discount Rate': 'order_item_discount_rate',
            'Days for shipping (real)': 'real_shipping_days',
            'Days for shipment (scheduled)': 'scheduled_shipping_days',
            'Late_delivery_risk': 'late_delivery_risk'
        }, inplace=True)

        df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
        df = df.dropna(subset=['order_date']).sort_values(by='order_date').reset_index(drop=True)

        for col in ['sales', 'order_profit', 'order_item_discount_rate']:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)

        for col in ['order_item_quantity', 'real_shipping_days', 'scheduled_shipping_days', 'late_delivery_risk']:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

        df = df[df['sales'] > 0]
        return df.head(sample_size) if sample_size else df

# ---------------------------------------------------------
# 3. STREAMING WORKER
# ---------------------------------------------------------
async def stream_dataco_worker(interval: float, sample_size: int):
    global IS_STREAMING
    try:
        cleaned_df = DataCoPipeline.load_and_clean_data(CSV_FILE_PATH, sample_size=sample_size)
    except Exception as e:
        print(f"[ERROR] Loading failed: {e}")
        IS_STREAMING = False
        return

    print(f"[*] Live ingestion running: streaming {len(cleaned_df)} transactions...")

    for _, row in cleaned_df.iterrows():
        if not IS_STREAMING:
            break

        try:
            validated = DataCoTransactionSchema(**row.to_dict())
            serialized = validated.model_dump()
            serialized['order_date'] = serialized['order_date'].isoformat()
            
            INGESTED_BUFFER.append(serialized)

            print(f"[STREAM EVENT] Order #{serialized['order_id']} | "
                  f"Cust #{serialized['customer_id']} ({serialized['customer_segment']}) -> "
                  f"Product #{serialized['product_id']} | Sales: ${serialized['sales']:.2f}")
        except Exception as err:
            print(f"[REJECTED] Validation failure: {err}")

        await asyncio.sleep(interval)

    IS_STREAMING = False
    print("[✓] Streaming sequence finished.")

# ---------------------------------------------------------
# 4. CONTROLLER ENDPOINTS
# ---------------------------------------------------------
@app.get("/api/v1/health")
def health_status():
    return {
        "status": "online",
        "dataset_found": os.path.exists(CSV_FILE_PATH),
        "total_records_ingested": len(INGESTED_BUFFER)
    }

@app.post("/api/v1/stream/start")
async def start_stream(background_tasks: BackgroundTasks, interval: float = 0.5, limit: int = 50):
    global IS_STREAMING
    if IS_STREAMING:
        raise HTTPException(status_code=400, detail="Stream is already active.")
    IS_STREAMING = True
    background_tasks.add_task(stream_dataco_worker, interval, limit)
    return {"status": "streaming_started", "interval_seconds": interval, "records_limit": limit}

@app.post("/api/v1/stream/stop")
async def stop_stream():
    global IS_STREAMING
    IS_STREAMING = False
    return {"status": "streaming_stopped", "records_in_buffer": len(INGESTED_BUFFER)}

@app.get("/api/v1/stream/buffer")
def get_buffer(limit: int = 10):
    return {"buffer_size": len(INGESTED_BUFFER), "recent_records": INGESTED_BUFFER[-limit:]}

# Aggregated data endpoint for the complex forecasting timeline
@app.get("/api/v1/data/timeseries")
def get_timeseries_aggregated():
    df = DataCoPipeline.load_and_clean_data(CSV_FILE_PATH, sample_size=3000)
    df.set_index('order_date', inplace=True)
    weekly = df.resample('W').agg({
        'sales': 'sum',
        'order_profit': 'sum',
        'order_item_quantity': 'sum',
        'late_delivery_risk': 'mean'
    }).reset_index()
    weekly['order_date'] = weekly['order_date'].dt.strftime('%Y-%m-%d')
    return weekly.to_dict(orient="records")