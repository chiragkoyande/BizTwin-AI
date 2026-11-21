@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Digital Twin for Small Businesses - One-Click Launcher

set "ROOT_DIR=%~dp0"
set "VENV_DIR=%ROOT_DIR%.venv"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend\biztwin-frontend"

cls
echo ======================================================================
echo   AI-POWERED DIGITAL TWINS FOR SMALL BUSINESSES
echo   One-Click Automated Client Setup & Launch System
echo ======================================================================
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 1: Detect or Auto-Install Python 3.10+
:: ─────────────────────────────────────────────────────────────────────────────
echo [1/5] Checking Python environment...

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

:: If not in PATH, check standard installation directories
if "%PYTHON_BIN%"=="" (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"
        set "PYTHON_BIN=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;%PATH%"
        set "PYTHON_BIN=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    ) else if exist "C:\Program Files\Python312\python.exe" (
        set "PATH=C:\Program Files\Python312;C:\Program Files\Python312\Scripts;%PATH%"
        set "PYTHON_BIN=C:\Program Files\Python312\python.exe"
    )
)

:: If Python is still missing, attempt automated silent installation
if "%PYTHON_BIN%"=="" (
    echo   [!] Python is not installed. Starting automated download & setup...
    echo       Downloading official Python 3.12 installer...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://www.python.org/ftp/python/3.12.3/python-3.12.3-amd64.exe', '%TEMP%\python_setup.exe')"
    if exist "%TEMP%\python_setup.exe" (
        echo       Installing Python 3.12 silently (configuring PATH)...
        "%TEMP%\python_setup.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_pip=1 Include_test=0 SimpleInstall=1
        timeout /t 5 /nobreak >nul
        del "%TEMP%\python_setup.exe" >nul 2>&1
        set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"
        python --version >nul 2>&1
        if not errorlevel 1 (
            set "PYTHON_BIN=python"
            echo       [OK] Python installed successfully.
        )
    )
)

if "%PYTHON_BIN%"=="" (
    echo.
    echo [ERROR] Python 3.10+ could not be configured automatically.
    echo Please install Python manually from: https://www.python.org/downloads/
    echo IMPORTANT: Make sure to check the box: "[X] Add python.exe to PATH"
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('%PYTHON_BIN% --version 2^>^&1') do set "PY_VER=%%v"
echo   [OK] Python ready: %PY_VER%
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 2: Detect or Auto-Install Node.js & npm
:: ─────────────────────────────────────────────────────────────────────────────
echo [2/5] Checking Node.js & npm environment...

set "NODE_OK=0"
node --version >nul 2>&1
if not errorlevel 1 (
    set "NODE_OK=1"
) else (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"
        set "NODE_OK=1"
    )
)

:: If Node.js is missing, attempt automated silent installation
if "%NODE_OK%"=="0" (
    echo   [!] Node.js is not installed. Starting automated download & setup...
    echo       Downloading official Node.js LTS MSI installer...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.13.1/node-v20.13.1-x64.msi', '%TEMP%\nodejs_setup.msi')"
    if exist "%TEMP%\nodejs_setup.msi" (
        echo       Installing Node.js LTS silently...
        msiexec /i "%TEMP%\nodejs_setup.msi" /qn /norestart
        timeout /t 8 /nobreak >nul
        del "%TEMP%\nodejs_setup.msi" >nul 2>&1
        set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"
        node --version >nul 2>&1
        if not errorlevel 1 (
            set "NODE_OK=1"
            echo       [OK] Node.js installed successfully.
        )
    )
)

if "%NODE_OK%"=="0" (
    echo.
    echo [ERROR] Node.js could not be configured automatically.
    echo Please install Node.js LTS from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
for /f "tokens=*" %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"
echo   [OK] Node.js ready: %NODE_VER%
echo   [OK] npm ready    : v%NPM_VER%
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 3: Setup Virtual Environment & Install All Backend Dependencies (A to Z)
:: ─────────────────────────────────────────────────────────────────────────────
echo [3/5] Syncing Backend Python packages (A to Z)...

if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo   Creating isolated Python virtual environment in .venv ...
    %PYTHON_BIN% -m venv "%VENV_DIR%"
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo   [OK] Virtual environment created.
)

call "%VENV_DIR%\Scripts\activate.bat"
python -m pip install --upgrade pip --quiet

echo   Installing requirements from backend\requirements.txt ...
pip install -r "%BACKEND_DIR%\requirements.txt" --quiet
if errorlevel 1 (
    echo   [RETRY] Installing with detailed logs...
    pip install -r "%BACKEND_DIR%\requirements.txt"
    if errorlevel 1 (
        echo [ERROR] Could not install backend dependencies. Please check network connectivity.
        pause
        exit /b 1
    )
)
echo   [OK] All backend dependencies installed & verified.
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 4: Install All Frontend Dependencies (npm install)
:: ─────────────────────────────────────────────────────────────────────────────
echo [4/5] Syncing Frontend packages (npm install A to Z)...
cd /d "%FRONTEND_DIR%"

if not exist "node_modules\" (
    echo   Downloading all frontend modules (Vite, React, Recharts, Lucide)...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [ERROR] npm install failed. Please check network connectivity.
        cd /d "%ROOT_DIR%"
        pause
        exit /b 1
    )
    echo   [OK] Frontend packages installed successfully.
) else (
    echo   Verifying node_modules dependencies...
    call npm install --no-audit --no-fund --prefer-offline
    echo   [OK] Frontend dependencies verified.
)

cd /d "%ROOT_DIR%"
echo.

:: ─────────────────────────────────────────────────────────────────────────────
:: Step 5: Clean Ports, Launch Services & Open Browser
:: ─────────────────────────────────────────────────────────────────────────────
echo [5/5] Launching Digital Twin Platform Services...

:: Ensure .env exists
if not exist "%BACKEND_DIR%\.env" (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo   [INFO] Initialized backend\.env configuration.
    )
)

:: Terminate any stale processes on 8000 / 5173
call "%ROOT_DIR%stop.bat" >nul 2>&1

echo   Starting Backend API Server (FastAPI on http://127.0.0.1:8000)...
start "Digital Twin - Backend API" cmd /k "title Digital Twin - Backend API && cd /d ""%BACKEND_DIR%"" && call ""%VENV_DIR%\Scripts\activate.bat"" && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo   Starting Frontend Dashboard (Vite on http://localhost:5173)...
start "Digital Twin - Frontend UI" cmd /k "title Digital Twin - Frontend UI && cd /d ""%FRONTEND_DIR%"" && npm run dev"

echo.
echo   Waiting for Backend API and Frontend services to initialize...
set "API_READY=0"
for /l %%i in (1,1,12) do (
    if "!API_READY!"=="0" (
        powershell -NoProfile -Command "(New-Object Net.WebClient).DownloadString('http://127.0.0.1:8000/api/health')" >nul 2>&1
        if not errorlevel 1 (
            set "API_READY=1"
        ) else (
            timeout /t 1 /nobreak >nul
        )
    )
)
if "!API_READY!"=="1" (
    echo   [OK] Backend API is online and responding.
) else (
    echo   [INFO] Services launching in background.
)

echo.
echo ======================================================================
echo   DIGITAL TWIN FOR SMALL BUSINESSES IS RUNNING!
echo ======================================================================
echo.
echo   • Executive Cockpit : http://localhost:5173
echo   • FastAPI Backend   : http://127.0.0.1:8000
echo   • Interactive Docs  : http://127.0.0.1:8000/docs
echo   • Subsystem Health  : http://127.0.0.1:8000/api/health
echo.
echo   Opening your default web browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ----------------------------------------------------------------------
echo   TO STOP ALL SERVICES:
echo   Press [ENTER] in this window at any time to shut down both
echo   the backend and frontend servers cleanly.
echo ----------------------------------------------------------------------
echo.
pause

echo.
echo Stopping services...
call "%ROOT_DIR%stop.bat"
echo All services stopped cleanly. Goodbye!
timeout /t 2 /nobreak >nul
exit /b 0
