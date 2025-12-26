@echo off
echo ============================================
echo   MIRA Frontend - Deep Clean and Start
echo ============================================
cd /d %~dp0frontend

echo.
echo [1/4] Clearing Vite cache...
if exist node_modules\.vite rd /s /q node_modules\.vite

echo [2/4] Clearing npm cache...
if exist node_modules\.cache rd /s /q node_modules\.cache

echo [3/4] Clearing TypeScript build cache...
if exist node_modules\.tmp rd /s /q node_modules\.tmp

echo [4/4] Cache cleared successfully!
echo.
echo Starting dev server...
echo ============================================
npm run dev
pause
