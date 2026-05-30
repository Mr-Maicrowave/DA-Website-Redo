@echo off
echo ============================================
echo   Fetching latest changes from GitHub...
echo ============================================
cd /d "%~dp0"
git pull
echo.
echo Done! You're up to date. Start working :)
echo.
pause
