@echo off
setlocal
set "REMOTE=origin"
set "BRANCH=master"

echo ============================================
echo   Starting DA Tuition work session...
echo ============================================
cd /d "%~dp0"

echo.
echo Replacing this working folder with the latest GitHub version...
echo WARNING: local uncommitted changes and untracked files will be discarded.
echo.

git fetch "%REMOTE%"
if errorlevel 1 (
  echo.
  echo Git fetch failed. Please check your internet connection or GitHub access.
  pause
  exit /b 1
)

git reset --hard "%REMOTE%/%BRANCH%"
if errorlevel 1 (
  echo.
  echo Git reset failed. Please ask for help before making changes.
  pause
  exit /b 1
)

git clean -ffd
if errorlevel 1 (
  echo.
  echo Git clean failed. Please ask for help before making changes.
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
echo Checking if dev server is already running...
curl -s http://localhost:8080 >nul 2>nul
if not errorlevel 1 (
  echo Website server is already running at http://localhost:8080
  echo.
  echo Done! Edit the website, then refresh your browser.
  echo.
  pause
  exit /b 0
)

echo Opening the local website server...
start "DA Tuition Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo.
echo Done! Edit the website, then open http://localhost:8080 in your browser.
echo.
pause
