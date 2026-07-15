@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title AZEZ LAB AI V17 ONE CLICK
echo.
echo ============================================================
echo          AZEZ LAB AI V17 - ONE CLICK LAUNCHER
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
 echo [ERROR] Node.js is not installed or is not available in PATH.
 echo Install Node.js LTS and run this file again.
 pause
 exit /b 1
)

if not exist ".env" (
 echo [SETUP] Creating local .env configuration...
 copy /Y ".env.example" ".env" >nul
)

if not exist "node_modules" (
 echo [1/8] Installing dependencies. Internet is required for this first install...
 call npm install
 if errorlevel 1 goto :fail
) else (
 echo [1/8] Dependencies ready.
)

echo [2/8] Generating Prisma client...
call npm run db:generate
if errorlevel 1 goto :fail

where docker >nul 2>nul
if errorlevel 1 goto :directmode

docker info >nul 2>nul
if errorlevel 1 goto :directmode

echo [3/8] Starting PostgreSQL and Redis...
docker compose up -d postgres redis
if errorlevel 1 goto :directmode

echo [4/8] Waiting for durable infrastructure...
timeout /t 8 /nobreak >nul

echo [5/8] Preparing database schema...
call npx prisma db push --schema server/prisma/schema.prisma
if errorlevel 1 goto :fail

echo [6/8] Running engineering release validation...
call npm run validate:release
if errorlevel 1 (
 echo [ERROR] Release validation failed. AZEZ LAB AI will not auto-start.
 goto :fail
)

echo [7/8] Starting Core, Worker and Product OS...
start "AZEZ LAB AI CORE" cmd /k "cd /d ""%~dp0"" && set REQUIRE_DURABLE_INFRA=true && npm run server"
start "AZEZ LAB AI WORKER" cmd /k "cd /d ""%~dp0"" && set REQUIRE_DURABLE_INFRA=true && npm run worker"
start "AZEZ LAB AI UI" cmd /k "cd /d ""%~dp0"" && npm run dev -- --host 127.0.0.1"

echo [8/8] Opening AZEZ LAB AI...
timeout /t 8 /nobreak >nul
start "" "http://127.0.0.1:5173"
echo.
echo ============================================================
echo AZEZ LAB AI V17 STARTED IN DURABLE MODE
echo UI:    http://127.0.0.1:5173
echo CORE:  http://127.0.0.1:8787/api/health
echo READY: http://127.0.0.1:8787/api/ready
echo OPS:   http://127.0.0.1:8787/api/ops/status
echo ============================================================
echo Keep the service windows open while using the application.
pause
exit /b 0

:directmode
echo.
echo [WARN] Docker Engine is unavailable.
echo [WARN] Starting DIRECT LOCAL DEMO MODE.
echo [WARN] PostgreSQL, Redis and durable workers are not active.
echo.
start "AZEZ LAB AI CORE" cmd /k "cd /d ""%~dp0"" && set REQUIRE_DURABLE_INFRA=false && npm run server"
start "AZEZ LAB AI UI" cmd /k "cd /d ""%~dp0"" && npm run dev -- --host 127.0.0.1"
timeout /t 8 /nobreak >nul
start "" "http://127.0.0.1:5173"
echo AZEZ LAB AI started in DIRECT LOCAL DEMO MODE.
pause
exit /b 0

:fail
echo.
echo [ERROR] AZEZ LAB AI startup stopped because a required step failed.
echo Read the error above. The launcher did not hide the failure.
pause
exit /b 1
