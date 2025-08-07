# Script de build optimisé pour Vercel (PowerShell)
Write-Host "Build optimisé pour Vercel..." -ForegroundColor Green

# Variables d'environnement pour optimiser la mémoire
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NITRO_PRESET = "vercel"

# Build avec optimisations
Write-Host "Build en cours..." -ForegroundColor Yellow
npx nuxt build

Write-Host "Build terminé !" -ForegroundColor Green
