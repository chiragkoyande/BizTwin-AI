import io
import json
from functools import lru_cache
from pathlib import Path
from typing import Optional, Tuple

import pandas as pd
from fastapi import HTTPException

from app.core.config import ACTIVE_PATH, DATACO_PATH, META_PATH, SAMPLE_PATH

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
    for encoding in ("utf-8", "utf-8-sig", "latin1"):
        try:
            return pd.read_csv(io.BytesIO(raw), encoding=encoding, low_memory=False)
        except UnicodeDecodeError:
            continue
    raise ValueError("Could not decode CSV. Use UTF-8 or Latin-1 encoding.")

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
        raw = path.read_bytes()
        df = _read_csv_bytes(raw)
    else:
        df = pd.read_excel(path)
    name = path.name
    if path == ACTIVE_PATH and META_PATH.exists():
        try:
            name = json.loads(META_PATH.read_text()).get("filename", name)
        except Exception:
            pass
    elif path == DATACO_PATH:
        name = "DataCo Supply Chain (2015-2018)"
    return _normalize(df, source_name=name)

@lru_cache(maxsize=6)
def _cached_load(path_str: str, mtime: float) -> pd.DataFrame:
    return _load_path(Path(path_str))

def get_data() -> pd.DataFrame:
    if ACTIVE_PATH.exists():
        path = ACTIVE_PATH
    elif DATACO_PATH.exists():
        path = DATACO_PATH
    elif SAMPLE_PATH.exists():
        path = SAMPLE_PATH
    else:
        raise HTTPException(400, "No dataset available. Upload a CSV first.")
    try:
        return _cached_load(str(path), path.stat().st_mtime)
    except Exception as exc:
        raise HTTPException(400, f"Could not load dataset: {exc}") from exc

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
