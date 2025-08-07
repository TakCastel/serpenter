#!/bin/bash

# Script de build optimisé pour Vercel
echo "🚀 Build optimisé pour Vercel..."

# Variables d'environnement pour optimiser la mémoire
export NODE_OPTIONS="--max-old-space-size=4096"
export NITRO_PRESET="vercel"

# Build avec optimisations
echo "🔨 Build en cours..."
nuxt build

echo "✅ Build terminé !"
