@echo off
setlocal
cd /d "%~dp0"
if not exist backups mkdir backups
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set D=%%d%%b%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set T=%%a%%b
set T=%T: =0%
set FILE=backups\azez-lab-ai-%D%-%T%.sql
where docker >nul 2>nul || goto :nodocker
docker compose exec -T postgres pg_dump -U azez -d azez_lab_ai > "%FILE%"
if errorlevel 1 goto :fail
echo Backup created: %FILE%
pause
exit /b 0
:nodocker
echo Docker is required for the bundled PostgreSQL backup command.
pause
exit /b 1
:fail
echo Backup failed.
pause
exit /b 1
