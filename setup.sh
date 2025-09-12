#!/bin/bash

# Smart IT Service Tracker Setup Script
echo "🚀 Setting up Smart IT Service Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."

# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install

cd ..

echo "✅ Dependencies installed"

# Create environment files
echo "⚙️  Setting up environment files..."

# Server .env
if [ ! -f server/.env ]; then
    cp server/env.example server/.env
    echo "📝 Created server/.env file. Please update with your database credentials."
else
    echo "📝 server/.env already exists"
fi

# Client .env
if [ ! -f client/.env ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > client/.env
    echo "📝 Created client/.env file"
else
    echo "📝 client/.env already exists"
fi

echo "✅ Environment files created"

# Database setup instructions
echo ""
echo "🗄️  Database Setup Required:"
echo "1. Create a PostgreSQL database named 'smart_it_tracker'"
echo "2. Update server/.env with your database credentials"
echo "3. Run: cd server && npm run migrate"
echo ""

# Final instructions
echo "🎉 Setup complete! Next steps:"
echo "1. Configure your database in server/.env"
echo "2. Run database migration: cd server && npm run migrate"
echo "3. Start the application: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Default login credentials:"
echo "Admin: admin@company.com / admin123"
echo "User: john.doe@company.com / password123"
echo ""
echo "Happy coding! 🚀"
