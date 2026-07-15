@echo off
cd /d "%~dp0"
taskkill /FI "WINDOWTITLE eq AZEZ LAB AI CORE*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq AZEZ LAB AI WORKER*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq AZEZ LAB AI UI*" /T /F >nul 2>nul
echo AZEZ LAB AI application services stopped.
echo PostgreSQL and Redis remain available for fast restart.
pause
