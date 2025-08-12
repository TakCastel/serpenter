#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Obtenir les informations de build
const buildDate = new Date().toISOString()
const buildHash = process.env.GITHUB_SHA || process.env.NETLIFY_COMMIT_REF || 'local'
const buildEnv = process.env.NODE_ENV || 'production'

console.log('🏗️  Building with version info...')
console.log(`📅 Build Date: ${buildDate}`)
console.log(`🔗 Build Hash: ${buildHash}`)
console.log(`🌍 Environment: ${buildEnv}`)

// Créer un fichier de build info
const buildInfo = {
  buildDate,
  buildHash,
  buildEnv,
  timestamp: Date.now()
}

// Écrire le fichier build-info.json
const buildInfoPath = path.join(process.cwd(), 'build-info.json')
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2))

console.log(`✅ Build info written to ${buildInfoPath}`)

// Définir les variables d'environnement pour le build
process.env.BUILD_DATE = buildDate
process.env.BUILD_HASH = buildHash
process.env.NODE_ENV = buildEnv

// Lancer le build
try {
  console.log('🚀 Starting build process...')
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully!')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}
