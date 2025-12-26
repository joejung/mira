@echo off
powershell -Command "$w=(Get-Host).UI.RawUI; $b=$w.BufferSize; $b.Width=150; $b.Height=3000; $w.BufferSize=$b; $s=$w.WindowSize; $s.Width=150; $s.Height=10; $w.WindowSize=$s;"
echo Starting MIRA Application (Backend and Frontend)...

:: Start backend in a new window
start "MIRA Backend" "%~dp0run_backend.cmd"

:: Start frontend in a new window
start "MIRA Frontend" "%~dp0run_frontend.cmd"

echo Both services are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this launcher.
pause > nul
