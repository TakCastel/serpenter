#!/bin/bash

echo "🚀 Déploiement du hotfix Lighthouse..."

# Vérifier que Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI non trouvé. Installation..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI détecté"

# Aller dans le répertoire des fonctions
cd netlify/functions

# Installer les nouvelles dépendances
echo "📦 Installation des nouvelles dépendances..."
npm install

# Retourner au répertoire racine
cd ../..

# Déployer uniquement les fonctions
echo "🚀 Déploiement des fonctions..."
netlify deploy --prod --functions

echo "✅ Hotfix déployé avec succès!"
echo "🔍 Testez maintenant l'audit Lighthouse"
