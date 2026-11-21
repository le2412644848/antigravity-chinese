@echo off
title Antigravity Chinese Localization
echo === Antigravity Desktop - One-Click Chinese Localization v3 ===
echo.
rem Launched from an Electron-based terminal (VS Code etc.) this may be set and would break Antigravity startup
set ELECTRON_RUN_AS_NODE=
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] node not found in PATH. Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "%~dp0asar-tool\node_modules\@electron\asar" (
  echo [INFO] Initializing dependencies for asar-tool...
  pushd "%~dp0asar-tool"
  call npm install --no-audit --no-fund
  popd
)

node "%~dp0asar-tool\test.js"
if errorlevel 1 (
  echo.
  echo Word list self-test FAILED. Please check recent edits to app-src\dist\i18n-zh*.js
  pause
  exit /b 1
)
echo.
echo Closing Antigravity and applying localization...
echo.
node "%~dp0asar-tool\localize.js" "%~dp0." %*
if errorlevel 1 (
  echo.
  echo Localization FAILED. Please screenshot the output above.
  pause
  exit /b 1
)
echo.
echo Starting Antigravity ...
start "" "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
echo Done! If the UI is still in English, wait a few seconds or reopen the window.
pause
