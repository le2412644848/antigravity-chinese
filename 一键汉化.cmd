@echo off
title Antigravity Chinese Localization
echo === Antigravity Desktop - One-Click Chinese Localization v2 ===
echo.
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

echo Closing Antigravity and applying localization...
echo.
node "%~dp0asar-tool\localize.js" "%~dp0."
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
