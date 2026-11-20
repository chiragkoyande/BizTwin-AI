# Digital Twin for Small Businesses — Client Quickstart Guide

An enterprise-scale platform powered by Multi-Modal Graph Neural Networks (GNN), Temporal Fusion Transformers (TFT), and Pearl's Counterfactual Structural Causal Models (SCM).

---

## ⚡ One-Click Startup (Windows)

To start the entire application from scratch with automated dependency installation:

1. **Double-click `run.bat`** (or `start.bat`) in the root project folder.
2. The launcher will automatically:
   * Verify that **Python 3.10+** and **Node.js** are installed.
   * Create an isolated Python virtual environment (`.venv`).
   * Download and install all backend Python packages (`pip install -r backend/requirements.txt`).
   * Download and install all frontend packages (`npm install`).
   * Launch the **FastAPI Backend Server** on `http://127.0.0.1:8000`.
   * Launch the **Vite React Frontend** on `http://localhost:5173`.
   * Open your default web browser directly to `http://localhost:5173`.

### To Shut Down:
* Press `[ENTER]` in the launcher command window, or double-click **`stop.bat`** to cleanly terminate both servers and release the ports.

---

## 🍎 One-Click Startup (macOS / Linux)

For macOS or Linux users:

```bash
chmod +x run.sh stop.sh
./run.sh
```

To stop:
```bash
./stop.sh
```

---

## 📋 System Prerequisites

Before running the project for the first time, ensure your computer has:

| Tool | Minimum Version | Download Link | Notes |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10+ | [python.org/downloads](https://www.python.org/downloads/) | **Important**: Check the box **"Add python.exe to PATH"** during installation. |
| **Node.js** | 18+ (LTS) | [nodejs.org](https://nodejs.org/) | Standard installation includes `npm`. |

---

## 🌐 Platform Service URLs

Once running, the following endpoints are live:

* **Executive Frontend Cockpit**: [http://localhost:5173](http://localhost:5173)
* **Backend API Root**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Interactive Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Alternative ReDoc API Docs**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
* **Subsystem Health Status**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

## 🧩 Architectural Modules

1. **Ingestion Stream**: Live DataCo Supply Chain transaction ingestion & streaming buffer.
2. **Semantic Graph**: 5-Tier Heterogeneous DAG and Graph Neural Network (GNN) link prediction.
3. **TFT Forecasting**: Multi-horizon quantile forecasting (P10, P50, P90) with Variable Selection Networks (VSN).
4. **Causal AI Sandbox**: Pearl's Do-Calculus Structural Causal Model (SCM) counterfactual simulation.
5. **GraphRAG Assistant**: Multi-hop grounded strategic conversational AI with instant citations.
6. **Executive Translation**: High-precision multilingual briefing generator supporting 5 Indic dialects.
7. **Model Lab & Benchmarks**: Comparative evaluation of TFT against 7 deep-learning time-series models.
8. **Data Management**: Upload, preview, and reset supply chain datasets (up to 150MB).
9. **Settings**: Executive profile identity customizer and backend port binder.

---

## 🛠️ Troubleshooting

* **Port 8000 or 5173 Already in Use?**
  Double-click `stop.bat` to terminate any orphaned background process, then run `run.bat` again.

* **Python Command Not Found?**
  Re-run the Python installer, choose **Modify**, and check **"Add Python to environment variables / PATH"**.

* **Need to Reset the Active Dataset?**
  Navigate to **Data Management** in the UI and click **"Reset to Default DataCo Dataset"**, or call `POST http://127.0.0.1:8000/api/data/reset`.
