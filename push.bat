@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================================
echo  DA Website - PUSH your changes to GitHub
echo ============================================================
echo.

REM --- Make sure this is really the right git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERROR: This folder is not a git repository. Stopping.
    echo ^(push.bat must live inside DA-Website-Redo-master, next to the src and public folders^)
    pause
    exit /b 1
)

for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set REMOTE_URL=%%R
echo !REMOTE_URL! | findstr /i "DA-Website-Redo" >nul
if errorlevel 1 (
    echo ERROR: The git remote does not look like the DA-Website-Redo repo.
    echo Remote found: !REMOTE_URL!
    echo Stopping to avoid pushing to the wrong place.
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

REM --- Anything to push at all? ---
for /f %%C in ('git status --porcelain ^| find /c /v ""') do set CHANGE_COUNT=%%C
if "!CHANGE_COUNT!"=="0" (
    echo Nothing to push - your folder already matches your last commit.
    pause
    exit /b 0
)

REM --- Ask where to push ---
echo Where do you want to push your changes?
echo   1^) lee-work   [default - your working branch]
echo   2^) master     [also merges lee-work into master and pushes that]
echo.
set /p PUSHCHOICE="Enter 1 or 2 (press Enter for lee-work): "
if "!PUSHCHOICE!"=="2" (
    set TARGET=master
) else (
    set TARGET=lee-work
)
echo.
echo Target: !TARGET!
echo.

REM --- All work is committed on lee-work first, always ---
git checkout lee-work
if errorlevel 1 (
    echo ERROR: Could not switch to lee-work. Stopping - nothing was committed or pushed.
    pause
    exit /b 1
)

echo The following files have changed:
echo ------------------------------------------------------------
git status --short
echo ------------------------------------------------------------
echo.
set /p CONFIRM="Type YES to stage and commit these changes: "
if /i not "!CONFIRM!"=="YES" (
    echo Cancelled - nothing was changed, committed, or pushed.
    pause
    exit /b 0
)

git add -A

set /p COMMITMSG="Enter a short description of your changes: "
if "!COMMITMSG!"=="" set COMMITMSG=Update from push.bat

git commit -m "!COMMITMSG!"
if errorlevel 1 (
    echo ERROR: Commit failed. Stopping - nothing was pushed.
    pause
    exit /b 1
)

REM --- Sync with origin/lee-work before pushing ---
git fetch origin
git merge origin/lee-work --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while merging origin/lee-work into your local branch.
    echo Your work is safely committed locally - nothing was lost or pushed.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    exit /b 1
)

git push origin lee-work
if errorlevel 1 (
    echo.
    echo ERROR: Push to lee-work failed. Copy the message above and paste it to Claude.
    pause
    exit /b 1
)

echo.
echo Successfully pushed to lee-work.

if not "!TARGET!"=="master" (
    echo Done.
    pause
    exit /b 0
)

REM --- Also bring it into master ---
echo.
echo Now merging into master...
git checkout master
if errorlevel 1 (
    echo ERROR: Could not switch to master. Stopping - your work is already safely pushed to lee-work.
    pause
    exit /b 1
)

git fetch origin
git merge origin/master --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while updating local master from origin/master.
    echo Your work is safe either way - it is already pushed to lee-work.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    exit /b 1
)

git merge lee-work --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while merging lee-work into master.
    echo Your work is safe either way - it is already pushed to lee-work.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    exit /b 1
)

echo.
echo About to push the following commits to master:
echo ------------------------------------------------------------
git log origin/master..master --oneline
echo ------------------------------------------------------------
echo.
set /p CONFIRM2="Type YES to push to master: "
if /i not "!CONFIRM2!"=="YES" (
    echo Cancelled - master was updated locally but NOT pushed.
    echo Your changes are already safe on the lee-work branch on GitHub.
    pause
    exit /b 0
)

git push origin master
if errorlevel 1 (
    echo.
    echo ERROR: Push to master failed - most likely someone else pushed to master in the meantime.
    echo Nothing was overwritten. Copy the message above and paste it to Claude for help.
    pause
    exit /b 1
)

echo.
echo Successfully pushed to master.
git checkout lee-work
echo Switched back to lee-work for your next round of changes.
pause
exit /b 0
