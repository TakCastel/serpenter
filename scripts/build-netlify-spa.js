#!/usr/bin/env node

/**
 * Script de build optimisé pour Netlify en mode SPA
 * Désactive le SSR et optimise pour le déploiement statique
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🚀 Démarrage du build Netlify en mode SPA...');

  // Variables d'environnement pour le build
  const buildEnv = {
    NODE_ENV: 'production',
    NUXT_APP_ENV: 'production',
    BUILD_DATE: new Date().toISOString(),
    BUILD_HASH: process.env.COMMIT_REF || 'dev',
    // Désactiver explicitement le SSR
    NUXT_SSR: 'false',
    // Configuration pour Node.js 20
    NODE_OPTIONS: '--max-old-space-size=4096'
  };

// Appliquer les variables d'environnement
Object.entries(buildEnv).forEach(([key, value]) => {
  process.env[key] = value;
  console.log(`📝 ${key}=${value}`);
});

try {
  // Nettoyer les builds précédents
  console.log('🧹 Nettoyage des builds précédents...');
  if (process.platform === 'win32') {
    try {
      execSync('rmdir /s /q .nuxt 2>nul', { stdio: 'inherit' });
    } catch (e) {}
    try {
      execSync('rmdir /s /q dist 2>nul', { stdio: 'inherit' });
    } catch (e) {}
    try {
      execSync('rmdir /s /q .output 2>nul', { stdio: 'inherit' });
    } catch (e) {}
  } else {
    execSync('rm -rf .nuxt dist .output', { stdio: 'inherit' });
  }
  
  // Build avec Nuxt
  console.log('🔨 Build Nuxt en cours...');
  execSync('npx nuxi build', { 
    stdio: 'inherit',
    env: { ...process.env, ...buildEnv }
  });
  
  // Créer le dossier de publication Netlify
  const publishDir = '.netlify/publish';
  mkdirSync(publishDir, { recursive: true });
  
  // Copier les fichiers de build
  console.log('📁 Copie des fichiers de build...');
  if (process.platform === 'win32') {
    // Utiliser une approche simple avec PowerShell pour Windows
    execSync(`powershell -Command "Copy-Item -Path '.output\\public\\*' -Destination '${publishDir}' -Recurse -Force"`, { stdio: 'inherit' });
  } else {
    execSync(`cp -r .output/public/* ${publishDir}/`, { stdio: 'inherit' });
  }
  
  // Créer un fichier _redirects pour le mode SPA
  const redirectsContent = `# Configuration SPA pour Netlify
/*    /index.html   200

# Assets Nuxt
/_nuxt/*    /_nuxt/:splat    200`;

  writeFileSync(join(publishDir, '_redirects'), redirectsContent);
  console.log('📄 Fichier _redirects créé');
  
  // Créer un fichier _headers pour les headers HTTP
  const headersContent = `# Headers de sécurité et performance
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# Cache pour les assets Nuxt
/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

# Cache pour les images
*.{jpg,jpeg,png,gif,ico,svg,webp}
  Cache-Control: public, max-age=31536000, immutable`;

  writeFileSync(join(publishDir, '_headers'), headersContent);
  console.log('📄 Fichier _headers créé');
  
  console.log('✅ Build Netlify SPA terminé avec succès !');
  console.log(`📁 Fichiers disponibles dans: ${publishDir}`);
  
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}
