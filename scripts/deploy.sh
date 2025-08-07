#!/bin/bash

# Script de déploiement pour Vercel
echo "🚀 Début du déploiement..."

# Nettoyer les anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf .output .vercel/output

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build local
echo "🔨 Build local en cours..."
npm run build

# Copier les fichiers vers .vercel/output
echo "📁 Copie des fichiers vers .vercel/output..."
mkdir -p .vercel/output
cp -r .output/* .vercel/output/

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
