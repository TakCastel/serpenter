#!/bin/bash

# Script pour préparer les fichiers pour Vercel
echo "🚀 Préparation des fichiers pour Vercel..."

# Nettoyer les anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf .output .vercel/output

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build local
echo "🔨 Build local en cours..."
npm run build

# Créer le dossier .vercel/output
echo "📁 Création du dossier .vercel/output..."
mkdir -p .vercel/output

# Copier les fichiers vers .vercel/output
echo "📋 Copie des fichiers vers .vercel/output..."
cp -r .output/* .vercel/output/

echo "✅ Fichiers préparés pour Vercel !"
echo "📝 Pour déployer : vercel --prod"
