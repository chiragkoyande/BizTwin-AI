@echo off
setlocal enabledelayedexpansion
title Digital Twin for Small Businesses - Service Stopper

echo ======================================================================
echo   Stopping Digital Twin for Small Businesses Services...
echo ======================================================================
echo.

echo [1/3] Closing dedicated terminal windows...
taskkill /FI "WINDOWTITLE eq Digital Twin - Backend API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Digital Twin - Frontend UI*" /T /F >nul 2>&1

echo [2/3] Releasing Backend port 8000...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [3/3] Releasing Frontend ports 5173 / 5174...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5174" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] All Digital Twin background services stopped cleanly.
echo.
