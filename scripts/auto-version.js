#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuration des types de version
const VERSION_TYPES = {
  FEATURE: 'minor',    // 1.0.0 -> 1.1.0
  HOTFIX: 'patch',     // 1.0.0 -> 1.0.1
  MAJOR: 'major'       // 1.0.0 -> 2.0.0 (pour breaking changes)
}

// Détecter le type de merge en analysant les commits
function detectMergeType() {
  try {
    // Obtenir les commits depuis le dernier tag ou depuis develop
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"', { encoding: 'utf8' }).trim()
    
    // Obtenir les commits depuis le dernier tag
    const commits = execSync(`git log ${lastTag}..HEAD --oneline --grep="feat:" --grep="fix:" --grep="BREAKING CHANGE:"`, { encoding: 'utf8' })
    
    // Analyser les commits pour déterminer le type
    if (commits.includes('BREAKING CHANGE:')) {
      return VERSION_TYPES.MAJOR
    } else if (commits.includes('feat:')) {
      return VERSION_TYPES.FEATURE
    } else if (commits.includes('fix:')) {
      return VERSION_TYPES.HOTFIX
    } else {
      // Par défaut, considérer comme une feature
      return VERSION_TYPES.FEATURE
    }
  } catch (error) {
    console.log('⚠️  Impossible de détecter le type de merge, utilisation du type par défaut (feature)')
    return VERSION_TYPES.FEATURE
  }
}

// Mettre à jour la version
function updateVersion(versionType) {
  try {
    console.log(`🔄 Mise à jour de la version (${versionType})...`)
    
    // Utiliser npm version pour mettre à jour la version
    execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' })
    
    // Lire la nouvelle version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const newVersion = packageJson.version
    
    console.log(`✅ Version mise à jour : ${newVersion}`)
    
    // Créer un commit pour la mise à jour de version
    execSync('git add package.json package-lock.json', { stdio: 'inherit' })
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' })
    
    // Créer un tag git
    execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`, { stdio: 'inherit' })
    
    console.log(`🏷️  Tag git créé : v${newVersion}`)
    
    return newVersion
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de version:', error.message)
    process.exit(1)
  }
}

// Fonction principale
function main() {
  console.log('🚀 Gestion automatique des versions...')
  
  // Détecter le type de merge
  const mergeType = detectMergeType()
  console.log(`📊 Type de merge détecté : ${mergeType}`)
  
  // Mettre à jour la version
  const newVersion = updateVersion(mergeType)
  
  // Afficher un résumé
  console.log('\n🎉 Résumé de la mise à jour de version :')
  console.log(`   Type : ${mergeType}`)
  console.log(`   Nouvelle version : ${newVersion}`)
  console.log(`   Tag git : v${newVersion}`)
  
  console.log('\n💡 Prochaines étapes :')
  console.log('   1. Pousser les changements : git push origin <branch>')
  console.log('   2. Pousser le tag : git push origin v' + newVersion)
}

// Exécuter le script
if (require.main === module) {
  main()
}

module.exports = { detectMergeType, updateVersion }
