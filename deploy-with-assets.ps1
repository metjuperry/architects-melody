# deploy-with-assets.ps1
# PowerShell deployment script for Windows

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Build the React app
Write-Host "📦 Building React app..." -ForegroundColor Yellow
npm run build

# Force copy assets to build directory (bypassing gitignore)
Write-Host "📁 Force copying assets to build directory..." -ForegroundColor Yellow

# Create build\assets directory if it doesn't exist
if (-not (Test-Path "build\assets")) {
    New-Item -ItemType Directory -Path "build\assets" -Force
    Write-Host "   Created build\assets directory" -ForegroundColor Gray
}

# Copy PNG files
if (Test-Path "public\*.png") {
    Copy-Item "public\*.png" "build\assets\" -Force
    Write-Host "✅ PNG files copied" -ForegroundColor Green
}

# Copy WAV files
if (Test-Path "public\*.wav") {
    Copy-Item "public\*.wav" "build\assets\" -Force
    Write-Host "✅ WAV files copied" -ForegroundColor Green
}

# List what's in build directory
Write-Host "📋 Files in build directory:" -ForegroundColor Cyan
Get-ChildItem "build" -Name "*.png" | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
Get-ChildItem "build" -Name "*.wav" | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }

# Deploy to GitHub Pages - this commits the assets to gh-pages branch
Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d build

# Clean up - remove assets from local build folder
Write-Host "🧹 Cleaning up local build assets..." -ForegroundColor Yellow
if (Test-Path "build\assets") {
    Remove-Item -Path "build\assets" -Recurse -Force
    Write-Host "✅ Local build assets cleaned up" -ForegroundColor Green
}

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Your app will be available at: https://metjuperry.github.io/architects-melody" -ForegroundColor Cyan