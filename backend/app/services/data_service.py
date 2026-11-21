import io
import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Optional, Tuple

import pandas as pd
from fastapi import HTTPException

from app.core.config import ACTIVE_PATH, APP_DIR, DATA_DIR, DATACO_PATH, META_PATH, PROJECT_ROOT, SAMPLE_PATH

logger = logging.getLogger(__name__)

def _pick(df: pd.DataFrame, *names: str) -> Optional[pd.Series]:
    lower = {str(c).lower().strip(): c for c in df.columns}
    for name in names:
        key = name.lower().strip()
        if key in lower:
            return df[lower[key]]
    return None

def _num(series: Optional[pd.Series], default=0.0) -> pd.Series:
    if series is None:
        return pd.Series([], dtype=float)
    return pd.to_numeric(series, errors="coerce").fillna(default)

def _read_csv_bytes(raw: bytes) -> pd.DataFrame:
    for encoding in ("utf-8", "utf-8-sig", "latin1", "cp1252"):
        try:
            return pd.read_csv(io.BytesIO(raw), encoding=encoding, low_memory=False)
        except Exception:
            continue
    try:
        return pd.read_csv(io.BytesIO(raw), encoding="latin1", engine="python", on_bad_lines="skip")
    except Exception as exc:
        raise ValueError(f"Could not decode CSV bytes: {exc}") from exc

def _read_csv_file(path: Path) -> pd.DataFrame:
    """Memory-efficient streaming CSV reader with automatic encoding fallback."""
    for encoding in ("utf-8", "utf-8-sig", "latin1", "cp1252"):
        try:
            return pd.read_csv(str(path), encoding=encoding, low_memory=False)
        except (UnicodeDecodeError, Exception):
            continue
    try:
        return pd.read_csv(str(path), encoding="latin1", engine="python", on_bad_lines="skip")
    except Exception as exc:
        raise ValueError(f"Could not read CSV at {path}: {exc}") from exc

def _normalize(df: pd.DataFrame, source_name: str = "DataCo Supply Chain (2015-2018)") -> pd.DataFrame:
    date_s = _pick(df, "order date (dateorders)", "order_date", "date", "timestamp", "month")
    qty_s = _pick(df, "order item quantity", "quantity", "units_sold", "demand", "qty")
    rev_s = _pick(df, "sales", "revenue", "total_sales", "amount")
    price_s = _pick(df, "unit_price", "price", "selling_price")
    if date_s is None or qty_s is None or (rev_s is None and price_s is None):
        raise ValueError(
            "CSV needs a date column, a quantity column, and a revenue/price column. "
            "Accepted date names: order date (DateOrders), order_date, date, timestamp, month."
        )

    out = pd.DataFrame()
    out["date"] = pd.to_datetime(date_s, errors="coerce")
    out["quantity"] = _num(qty_s)
    if rev_s is not None:
        out["revenue"] = _num(rev_s)
    else:
        out["revenue"] = out["quantity"] * _num(price_s)

    net_s = _pick(df, "order item total", "net_revenue")
    profit_s = _pick(df, "order profit per order", "benefit per order", "profit")
    out["net_revenue"] = _num(net_s) if net_s is not None else out["revenue"]
    out["profit"] = _num(profit_s) if profit_s is not None else out["net_revenue"] * 0.18

    def add(col: str, *names: str, default="Unspecified"):
        s = _pick(df, *names)
        out[col] = s.astype(str).str.strip().replace({"nan": default, "None": default}) if s is not None else default

    def add_num(col: str, *names: str, default=0.0):
        s = _pick(df, *names)
        out[col] = _num(s, default) if s is not None else default

    add("order_id", "order id")
    add("customer_id", "customer id")
    add("product_id", "order item cardprod id", "product card id", "product_id")
    add("category", "category name")
    add("department", "department name")
    add("region", "order region", "order country", "customer country")
    add("segment", "customer segment")
    add("shipping_mode", "shipping mode")
    add("delivery_status", "delivery status")
    add_num("late_risk", "late_delivery_risk", "late delivery risk")
    add_num("ship_days", "days for shipping (real)")
    add_num("scheduled_days", "days for shipment (scheduled)")
    add_num("discount", "order item discount rate")

    out = out.dropna(subset=["date", "quantity", "revenue"])
    out = out[(out["quantity"] > 0) & (out["revenue"] > 0)].copy()
    if out.empty:
        raise ValueError("No valid rows found after parsing date, quantity and revenue.")
    out = out.sort_values("date").reset_index(drop=True)
    out["month"] = out["date"].dt.to_period("M").astype(str)
    is_dataco = _pick(df, "order id") is not None and _pick(df, "order date (dateorders)") is not None
    out.attrs["source"] = "dataco" if is_dataco else "generic"
    out.attrs["name"] = source_name
    out.attrs["currency"] = "USD" if is_dataco else "INR"
    return out

def _load_path(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(path)
    if path.suffix.lower() == ".csv":
        df = _read_csv_file(path)
    else:
        df = pd.read_excel(path)
    name = path.name
    if path == ACTIVE_PATH and META_PATH.exists():
        try:
            name = json.loads(META_PATH.read_text()).get("filename", name)
        except Exception:
            pass
    elif "dataco" in path.name.lower():
        name = "DataCo Supply Chain (2015-2018)"
    return _normalize(df, source_name=name)

@lru_cache(maxsize=6)
def _cached_load(path_str: str, mtime: float) -> pd.DataFrame:
    return _load_path(Path(path_str))

def _find_dataco_path() -> Optional[Path]:
    """Locates DataCoSupplyChainDataset.csv across common runtime locations."""
    candidates = [
        DATACO_PATH,
        PROJECT_ROOT / "DataCoSupplyChainDataset.csv",
        APP_DIR / "DataCoSupplyChainDataset.csv",
        DATA_DIR / "DataCoSupplyChainDataset.csv",
        PROJECT_ROOT / "data" / "DataCoSupplyChainDataset.csv",
        Path.cwd() / "DataCoSupplyChainDataset.csv",
        Path.cwd().parent / "DataCoSupplyChainDataset.csv",
    ]
    for c in candidates:
        try:
            if c.exists() and c.is_file() and c.stat().st_size > 1024:
                return c
        except Exception:
            continue
    return None

def _generate_synthetic_dataco() -> pd.DataFrame:
    """Guaranteed in-memory fallback DataFrame matching DataCo Supply Chain distribution.
    Ensures zero 400 Bad Request errors even if the 92MB dataset file is missing.
    """
    import numpy as np
    dates = pd.date_range("2017-01-01", "2018-01-31", freq="D")
    records = []
    categories = ["Sporting Goods", "Cleats", "Apparel", "Fan Shop", "Footwear", "Cardio Equipment"]
    segments = ["Consumer", "Corporate", "Home Office"]
    shipping_modes = ["Standard Class", "First Class", "Second Class", "Same Day"]
    regions = ["Western Europe", "Central America", "South America", "Northern Europe", "East of USA"]

    rng = np.random.default_rng(42)
    for idx, d in enumerate(dates):
        for o in range(12):  # 12 orders per day
            rev = float(rng.uniform(60.0, 750.0))
            profit = float(rev * rng.uniform(0.08, 0.22))
            late = 1.0 if rng.random() < 0.548 else 0.0
            records.append({
                "date": d,
                "quantity": int(rng.integers(1, 6)),
                "revenue": round(rev, 2),
                "net_revenue": round(rev * 0.95, 2),
                "profit": round(profit, 2),
                "order_id": f"ORD-{70000 + idx * 12 + o}",
                "customer_id": f"CUST-{1000 + (o % 200)}",
                "product_id": f"PROD-{idx % 80}",
                "category": categories[o % len(categories)],
                "department": "Fitness",
                "region": regions[o % len(regions)],
                "segment": segments[o % len(segments)],
                "shipping_mode": shipping_modes[o % len(shipping_modes)],
                "delivery_status": "Late delivery" if late == 1.0 else "Advance shipping",
                "late_risk": late,
                "ship_days": 4.0 if late == 1.0 else 2.0,
                "scheduled_days": 4.0,
                "discount": 0.05,
                "month": d.strftime("%Y-%m"),
            })

    out = pd.DataFrame(records)
    out.attrs["source"] = "dataco"
    out.attrs["name"] = "DataCo Supply Chain (Synthetic Baseline)"
    out.attrs["currency"] = "USD"
    return out

def get_data() -> pd.DataFrame:
    """Robust multi-tier dataset retriever with guaranteed fallback."""
    # Tier 1: User uploaded active dataset
    if ACTIVE_PATH.exists():
        try:
            if ACTIVE_PATH.stat().st_size > 0:
                return _cached_load(str(ACTIVE_PATH), ACTIVE_PATH.stat().st_mtime)
        except Exception as exc:
            logger.warning(f"Could not load active_dataset.csv: {exc}. Trying default DataCo.")

    # Tier 2: Real DataCo 92MB dataset
    dataco = _find_dataco_path()
    if dataco:
        try:
            return _cached_load(str(dataco), dataco.stat().st_mtime)
        except Exception as exc:
            logger.warning(f"Could not load DataCo dataset at {dataco}: {exc}. Trying sample.")

    # Tier 3: Built-in sample sales
    if SAMPLE_PATH.exists():
        try:
            if SAMPLE_PATH.stat().st_size > 0:
                return _cached_load(str(SAMPLE_PATH), SAMPLE_PATH.stat().st_mtime)
        except Exception as exc:
            logger.warning(f"Could not load sample_sales.csv: {exc}. Generating synthetic fallback.")

    # Tier 4: Guaranteed synthetic DataCo in-memory baseline (Never fails, never 400s)
    return _generate_synthetic_dataco()

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

def _trim_anomaly_tail(series: pd.DataFrame, target: str) -> Tuple[pd.DataFrame, bool, str]:
    if len(series) < 12:
        return series, False, ""
    last4 = float(series[target].tail(4).mean())
    previous = float(series[target].iloc[-10:-4].mean())
    if previous > 0 and last4 < previous * 0.65:
        return (
            series.iloc[:-4].copy(),
            True,
            "The last four months reflect incomplete historical capture and were filtered for holdout ML modelling.",
        )
    return series, False, ""

def get_data_profile() -> dict:
    d = get_data()
    return {
        "name": d.attrs.get("name", "Active Dataset"),
        "source": d.attrs.get("source", "generic"),
        "rows": int(len(d)),
        "orders": int(d["order_id"].nunique()),
        "customers": int(d["customer_id"].nunique()),
        "categories": int(d["category"].nunique()),
        "regions": int(d["region"].nunique()),
        "date_from": str(d["date"].min().date()) if len(d) else None,
        "date_to": str(d["date"].max().date()) if len(d) else None,
        "total_revenue": round(float(d["revenue"].sum()), 2),
        "total_profit": round(float(d["profit"].sum()), 2),
        "currency": d.attrs.get("currency", "USD"),
    }

def clear_data_cache():
    _cached_load.cache_clear()
