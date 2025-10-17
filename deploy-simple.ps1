# deploy-simple.ps1
# Simple deployment since assets are now in git

Write-Host "🚀 Starting simple deployment..." -ForegroundColor Green

# Build the React app
Write-Host "📦 Building React app..." -ForegroundColor Yellow
npm run build

# Move assets from public to build root (where React expects them)
Write-Host "📁 Moving assets to build root..." -ForegroundColor Yellow
if (Test-Path "public\*.png") {
    Copy-Item "public\*.png" "build\" -Force
    Write-Host "✅ PNG files moved to build root" -ForegroundColor Green
}
if (Test-Path "public\*.wav") {
    Copy-Item "public\*.wav" "build\" -Force
    Write-Host "✅ WAV files moved to build root" -ForegroundColor Green
}

# Remove .gitignore from build folder so assets won't be excluded
Write-Host "🗑️ Removing .gitignore from build to allow assets..." -ForegroundColor Yellow
if (Test-Path "build\.gitignore") {
    Remove-Item "build\.gitignore" -Force
    Write-Host "✅ .gitignore removed from build" -ForegroundColor Green
}

# Deploy to GitHub Pages
Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d build

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Your app will be available at: https://metjuperry.github.io/architects-melody" -ForegroundColor Cyan