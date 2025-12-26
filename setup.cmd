@echo off
powershell -Command "$w=(Get-Host).UI.RawUI; $b=$w.BufferSize; $b.Width=150; $b.Height=3000; $w.BufferSize=$b; $s=$w.WindowSize; $s.Width=150; $s.Height=30; $w.WindowSize=$s;"

echo ===================================================
echo     MIRA STARTUP - Environment Setup
echo ===================================================
echo.

echo [1/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend install failed.
    pause
    exit /b %errorlevel%
)
echo [OK] Backend ready.
echo.

echo [2/5] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install failed.
    pause
    exit /b %errorlevel%
)
echo [OK] Frontend ready.
echo.

echo [3/5] Setting up Database (Prisma Generate)...
cd ../backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed.
    pause
    exit /b %errorlevel%
)

echo [4/5] Running Migrations...
call npx prisma migrate dev --name init_or_reset
if %errorlevel% neq 0 (
    echo [ERROR] Database migration failed.
    pause
    exit /b %errorlevel%
)

echo [5/5] Seeding Database (1000 Issues)...
call npx prisma db seed
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
