@echo off
echo Starting MIRA Backend...
:: Set window size and position (10 rows high, fixed location away from left edge)
powershell -Command "$w=(Get-Host).UI.RawUI; $b=$w.BufferSize; $b.Width=150; $b.Height=3000; $w.BufferSize=$b; $s=$w.WindowSize; $s.Width=150; $s.Height=10; $w.WindowSize=$s;"
cd /d %~dp0backend
npm run dev
pause
