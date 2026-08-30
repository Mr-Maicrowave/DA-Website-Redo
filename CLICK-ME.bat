@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title DA Website Tools

:MAIN_MENU
cls
echo ============================================================
echo  DA Website Tools
echo ============================================================
echo.
echo   1^) Pull the latest changes from GitHub
echo   2^) Push your changes to GitHub
echo   3^) Start the local website (npm run dev)
echo   4^) Exit
echo.
set "MAINCHOICE="
set /p MAINCHOICE="Enter a number: "

if "!MAINCHOICE!"=="1" goto DO_PULL
if "!MAINCHOICE!"=="2" goto DO_PUSH
if "!MAINCHOICE!"=="3" goto DO_DEV
if "!MAINCHOICE!"=="4" exit /b 0
echo.
echo Invalid choice - please enter 1, 2, 3, or 4.
pause
goto MAIN_MENU

REM ============================================================
REM  Option 3: start the local dev server
REM ============================================================
:DO_DEV
cls
echo ============================================================
echo  Starting the local website
echo ============================================================
echo.
echo Running "npm run dev" in this folder.
echo Press Ctrl+C to stop the server and return to this menu.
echo.
call npm run dev
echo.
echo Dev server stopped.
pause
goto MAIN_MENU

REM ============================================================
REM  Shared sanity checks (called, not entered directly)
REM ============================================================
:SANITY_CHECKS
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERROR: This folder is not a git repository. Stopping.
    echo ^(this file must live inside DA-Website-Redo-master, next to the src and public folders^)
    pause
    exit /b 1
)
for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "REMOTE_URL=%%R"
echo !REMOTE_URL! | findstr /i "DA-Website-Redo" >nul
if errorlevel 1 (
    echo ERROR: The git remote does not look like the DA-Website-Redo repo.
    echo Remote found: !REMOTE_URL!
    echo Stopping to avoid running against the wrong place.
    pause
    exit /b 1
)
if exist ".git\MERGE_HEAD" (
    echo ERROR: A previous merge was left unresolved in this folder.
    echo Run "git status" and paste the full output to Claude before continuing.
    pause
    exit /b 1
)
exit /b 0

REM ============================================================
REM  Build a numbered list of every branch on GitHub into
REM  %TEMP%\da_branches.txt, one name per line, and print it.
REM  (called, not entered directly)
REM ============================================================
:LIST_REMOTE_BRANCHES
git fetch origin >nul 2>&1
if exist "%TEMP%\da_branches.txt" del "%TEMP%\da_branches.txt" >nul 2>&1
for /f "tokens=* delims= " %%B in ('git branch -r') do (
    set "LINE=%%B"
    echo !LINE! | findstr /c:"->" >nul
    if errorlevel 1 (
        set "NAME=!LINE:origin/=!"
        echo !NAME!>>"%TEMP%\da_branches.txt"
    )
)
if not exist "%TEMP%\da_branches.txt" (
    echo ERROR: Could not find any branches on origin. Stopping.
    pause
    exit /b 1
)
echo.
echo Available branches:
set BRCOUNT=0
for /f "usebackq delims=" %%N in ("%TEMP%\da_branches.txt") do (
    set /a BRCOUNT+=1
    echo   !BRCOUNT!^) %%N
)
echo.
exit /b 0

REM ============================================================
REM  Ask for a branch number, set SELECTED_BRANCH.
REM  Must be called right after LIST_REMOTE_BRANCHES.
REM  (called, not entered directly)
REM ============================================================
:PICK_BRANCH
set "SELECTED_BRANCH="
set /p BRCHOICE="Enter a number: "
set N=0
for /f "usebackq delims=" %%X in ("%TEMP%\da_branches.txt") do (
    set /a N+=1
    if "!N!"=="!BRCHOICE!" set "SELECTED_BRANCH=%%X"
)
del "%TEMP%\da_branches.txt" >nul 2>&1
if "!SELECTED_BRANCH!"=="" (
    echo Invalid choice.
    pause
    exit /b 1
)
exit /b 0

REM ============================================================
REM  Option 1: pull
REM ============================================================
:DO_PULL
cls
echo ============================================================
echo  PULL the latest changes from GitHub
echo ============================================================
echo.
call :SANITY_CHECKS
if errorlevel 1 goto MAIN_MENU

REM Only block on edits to files Git already tracks - brand new
REM untracked files are safe to leave in place during a pull.
for /f %%C in ('git status --porcelain ^| findstr /v /b "??" ^| find /c /v ""') do set CHANGE_COUNT=%%C
if not "!CHANGE_COUNT!"=="0" (
    echo ============================================================
    echo You have uncommitted edits to existing files in this folder:
    echo ------------------------------------------------------------
    git status --short
    echo ------------------------------------------------------------
    echo Pulling now could conflict with or overwrite this work.
    echo Please push your changes first ^(option 2^), then pull again.
    echo ============================================================
    pause
    goto MAIN_MENU
)

call :LIST_REMOTE_BRANCHES
if errorlevel 1 goto MAIN_MENU
call :PICK_BRANCH
if errorlevel 1 goto MAIN_MENU
set "BRANCH=!SELECTED_BRANCH!"
echo.
echo Pulling: !BRANCH!
echo.

git checkout !BRANCH! 2>nul
if errorlevel 1 (
    git checkout -b !BRANCH! origin/!BRANCH!
    if errorlevel 1 (
        echo ERROR: Could not switch to !BRANCH!. Stopping.
        pause
        goto MAIN_MENU
    )
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
    goto MAIN_MENU
)

echo.
echo Successfully updated !BRANCH! with the latest changes from GitHub.
pause
goto MAIN_MENU

REM ============================================================
REM  Option 2: push
REM ============================================================
:DO_PUSH
cls
echo ============================================================
echo  PUSH your changes to GitHub
echo ============================================================
echo.
call :SANITY_CHECKS
if errorlevel 1 goto MAIN_MENU

for /f %%C in ('git status --porcelain ^| find /c /v ""') do set CHANGE_COUNT=%%C
if "!CHANGE_COUNT!"=="0" (
    echo Nothing to push - your folder already matches your last commit.
    pause
    goto MAIN_MENU
)

for /f "delims=" %%C in ('git rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%C"
echo You are currently working on: !CURRENT_BRANCH!

echo.
echo Where do you want to push your changes?
echo   1^) master   [default]
echo   2^) lee-work
echo.
set "PUSHCHOICE="
set /p PUSHCHOICE="Enter 1 or 2 (press Enter for master): "
if "!PUSHCHOICE!"=="2" (
    set "TARGET=lee-work"
) else (
    set "TARGET=master"
)
echo.
echo Target branch: !TARGET!
echo.

echo The following files have changed:
echo ------------------------------------------------------------
git status --short
echo ------------------------------------------------------------
echo.
set /p CONFIRM="Type YES to stage and commit these changes: "
if /i not "!CONFIRM!"=="YES" (
    echo Cancelled - nothing was changed, committed, or pushed.
    pause
    goto MAIN_MENU
)

git add -A
set /p COMMITMSG="Enter a short description of your changes: "
if "!COMMITMSG!"=="" set "COMMITMSG=Update from DA Website Tools"

git commit -m "!COMMITMSG!"
if errorlevel 1 (
    echo ERROR: Commit failed. Stopping - nothing was pushed.
    pause
    goto MAIN_MENU
)

REM --- Sync the target branch before pushing ---
git fetch origin
if "!TARGET!"=="!CURRENT_BRANCH!" goto PUSH_CURRENT_BRANCH

REM --- Target is a different branch - merge this work into it locally and push that branch ---
echo.
echo Now merging into !TARGET!...
git checkout !TARGET! 2>nul
if errorlevel 1 (
    git checkout -b !TARGET! origin/!TARGET!
    if errorlevel 1 (
        echo ERROR: Could not switch to !TARGET!. Stopping - your work is safely committed locally on !CURRENT_BRANCH!.
        pause
        goto MAIN_MENU
    )
)

git merge origin/!TARGET! --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while updating local !TARGET! from origin/!TARGET!.
    echo Your work is safely committed locally on !CURRENT_BRANCH! - nothing was lost or pushed.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    goto MAIN_MENU
)

git merge !CURRENT_BRANCH! --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while merging !CURRENT_BRANCH! into !TARGET!.
    echo Your work is safely committed locally on !CURRENT_BRANCH! - nothing was lost or pushed.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    goto MAIN_MENU
)
goto CONFIRM_TARGET_PUSH

REM --- Target is the branch you are already on ---
:PUSH_CURRENT_BRANCH
git merge origin/!TARGET! --no-edit
if errorlevel 1 (
    echo.
    echo ============================================================
    echo CONFLICT while merging origin/!TARGET! into your local branch.
    echo Your work is safely committed locally - nothing was lost or pushed.
    echo Copy everything below and paste it to Claude for help:
    echo ============================================================
    git status
    pause
    goto MAIN_MENU
)

:CONFIRM_TARGET_PUSH
echo.
for /f %%N in ('git rev-list --count origin/!TARGET!..!TARGET!') do set "PUSH_COUNT=%%N"
echo About to push !PUSH_COUNT! commit^(s^) to !TARGET!.
echo Most recent commit:
echo ------------------------------------------------------------
git log -1 --oneline
echo ------------------------------------------------------------
echo.
echo Pushing to !TARGET!...
git push origin !TARGET!
if errorlevel 1 (
    echo.
    echo ERROR: Push to !TARGET! failed - most likely someone else pushed to it in the meantime.
    echo Nothing was overwritten. Your changes are safely committed locally.
    echo Copy the message above and paste it to Claude for help.
    pause
    goto MAIN_MENU
)

echo.
echo Successfully pushed to !TARGET!.
git checkout !CURRENT_BRANCH!
echo Switched back to !CURRENT_BRANCH! for your next round of changes.
pause
goto MAIN_MENU
