@echo off
echo Starting MIRA Frontend...
:: Set window size and position (10 rows high, fixed location away from left edge)
powershell -Command "$w=(Get-Host).UI.RawUI; $s=$w.WindowSize; $s.Height=10; $w.WindowSize=$s; $p=$w.WindowPosition; $p.X=100; $p.Y=300; $w.WindowPosition=$p"
cd /d %~dp0frontend
npm run dev
pause
