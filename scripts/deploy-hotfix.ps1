# Script de déploiement rapide pour le hotfix Lighthouse
Write-Host "🚀 Déploiement du hotfix Lighthouse..." -ForegroundColor Green

# Vérifier que Netlify CLI est installé
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI non trouvé. Installation..." -ForegroundColor Red
    npm install -g netlify-cli
}

# Aller dans le répertoire des fonctions
Set-Location "netlify/functions"

# Installer les nouvelles dépendances
Write-Host "📦 Installation des nouvelles dépendances..." -ForegroundColor Yellow
npm install

# Retourner au répertoire racine
Set-Location "../.."

# Déployer uniquement les fonctions
Write-Host "🚀 Déploiement des fonctions..." -ForegroundColor Yellow
netlify deploy --prod --functions

Write-Host "✅ Hotfix déployé avec succès!" -ForegroundColor Green
Write-Host "🔍 Testez maintenant l'audit Lighthouse" -ForegroundColor Cyan
