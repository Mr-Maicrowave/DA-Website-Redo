@echo off
setlocal
set "REMOTE=origin"
set "BRANCH=master"

echo ============================================
echo   Saving and uploading your changes...
echo ============================================
cd /d "%~dp0"

git status --short

echo.
echo Checking GitHub status without merging...
git fetch "%REMOTE%"
if errorlevel 1 (
  echo.
  echo Git fetch failed. Please check your internet connection or GitHub access.
  pause
  exit /b 1
)

git merge-base --is-ancestor "%REMOTE%/%BRANCH%" HEAD
if errorlevel 1 (
  echo.
  echo GitHub has changes that are not in this folder.
  echo No merge was attempted. Run START-SESSION to replace this folder with GitHub's latest version, or ask for help if you need to preserve local work.
  pause
  exit /b 1
)

set "hasChanges="
for /f %%i in ('git status --porcelain') do set "hasChanges=1"

if not defined hasChanges (
  echo.
  echo No local file changes found. Checking for unpushed commits...
  git push "%REMOTE%" HEAD:"%BRANCH%"
  if errorlevel 1 (
    echo.
    echo Upload failed. GitHub may have changed while this script was running.
    pause
    exit /b 1
  )
  echo.
  echo Done! GitHub is up to date.
  echo.
  pause
  exit /b 0
)

echo.
set /p msg="Describe your changes (e.g. updated pricing section): "
if "%msg%"=="" (
  echo.
  echo Commit message cannot be blank. Nothing was uploaded.
  echo.
  pause
  exit /b 1
)

git add -A
git commit -m "%msg%"
if errorlevel 1 (
  echo.
  echo Commit failed. Please check the message above.
  pause
  exit /b 1
)

echo.
echo Uploading to GitHub...
git push "%REMOTE%" HEAD:"%BRANCH%"
if errorlevel 1 (
  echo.
  echo Upload failed. GitHub may have changed while this script was running.
  echo No merge was attempted.
  pause
  exit /b 1
)

echo.
echo Done! Your changes have been saved to GitHub.
echo.
pause
