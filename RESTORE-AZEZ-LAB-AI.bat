@echo off
setlocal
cd /d "%~dp0"
if "%~1"=="" (
 echo Drag a .sql backup file onto this RESTORE file.
 echo Example: RESTORE-AZEZ-LAB-AI.bat backups\file.sql
 pause
 exit /b 1
)
if not exist "%~1" (
 echo Backup file not found.
 pause
 exit /b 1
)
echo WARNING: This restores SQL into the AZEZ LAB AI database.
set /p CONFIRM=Type RESTORE to continue: 
if /I not "%CONFIRM%"=="RESTORE" exit /b 1
docker compose exec -T postgres psql -U azez -d azez_lab_ai < "%~1"
if errorlevel 1 (
 echo Restore failed.
 pause
 exit /b 1
)
echo Restore completed.
pause
