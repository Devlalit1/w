@echo off
REM DevVerse AI - Setup Script for Windows
REM Run this to initialize the entire project

echo.
echo 🚀 DevVerse AI - Project Setup
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    exit /b 1
)

REM Run Python generator
echo 📁 Generating project structure...
python generate-project.py

REM Check if pnpm is installed
where pnpm >nul 2>&1
if errorlevel 1 (
    echo Installing pnpm...
    npm install -g pnpm
)

echo.
echo 📦 Installing dependencies...
call pnpm install

echo.
echo 🔧 Setting up backend...
cd apps\backend
call pnpm install
cd ..\..

echo.
echo 🎨 Setting up frontend...
cd apps\web
call pnpm install
cd ..\..

echo.
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Configure .env file in apps/backend/.env
echo 2. Configure .env.local file in apps/web/.env.local
echo 3. Run 'pnpm dev' to start development servers
echo.
pause
