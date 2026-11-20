import io
import json
import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import ACTIVE_PATH, MAX_UPLOAD_BYTES, META_PATH
from app.services.data_service import (
    _normalize,
    _read_csv_bytes,
    clear_data_cache,
    get_data_profile,
)

router = APIRouter(tags=["Dataset Management"])

@router.get("/api/data/profile")
def profile():
    return get_data_profile()

@router.post("/api/data/upload")
async def upload_dataset(file: UploadFile = File(...)):
    filename = (file.filename or "dataset.csv").lower()
    if not filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(400, "Upload a CSV or Excel file.")
    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "File exceeds 150 MB maximum size.")
    try:
        if filename.endswith(".csv"):
            df = _read_csv_bytes(raw)
        else:
            df = pd.read_excel(io.BytesIO(raw))
        normalized = _normalize(df, source_name=file.filename or "Uploaded Dataset")
        ACTIVE_PATH.write_bytes(raw)
        META_PATH.write_text(json.dumps({"filename": file.filename, "uploaded_at": pd.Timestamp.utcnow().isoformat()}, indent=2))
        clear_data_cache()
    except Exception as exc:
        raise HTTPException(400, f"Could not parse dataset: {exc}") from exc
    return {
        "message": "Dataset uploaded and integrated into Digital Twin pipeline",
        "filename": file.filename,
        "rows": int(len(normalized)),
        "profile": get_data_profile(),
    }

@router.post("/api/data/reset")
def reset_dataset():
    try:
        ACTIVE_PATH.unlink(missing_ok=True)
        META_PATH.unlink(missing_ok=True)
        clear_data_cache()
    except Exception as exc:
        raise HTTPException(400, f"Reset error: {exc}") from exc
    return {"message": "Reset to default DataCo Supply Chain dataset."}
