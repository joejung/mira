cd backend
powershell -Command "$w=(Get-Host).UI.RawUI; $b=$w.BufferSize; $b.Width=150; $b.Height=3000; $w.BufferSize=$b; $s=$w.WindowSize; $s.Width=150; $s.Height=10; $w.WindowSize=$s;"
venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 5000
