@echo off
REM Start VendorBridge Frontend & Backend

echo.
echo ========================================
echo Starting VendorBridge Frontend & Backend
echo ========================================
echo.

REM Start Backend in new window
echo Starting Backend Server (Port 5000)...
start cmd /k "cd VendorBridge\backend && npm install && node server.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting Frontend (Port 5173)...
start cmd /k "cd VendorBridge\client && npm install && npm run dev"

echo.
echo ========================================
echo ✅ Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Close the cmd windows when done.
