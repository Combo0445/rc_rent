@echo off
REM Quick Start Script for Car Rental Platform (Windows)
REM This script starts both frontend and backend servers

echo.
echo ========================================
echo Car Rental Platform - Quick Start
echo ========================================
echo.

echo Starting Backend...
echo.
cd car-rental-backend
call npm install
start "Backend - Car Rental" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak

echo Starting Frontend...
echo.
call npm install
start "Frontend - Car Rental" cmd /k "npm run dev"

echo.
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
pause
