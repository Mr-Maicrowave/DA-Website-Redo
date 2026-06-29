@echo off
:: Keep window open even if something crashes
if not "%1"=="run" ( cmd /k "%~f0" run & exit )

cd /d "C:\Projects\web\PHIL"
echo.
echo ========================================
echo  SAFE MERGE: phil-work to master
echo ========================================

echo.
echo [1] Fetching latest from origin...
git fetch --all
echo.

echo.
echo [2] Branch overview - commits NOT yet in master:
echo -----------------------------------------------
git log --oneline origin/master..origin/phil-work > "%TEMP%\philwork.txt" 2>nul
for %%A in ("%TEMP%\philwork.txt") do set SZ=%%~zA
if "%SZ%"=="0" (
    echo   origin/phil-work - nothing new vs master
) else (
    echo   [origin/phil-work] ahead of master:
    type "%TEMP%\philwork.txt"
)

echo.
git log --oneline origin/master..origin/huyen-work > "%TEMP%\huyenwork.txt" 2>nul
for %%A in ("%TEMP%\huyenwork.txt") do set SZ=%%~zA
if not "%SZ%"=="0" (
    echo   [origin/huyen-work] ahead of master:
    type "%TEMP%\huyenwork.txt"
)

git log --oneline origin/master..origin/lee-work > "%TEMP%\leework.txt" 2>nul
for %%A in ("%TEMP%\leework.txt") do set SZ=%%~zA
if not "%SZ%"=="0" (
    echo   [origin/lee-work] ahead of master:
    type "%TEMP%\leework.txt"
)

git log --oneline origin/master..origin/seri-work > "%TEMP%\seriwork.txt" 2>nul
for %%A in ("%TEMP%\seriwork.txt") do set SZ=%%~zA
if not "%SZ%"=="0" (
    echo   [origin/seri-work] ahead of master:
    type "%TEMP%\seriwork.txt"
)

echo.
echo [3] Switching to master and pulling latest...
git checkout master
if errorlevel 1 ( echo ERROR: could not switch to master & goto end )
git pull --ff-only origin master
if errorlevel 1 (
    echo ERROR: could not pull master - someone may have pushed conflicting changes.
    goto end
)
echo master is up to date.

echo.
echo [4] Checking if phil-work has anything to merge...
git log --oneline master..origin/phil-work > "%TEMP%\tomergephil.txt" 2>nul
for %%A in ("%TEMP%\tomergephil.txt") do set SZ=%%~zA
if "%SZ%"=="0" (
    echo phil-work has no new commits vs master. Nothing to merge.
    goto end
)
echo Merging these commits from phil-work:
type "%TEMP%\tomergephil.txt"
echo.

git merge origin/phil-work --no-ff -m "Merge phil-work into master"

if errorlevel 1 (
    echo.
    echo ========================================
    echo  CONFLICTS - action required
    echo ========================================
    echo.
    echo Git merged everything it could automatically.
    echo These files have conflicts you need to fix manually:
    echo.
    git diff --name-only --diff-filter=U
    echo.
    echo What to do:
    echo  1. Open each file above in VS Code
    echo  2. Search for ^<^<^<^<^<^<^< - you will see blocks like:
    echo.
    echo       ^<^<^<^<^<^<^< HEAD  (master version)
    echo       =======
    echo       >>>>>>> origin/phil-work  (your version)
    echo.
    echo  3. Delete the markers, keep the right code, save.
    echo  4. Run git_resolve_conflicts.bat when done.
    echo.
    echo  To cancel the whole merge and go back: run git merge --abort
    goto end
)

echo.
echo [5] Pushing master to origin...
git push origin master
if errorlevel 1 ( echo ERROR: push failed & goto end )

echo.
echo ========================================
echo  SUCCESS - phil-work merged into master
echo ========================================
git log --oneline --decorate -5

:end
echo.
echo Press any key to close...
pause > nul
