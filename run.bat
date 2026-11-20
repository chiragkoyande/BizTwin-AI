@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Digital Twin for Small Businesses - One-Click Launcher

echo ======================================================================
echo   AI-POWERED DIGITAL TWINS FOR SMALL BUSINESSES
echo   Enterprise Multi-Modal GNN, TFT Deep Forecast & Causal AI Platform
echo ======================================================================
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 1: Verify Prerequisites (Python & Node.js)
:: ─────────────────────────────────────────────────────────────────────────────
echo [1/5] Verifying system prerequisites...

set "PYTHON_BIN="
python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_BIN=python"
) else (
    py -3 --version >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_BIN=py -3"
    )
)

if "%PYTHON_BIN%"=="" (
    echo.
    echo [ERROR] Python 3.10+ is not detected on your system or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo IMPORTANT: During Python installation, make sure to check:
    echo            "[X] Add python.exe to PATH"
    echo.
    echo After installing, restart this script.
    echo ======================================================================
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not detected on your system or not in PATH!
    echo.
    echo Please install Node.js (LTS recommended) from: https://nodejs.org/
    echo.
    echo After installing, restart this script.
    echo ======================================================================
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] npm package manager is not detected!
    echo Please reinstall Node.js from https://nodejs.org/
    echo ======================================================================
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('%PYTHON_BIN% --version 2^>^&1') do set "PY_VER=%%v"
for /f "tokens=*" %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
for /f "tokens=*" %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"

echo   [OK] Detected Python : %PY_VER%
echo   [OK] Detected Node.js: %NODE_VER%
echo   [OK] Detected npm    : v%NPM_VER%
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 2: Set up Python Virtual Environment & Install Backend Dependencies
:: ─────────────────────────────────────────────────────────────────────────────
echo [2/5] Setting up Python virtual environment (.venv)...

set "ROOT_DIR=%~dp0"
set "VENV_DIR=%ROOT_DIR%.venv"

if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo   Creating isolated Python virtual environment in .venv ...
    %PYTHON_BIN% -m venv "%VENV_DIR%"
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo   [OK] Virtual environment created successfully.
) else (
    echo   [OK] Existing virtual environment found.
)

echo.
echo [3/5] Installing Backend dependencies from backend\requirements.txt ...
call "%VENV_DIR%\Scripts\activate.bat"
python -m pip install --upgrade pip --quiet
pip install -r "%ROOT_DIR%backend\requirements.txt"
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies.
    echo Please check your internet connection and permissions.
    pause
    exit /b 1
)
echo   [OK] All backend Python dependencies installed and verified.
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 3: Install Frontend Node Dependencies
:: ─────────────────────────────────────────────────────────────────────────────
echo [4/5] Installing Frontend dependencies (npm install)...
cd /d "%ROOT_DIR%frontend\biztwin-frontend"

if not exist "node_modules\" (
    echo   Downloading and installing packages from npm registry (A to Z)...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies.
        cd /d "%ROOT_DIR%"
        pause
        exit /b 1
    )
    echo   [OK] Frontend node_modules installed successfully.
) else (
    echo   node_modules folder detected. Verifying dependencies...
    call npm install --no-audit --no-fund --prefer-offline
    echo   [OK] Frontend dependencies verified.
)

cd /d "%ROOT_DIR%"
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 4: Ensure Environment Configuration
:: ─────────────────────────────────────────────────────────────────────────────
if not exist "%ROOT_DIR%backend\.env" (
    if exist "%ROOT_DIR%backend\.env.example" (
        copy "%ROOT_DIR%backend\.env.example" "%ROOT_DIR%backend\.env" >nul
        echo   [INFO] Initialized backend\.env configuration.
    )
)

:: Free ports if any lingering old process is active
call "%ROOT_DIR%stop.bat" >nul 2>&1

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 5: Launch Services & Open Browser
:: ─────────────────────────────────────────────────────────────────────────────
echo [5/5] Launching Digital Twin Platform Services...
echo.

echo   Starting Backend API (FastAPI + Uvicorn on http://127.0.0.1:8000)...
start "Digital Twin - Backend API" cmd /k "title Digital Twin - Backend API && cd /d ""%ROOT_DIR%backend"" && call ""%VENV_DIR%\Scripts\activate.bat"" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo   Starting Frontend UI (Vite on http://localhost:5173)...
start "Digital Twin - Frontend UI" cmd /k "title Digital Twin - Frontend UI && cd /d ""%ROOT_DIR%frontend\biztwin-frontend"" && npm run dev"

echo.
echo ======================================================================
echo   DIGITAL TWIN FOR SMALL BUSINESSES IS NOW RUNNING!
echo ======================================================================
echo.
echo   • Frontend Application : http://localhost:5173
echo   • FastAPI Backend API  : http://127.0.0.1:8000
echo   • Interactive API Docs : http://127.0.0.1:8000/docs
echo   • Subsystem Health     : http://127.0.0.1:8000/api/health
echo.
echo   Waiting 4 seconds to open your default web browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ----------------------------------------------------------------------
echo   HOW TO SHUT DOWN:
echo   Press [ENTER] in this window at any time to safely terminate
echo   both the backend and frontend servers.
echo ----------------------------------------------------------------------
echo.
pause

echo.
echo Shutting down services...
call "%ROOT_DIR%stop.bat"
echo Goodbye!
timeout /t 2 /nobreak >nul
exit /b 0
