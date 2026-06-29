@echo off
:: Keep window open even if something crashes
if not "%1"=="run" ( cmd /k "%~f0" run & exit )

cd /d "C:\Projects\web\PHIL"
echo.
echo ========================================
echo  COMPLETE MERGE AFTER RESOLVING CONFLICTS
echo ========================================

echo.
echo [1] Checking merge is in progress...
if not exist ".git\MERGE_HEAD" (
    echo No merge in progress. Run git_merge_to_master.bat first.
    goto end
)
echo Merge in progress - good.

echo.
echo [2] Checking for remaining conflict markers...
git diff --name-only --diff-filter=U > "%TEMP%\remaining.txt" 2>nul
for %%A in ("%TEMP%\remaining.txt") do set SZ=%%~zA
if not "%SZ%"=="0" (
    echo These files still have unresolved conflicts:
    echo.
    type "%TEMP%\remaining.txt"
    echo.
    echo Fix the ^<^<^<^<^<^<^< markers in each file, save, then run this again.
    goto end
)
echo All conflicts resolved.

echo.
echo [3] Staging resolved files...
git add -A

echo.
echo [4] Completing the merge commit...
git commit --no-edit
if errorlevel 1 ( echo ERROR: commit failed & goto end )

echo.
echo [5] Pushing master to origin...
git push origin master
if errorlevel 1 ( echo ERROR: push failed & goto end )

echo.
echo ========================================
echo  SUCCESS - merge complete, master pushed
echo ========================================
git log --oneline --decorate -5

:end
echo.
echo Press any key to close...
pause > nul
