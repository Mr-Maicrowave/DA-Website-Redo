@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================================
echo  DA Website - PULL the latest changes from GitHub
echo ============================================================
echo.

REM --- Make sure this is really the right git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERROR: This folder is not a git repository. Stopping.
    echo ^(pull.bat must live inside DA-Website-Redo-master, next to the src and public folders^)
    pause
    exit /b 1
)

for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set REMOTE_URL=%%R
echo !REMOTE_URL! | findstr /i "DA-Website-Redo" >nul
if errorlevel 1 (
    echo ERROR: The git remote does not look like the DA-Website-Redo repo.
    echo Remote found: !REMOTE_URL!
    echo Stopping to avoid pulling into the wrong place.
    pause
    exit /b 1
)

REM --- Refuse to run on top of an unresolved conflict ---
if exist ".git\MERGE_HEAD" (
    echo ERROR: A previous merge was left unresolved in this folder.
    echo Run "git status" and paste the full output to Claude before continuing.
    pause
    exit /b 1
)

REM --- Refuse to pull over uncommitted edits to files Git already tracks. ---
REM --- Brand new files (untracked, "??") are fine to leave in place -   ---
REM --- git merge only blocks itself if an incoming file would collide, ---
REM --- and that case is still caught safely further down.              ---
for /f %%C in ('git status --porcelain ^| findstr /v /b "??" ^| find /c /v ""') do set CHANGE_COUNT=%%C
if not "!CHANGE_COUNT!"=="0" (
    echo ============================================================
    echo You have uncommitted edits to existing files in this folder:
    echo ------------------------------------------------------------
    git status --short
    echo ------------------------------------------------------------
    echo Pulling now could conflict with or overwrite this work.
    echo Please run push.bat first ^(or ask Claude to commit your changes^),
    echo then run pull.bat again.
    echo ============================================================
    pause
    exit /b 1
)

REM --- Which branch to pull ---
echo Which branch do you want the latest version of?
echo   1^) master     [default - everyone's merged, live work]
echo   2^) lee-work   [your own branch, in case someone else pushed to it]
echo.
set /p PULLCHOICE="Enter 1 or 2 (press Enter for master): "
if "!PULLCHOICE!"=="2" (
    set BRANCH=lee-work
) else (
    set BRANCH=master
)
echo.
echo Pulling: !BRANCH!
echo.

git checkout !BRANCH!
if errorlevel 1 (
    echo ERROR: Could not switch to !BRANCH!. Stopping.
    pause
    exit /b 1
)

git fetch origin
git merge origin/!BRANCH! --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while pulling !BRANCH!.
    echo Nothing in your folder was lost or deleted.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    exit /b 1
)

echo.
echo Successfully updated !BRANCH! with the latest changes from GitHub.
pause
exit /b 0
