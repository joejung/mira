@echo off
echo Starting MIRA Backend...
cd /d %~dp0backend
npm run dev
pause
