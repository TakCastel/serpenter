# Script de déploiement pour Vercel (PowerShell)
Write-Host "Début du déploiement..." -ForegroundColor Green

# Nettoyer les anciens builds
Write-Host "Nettoyage des anciens builds..." -ForegroundColor Yellow
if (Test-Path ".output") { Remove-Item -Recurse -Force ".output" }
if (Test-Path ".vercel/output") { Remove-Item -Recurse -Force ".vercel/output" }

# Installation des dépendances
Write-Host "Installation des dépendances..." -ForegroundColor Yellow
npm ci

# Build local
Write-Host "Build local en cours..." -ForegroundColor Yellow
npm run build

# Copier les fichiers vers .vercel/output
Write-Host "Copie des fichiers vers .vercel/output..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".vercel/output"
Copy-Item -Recurse -Force ".output/*" ".vercel/output/"

# Déploiement sur Vercel
Write-Host "Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "Déploiement terminé !" -ForegroundColor Green
