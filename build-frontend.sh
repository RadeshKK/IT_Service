#!/bin/bash

# Build script for frontend deployment
echo "Building frontend for production..."

# Navigate to client directory
cd client

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building React app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Frontend is ready for deployment."
    echo "📁 Build files are in: client/build/"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
