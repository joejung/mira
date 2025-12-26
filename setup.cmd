@echo off
powershell -Command "$w=(Get-Host).UI.RawUI; $b=$w.BufferSize; $b.Width=150; $b.Height=3000; $w.BufferSize=$b; $s=$w.WindowSize; $s.Width=150; $s.Height=30; $w.WindowSize=$s;"

echo ===================================================
echo     MIRA STARTUP - Environment Setup
echo ===================================================
echo.

echo [1/4] Installing Backend Dependencies (Python)...
cd backend
python -m venv venv
call venv\Scripts\pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Backend install failed.
    pause
    exit /b %errorlevel%
)
echo [OK] Backend ready.
echo.

echo [2/4] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install failed.
    pause
    exit /b %errorlevel%
)
echo [OK] Frontend ready.
echo.

echo [3/4] Seeding Database (Python)...
cd ../backend
call venv\Scripts\python seed.py
if %errorlevel% neq 0 (
    echo [ERROR] Database seeding failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   SETUP COMPLETE! 🚀
echo ===================================================
echo.
echo You can now run the app using 'run_all.cmd'
echo.
cd ..
pause
