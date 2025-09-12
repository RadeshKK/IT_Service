@echo off
REM Build script for frontend deployment on Windows
echo Building frontend for production...

REM Navigate to client directory
cd client

REM Install dependencies
echo Installing dependencies...
npm install

REM Build the project
echo Building React app...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful! Frontend is ready for deployment.
    echo 📁 Build files are in: client/build/
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)
