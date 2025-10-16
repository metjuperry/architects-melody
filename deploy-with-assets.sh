#!/bin/bash
# deploy-with-assets.sh
# Deployment script that builds the app and copies assets before deploying

echo "🚀 Starting deployment process..."

# Build the React app
echo "📦 Building React app..."
npm run build

# Copy assets to build folder (these won't be in git)
echo "📁 Copying assets to build folder..."
cp -r public/assets/* build/assets/ 2>/dev/null || {
    echo "⚠️  No assets found in public/assets/ - continuing without assets"
}

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🔗 Your app will be available at: https://yourusername.github.io/repository-name/"