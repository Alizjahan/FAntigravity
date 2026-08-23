@echo off
title Restore Original Antigravity
echo ========================================================
echo   Restoring Original Antigravity...
echo ========================================================
echo.
cd /d "%~dp0"
node bin/index.js --restore
echo.
pause
