@echo off
echo 🚀 London Safety Routing System - Quick Setup Script
echo.

echo 📋 Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend dependency installation failed!
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully!
echo.

echo 📋 Step 2: Setting up Environment Configuration...
if not exist .env (
    copy .env.example .env
    echo ✅ Environment file created from example
    echo ⚠️  IMPORTANT: Please edit backend\.env with your database credentials!
    echo    Default credentials are:
    echo    - DB_USER=postgres
    echo    - DB_PASSWORD=postgres
    echo    - DB_NAME=london_safety_routing
) else (
    echo ✅ Environment file already exists
)
echo.

echo 📋 Step 3: Installing Frontend Dependencies...
cd ..
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully!
echo.

echo 🎯 Setup Complete! Next steps:
echo.
echo 1. Ensure PostgreSQL is running with PostGIS extension
echo 2. Create database: london_safety_routing
echo 3. Run: cd backend ^&^& node scripts\optimizeHazardSchema.js
echo 4. Start backend: cd backend ^&^& npm start
echo 5. Start frontend: npm run dev
echo.
echo 📖 For detailed instructions, see SETUP_GUIDE.md
echo.
pause