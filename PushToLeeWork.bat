@echo off
echo ========================================
echo  Pushing to lee-work branch
echo ========================================
echo.

cd /d "C:\Users\chris\Downloads\DA-Website-Redo\DA-Website-Redo"

REM Remove stale lock if it exists
if exist ".git\index.lock" (
    echo Removing stale git lock...
    del /f ".git\index.lock"
)

REM Discard the auto-generated sitemap change (not our work)
echo Restoring sitemap.xml...
git restore public/sitemap.xml

REM Remove stray test file
if exist "public\test.txt" del /f "public\test.txt"

REM Switch to lee-work
echo.
echo Switching to lee-work branch...
git checkout lee-work
if %errorlevel% neq 0 (
    echo FAILED to switch branch. Aborting.
    pause
    exit /b 1
)

echo.
echo Staging all changes...
git add .

echo.
echo Committing...
git commit -m "LEE principal reflections and interview pages"

echo.
echo Pushing to origin/lee-work...
git push origin lee-work
if %errorlevel% neq 0 (
    echo PUSH FAILED. Check errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Done! Pushed to lee-work successfully.
echo ========================================
pause
