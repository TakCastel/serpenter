#!/usr/bin/env node

// Script de build optimisé pour Vercel
const { spawn } = require('child_process');

// Configuration mémoire
process.env.NODE_OPTIONS = '--max-old-space-size=3072 --optimize-for-size';

console.log('🚀 Démarrage du build optimisé...');

const build = spawn('npx', ['nuxt', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NITRO_PRESET: 'vercel',
    NODE_ENV: 'production'
  }
});

build.on('close', (code) => {
  console.log(`✅ Build terminé avec le code: ${code}`);
  process.exit(code);
});

build.on('error', (err) => {
  console.error('❌ Erreur lors du build:', err);
  process.exit(1);
});
