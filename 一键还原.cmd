@echo off
title Antigravity Restore Official Version
echo === Restore Antigravity to official version ===
taskkill /F /IM Antigravity.exe >nul 2>&1
timeout /t 3 /nobreak >nul
if not exist "%LOCALAPPDATA%\Programs\antigravity\resources\app.asar.bak-zh" (
  echo Restore FAILED: backup file app.asar.bak-zh not found.
  echo Run the localization script once to create it, or reinstall Antigravity.
  pause
  exit /b 1
)
copy /y "%LOCALAPPDATA%\Programs\antigravity\resources\app.asar.bak-zh" "%LOCALAPPDATA%\Programs\antigravity\resources\app.asar" >nul
if errorlevel 1 (
  echo Restore FAILED: file is in use. Make sure Antigravity is fully closed, then retry.
  pause
  exit /b 1
)
echo Restored. Starting Antigravity ...
start "" "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
pause
