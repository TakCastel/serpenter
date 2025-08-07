# Script pour préparer les fichiers pour Vercel (PowerShell)
Write-Host "Préparation des fichiers pour Vercel..." -ForegroundColor Green

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

# Créer le dossier .vercel/output
Write-Host "Création du dossier .vercel/output..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".vercel/output"

# Copier les fichiers vers .vercel/output
Write-Host "Copie des fichiers vers .vercel/output..." -ForegroundColor Yellow
Copy-Item -Recurse -Force ".output/*" ".vercel/output/"

Write-Host "Fichiers préparés pour Vercel !" -ForegroundColor Green
Write-Host "Pour déployer : vercel --prod" -ForegroundColor Cyan
