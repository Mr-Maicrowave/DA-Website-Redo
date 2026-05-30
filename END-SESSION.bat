@echo off
echo ============================================
echo   Saving and uploading your changes...
echo ============================================
cd /d "%~dp0"
set /p msg="Describe your changes (e.g. updated pricing section): "
git add .
git commit -m "%msg%"
git push
echo.
echo Done! Your changes have been saved to GitHub.
echo.
pause
