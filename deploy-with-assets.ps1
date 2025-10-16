# deploy-with-assets.ps1
# PowerShell deployment script for Windows

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Build the React app
Write-Host "📦 Building React app..." -ForegroundColor Yellow
npm run build

# Copy assets to build folder (these won't be in git)
Write-Host "📁 Copying assets to build folder..." -ForegroundColor Yellow
if (Test-Path "public\assets") {
    Copy-Item "public\assets\*" "build\assets\" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Assets copied successfully" -ForegroundColor Green
}
else {
    Write-Host "⚠️  No assets found in public\assets\ - continuing without assets" -ForegroundColor Yellow
}

# Deploy to GitHub Pages
Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Your app will be available at: https://yourusername.github.io/repository-name/" -ForegroundColor Cyan