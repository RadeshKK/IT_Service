#!/bin/bash

# Custom build script for Render deployment
echo "Starting custom build process..."

# Set permissions
chmod +x node_modules/.bin/react-scripts

# Build with proper permissions
echo "Building React app..."
CI=false npx react-scripts build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in: build/"
else
    echo "❌ Build failed."
    exit 1
fi
