#!/usr/bin/env pwsh
# Script PowerShell pour builder et préparer le déploiement Netlify

Write-Host "🚀 Building for Netlify deployment..." -ForegroundColor Green

# Nettoyer les anciens builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".output") { Remove-Item -Recurse -Force ".output" }
if (Test-Path ".netlify") { Remove-Item -Recurse -Force ".netlify" }

# Builder l'application avec informations de version
Write-Host "🔨 Building application with version info..." -ForegroundColor Yellow
npm run build:versioned

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Créer le répertoire Netlify et copier les fichiers
Write-Host "📦 Preparing Netlify artifacts..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".netlify/publish" | Out-Null
Copy-Item -Recurse -Force ".output/public/*" ".netlify/publish/"

# Vérifier que les fichiers sont bien copiés
$fileCount = (Get-ChildItem -Recurse ".netlify/publish").Count
Write-Host "✅ Copied $fileCount files to .netlify/publish/" -ForegroundColor Green

Write-Host "🎉 Ready for Netlify deployment!" -ForegroundColor Green
Write-Host "Now run: git add . && git commit -m 'Add build artifacts' && git push" -ForegroundColor Cyan
