@echo off
echo ============================================
echo   Starting DA Tuition work session...
echo ============================================
cd /d "%~dp0"

echo.
echo Fetching latest changes from GitHub...
git pull
if errorlevel 1 (
  echo.
  echo Git pull failed. Please ask for help before making changes.
  pause
  exit /b 1
)

echo.
if not exist node_modules (
  echo Installing website dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency install failed. Please ask for help before making changes.
    pause
    exit /b 1
  )
)

echo.
echo Opening the local website server...
curl -s http://localhost:8080 >nul 2>nul
if not errorlevel 1 (
  echo Website server is already running at http://localhost:8080
  echo.
  echo Done! Edit the website, then refresh or check your browser.
  echo.
  pause
  exit /b 0
)

start "DA Tuition Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo.
echo Done! Edit the website, then open http://localhost:8080 in your browser.
echo.
pause
