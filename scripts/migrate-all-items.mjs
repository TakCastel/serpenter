import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Chemins
const sourceDir = path.join(__dirname, '../public/data/i18n')
const targetFile = path.join(__dirname, '../app/data/checklist-items.json')
const frTranslationsFile = path.join(__dirname, '../i18n/locales/fr.json')
const enTranslationsFile = path.join(__dirname, '../i18n/locales/en.json')

// Fonction pour convertir un ID en clé camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

// Fonction pour lire un fichier JSON
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error.message)
    return null
  }
}

// Fonction pour écrire un fichier JSON
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    console.log(`✅ Fichier écrit: ${filePath}`)
  } catch (error) {
    console.error(`❌ Erreur écriture ${filePath}:`, error.message)
  }
}

// Fonction pour migrer les items d'une catégorie
function migrateCategoryItems(categoryId, frItems, enItems) {
  const items = []
  
  for (const frItem of frItems) {
    const enItem = enItems.find(item => item.id === frItem.id)
    if (!enItem) {
      console.warn(`⚠️ Item ${frItem.id} non trouvé en anglais`)
      continue
    }

    const camelCaseId = toCamelCase(frItem.id)
    
    const item = {
      id: frItem.id,
      labelKey: `items.${categoryId}.${camelCaseId}.label`,
      descriptionKey: `items.${categoryId}.${camelCaseId}.description`,
      details: {
        explicationKey: `items.${categoryId}.${camelCaseId}.explication`,
        commentFaireKey: `items.${categoryId}.${camelCaseId}.commentFaire`,
        bonnesPratiquesKey: `items.${categoryId}.${camelCaseId}.bonnesPratiques`,
        exemple: enItem.details?.exemple || frItem.details?.exemple || {}
      }
    }
    
    items.push(item)
  }
  
  return items
}

// Fonction pour migrer les traductions
function migrateTranslations(categoryId, frItems, enItems) {
  const frTranslations = {}
  const enTranslations = {}
  
  for (const frItem of frItems) {
    const enItem = enItems.find(item => item.id === frItem.id)
    if (!enItem) continue
    
    const camelCaseId = toCamelCase(frItem.id)
    
    // Traductions françaises
    frTranslations[camelCaseId] = {
      label: frItem.label,
      description: frItem.description,
      explication: frItem.details?.explication || '',
      commentFaire: frItem.details?.commentFaire || [],
      bonnesPratiques: frItem.details?.bonnesPratiques || []
    }
    
    // Traductions anglaises
    enTranslations[camelCaseId] = {
      label: enItem.label,
      description: enItem.description,
      explication: enItem.details?.explication || '',
      commentFaire: enItem.details?.commentFaire || [],
      bonnesPratiques: enItem.details?.bonnesPratiques || []
    }
  }
  
  return { frTranslations, enTranslations }
}

// Fonction principale
async function migrateAllItems() {
  console.log('🚀 Début de la migration de tous les items...')
  
  // Lire les fichiers existants
  const existingData = readJsonFile(targetFile) || {}
  const frTranslations = readJsonFile(frTranslationsFile) || {}
  const enTranslations = readJsonFile(enTranslationsFile) || {}
  
  // Catégories à migrer
  const categories = [
    'seo',
    'accessibilite', 
    'performance',
    'eco-conception',
    'responsive-ux',
    'securite',
    'analytics'
  ]
  
  let totalItems = 0
  
  for (const categoryId of categories) {
    console.log(`\n📁 Migration de la catégorie: ${categoryId}`)
    
    const frFile = path.join(sourceDir, `${categoryId}-items-fr.json`)
    const enFile = path.join(sourceDir, `${categoryId}-items-en.json`)
    
    const frData = readJsonFile(frFile)
    const enData = readJsonFile(enFile)
    
    if (!frData || !enData) {
      console.warn(`⚠️ Fichiers manquants pour ${categoryId}`)
      continue
    }
    
    // Migrer les items
    const items = migrateCategoryItems(categoryId, frData.items, enData.items)
    
    // Migrer les traductions
    const { frTranslations: categoryFr, enTranslations: categoryEn } = migrateTranslations(categoryId, frData.items, enData.items)
    
    // Ajouter à la structure principale
    existingData[categoryId] = {
      items: items
    }
    
    // Ajouter les traductions
    if (!frTranslations.items) frTranslations.items = {}
    if (!enTranslations.items) enTranslations.items = {}
    
    if (!frTranslations.items[categoryId]) frTranslations.items[categoryId] = {}
    if (!enTranslations.items[categoryId]) enTranslations.items[categoryId] = {}
    
    frTranslations.items[categoryId] = { ...frTranslations.items[categoryId], ...categoryFr }
    enTranslations.items[categoryId] = { ...enTranslations.items[categoryId], ...categoryEn }
    
    console.log(`✅ ${categoryId}: ${items.length} items migrés`)
    totalItems += items.length
  }
  
  // Écrire les fichiers
  writeJsonFile(targetFile, existingData)
  writeJsonFile(frTranslationsFile, frTranslations)
  writeJsonFile(enTranslationsFile, enTranslations)
  
  console.log(`\n🎉 Migration terminée! ${totalItems} items migrés au total.`)
}

// Exécuter la migration
migrateAllItems().catch(console.error)
