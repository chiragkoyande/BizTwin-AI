from pathlib import Path

# Paths configuration
APP_DIR = Path(__file__).resolve().parent.parent.parent
PROJECT_ROOT = APP_DIR.parent
DATA_DIR = APP_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

ACTIVE_PATH = DATA_DIR / "active_dataset.csv"
META_PATH = DATA_DIR / "active_meta.json"
SAMPLE_PATH = DATA_DIR / "sample_sales.csv"
DATACO_PATH = PROJECT_ROOT / "DataCoSupplyChainDataset.csv"
FORECAST_CACHE_PATH = PROJECT_ROOT / "forecast_cache.json"

MAX_UPLOAD_BYTES = 150 * 1024 * 1024

class Settings:
    PROJECT_NAME: str = "Digital Twin for Small Businesses Platform"
    VERSION: str = "2.5.0"
    DESCRIPTION: str = (
        "Multi-Modal Graph Neural Networks, Temporal Fusion Transformer (TFT), "
        "and Pearl's Counterfactual AI Platform for Small Businesses."
    )
    CORS_ORIGINS: list = ["*"]

settings = Settings()
