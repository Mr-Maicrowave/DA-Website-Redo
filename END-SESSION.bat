@echo off
echo ============================================
echo   Saving and uploading your changes...
echo ============================================
cd /d "%~dp0"

git status --short

set "hasChanges="
for /f %%i in ('git status --porcelain') do set "hasChanges=1"

if not defined hasChanges (
  echo.
  echo No changes found. Nothing to upload.
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

git add .
git commit -m "%msg%"
if errorlevel 1 (
  echo.
  echo Commit failed. Please check the message above.
  pause
  exit /b 1
)

git pull --rebase
if errorlevel 1 (
  echo.
  echo Git pull/rebase failed. Please ask for help before pushing.
  pause
  exit /b 1
)

git push
if errorlevel 1 (
  echo.
  echo Upload failed. Please check the message above.
  pause
  exit /b 1
)

echo.
echo Done! Your changes have been saved to GitHub.
echo.
pause
