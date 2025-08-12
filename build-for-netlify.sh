#!/bin/bash
# Script bash pour builder et préparer le déploiement Netlify

echo "🚀 Building for Netlify deployment..."

# Nettoyer les anciens builds
echo "🧹 Cleaning previous builds..."
rm -rf .output .netlify

# Builder l'application avec informations de version
echo "🔨 Building application with version info..."
npm run build:versioned

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Créer le répertoire Netlify et copier les fichiers
echo "📦 Preparing Netlify artifacts..."
mkdir -p .netlify/publish
cp -r .output/public/* .netlify/publish/

# Vérifier que les fichiers sont bien copiés
file_count=$(find .netlify/publish -type f | wc -l)
echo "✅ Copied $file_count files to .netlify/publish/"

echo "🎉 Ready for Netlify deployment!"
echo "Now run: git add . && git commit -m 'Add build artifacts' && git push"
