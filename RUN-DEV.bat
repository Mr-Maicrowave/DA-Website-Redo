@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   Starting local dev server...
echo ============================================

if not exist node_modules (
  echo Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency install failed.
    pause
    exit /b 1
  )
)

echo.
echo Checking if dev server is already running...
curl -s http://localhost:8080 >nul 2>nul
if not errorlevel 1 (
  echo Already running at http://localhost:8080
  start http://localhost:8080
  exit /b 0
)

start "DA Tuition Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo Waiting for server to start...
timeout /t 5 /nobreak >nul
start http://localhost:8080

echo.
echo Done. Site should open at http://localhost:8080
