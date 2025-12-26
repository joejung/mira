@echo off
echo Starting MIRA Application (Backend and Frontend)...

:: Start backend in a new window
start "MIRA Backend" cmd /c "cd /d %~dp0backend && npm run dev"

:: Start frontend in a new window
start "MIRA Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo Both services are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this launcher.
pause > nul
