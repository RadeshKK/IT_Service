@echo off
echo 🚀 Setting up Smart IT Service Tracker...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...

REM Root dependencies
call npm install

REM Server dependencies
cd server
call npm install

REM Client dependencies
cd ..\client
call npm install

cd ..

echo ✅ Dependencies installed

REM Create environment files
echo ⚙️  Setting up environment files...

REM Server .env
if not exist server\.env (
    copy server\env.example server\.env
    echo 📝 Created server\.env file. Please update with your database credentials.
) else (
    echo 📝 server\.env already exists
)

REM Client .env
if not exist client\.env (
    echo REACT_APP_API_URL=http://localhost:5000/api > client\.env
    echo 📝 Created client\.env file
) else (
    echo 📝 client\.env already exists
)

echo ✅ Environment files created

REM Database setup instructions
echo.
echo 🗄️  Database Setup Required:
echo 1. Create a PostgreSQL database named 'smart_it_tracker'
echo 2. Update server\.env with your database credentials
echo 3. Run: cd server ^&^& npm run migrate
echo.

REM Final instructions
echo 🎉 Setup complete! Next steps:
echo 1. Configure your database in server\.env
echo 2. Run database migration: cd server ^&^& npm run migrate
echo 3. Start the application: npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo Default login credentials:
echo Admin: admin@company.com / admin123
echo User: john.doe@company.com / password123
echo.
echo Happy coding! 🚀
pause
