@echo off
:: Keep window open even if something crashes
if not "%1"=="run" ( cmd /k "%~f0" run & exit )

cd /d "C:\Projects\web\PHIL"
echo.
echo ========================================
echo  GIT COMMIT AND PUSH TO phil-work
echo ========================================

echo.
echo [1] Removing index.lock if present...
if exist ".git\index.lock" (
    del /f ".git\index.lock" && echo Removed index.lock
) else (
    echo No index.lock found
)

echo.
echo [2] Checking for changes...
git status
echo.
git status --porcelain > "%TEMP%\gitstatus.txt"
for %%A in ("%TEMP%\gitstatus.txt") do set SIZE=%%~zA
if "%SIZE%"=="0" (
    echo No changes to commit. Done.
    goto end
)

echo.
echo [3] Staging all changes...
git add -A
echo Done.

echo.
echo [4] Committing...
for /f "delims=" %%b in ('git branch --show-current') do set BRANCH=%%b
echo Current branch: %BRANCH%
git commit -m "Update site content and components"
if errorlevel 1 ( echo COMMIT FAILED & goto end )
for /f "delims=" %%h in ('git rev-parse --short HEAD') do set HASH=%%h
echo Committed: %HASH%

echo.
echo [5] Pushing to phil-work...
if "%BRANCH%"=="phil-work" (
    git push origin phil-work
) else (
    echo Was on %BRANCH% - moving commit to phil-work...
    git branch -f phil-work HEAD
    git reset --hard HEAD~1
    git push origin phil-work
)
if errorlevel 1 ( echo PUSH FAILED & goto end )

echo.
echo ========================================
echo  SUCCESS - pushed to origin/phil-work
echo ========================================
git log --oneline --decorate -3

:end
echo.
echo Press any key to close...
pause > nul
