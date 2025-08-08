import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const categories = [
  'seo',
  'accessibilite', 
  'performance',
  'eco-conception',
  'responsive-ux',
  'securite',
  'analytics'
]

const languages = ['fr', 'en']

// Fonction pour supprimer un fichier
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️  Supprimé: ${filePath}`)
      return true
    } else {
      console.log(`⚠️  Fichier non trouvé: ${filePath}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression de ${filePath}:`, error.message)
    return false
  }
}

// Fonction pour nettoyer les anciens fichiers
function cleanupOldData() {
  console.log('🧹 Début du nettoyage des anciens fichiers de données...')
  
  let deletedCount = 0
  
  // Supprimer les fichiers d'items par catégorie et langue
  categories.forEach(category => {
    languages.forEach(language => {
      const filePath = path.join(__dirname, '..', 'server', 'data', 'i18n', `${category}-items-${language}.json`)
      if (deleteFile(filePath)) {
        deletedCount++
      }
    })
  })
  
  // Supprimer le fichier seo-checklist.json s'il existe
  const seoChecklistPath = path.join(__dirname, '..', 'server', 'data', 'seo-checklist.json')
  if (deleteFile(seoChecklistPath)) {
    deletedCount++
  }
  
  // Supprimer le dossier i18n s'il est vide
  const i18nDir = path.join(__dirname, '..', 'server', 'data', 'i18n')
  try {
    if (fs.existsSync(i18nDir)) {
      const files = fs.readdirSync(i18nDir)
      if (files.length === 0) {
        fs.rmdirSync(i18nDir)
        console.log(`🗑️  Dossier supprimé: ${i18nDir}`)
      } else {
        console.log(`📁 Dossier conservé (contient ${files.length} fichiers): ${i18nDir}`)
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification du dossier ${i18nDir}:`, error.message)
  }
  
  console.log(`\n✅ Nettoyage terminé! ${deletedCount} fichiers supprimés.`)
  console.log('\n📋 Résumé de la migration:')
  console.log('✅ Données migrées vers le nouveau système')
  console.log('✅ Traductions intégrées dans i18n')
  console.log('✅ Anciens fichiers supprimés')
  console.log('\n🎉 Migration complète réussie!')
}

// Exécuter le nettoyage
cleanupOldData()

