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

// Fonction pour lire un fichier JSON
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message)
    return null
  }
}

// Fonction pour convertir un item vers le nouveau format
function convertItemToNewFormat(item, category, language) {
  const itemKey = item.id.replace(/-/g, '') // Enlever les tirets pour la clé
  const categoryKey = category.replace('-', '') // Enlever les tirets pour la clé
  
  return {
    id: item.id,
    labelKey: `items.${categoryKey}.${itemKey}.label`,
    descriptionKey: `items.${categoryKey}.${itemKey}.description`,
    details: {
      explicationKey: `items.${categoryKey}.${itemKey}.explication`,
      commentFaireKey: `items.${categoryKey}.${itemKey}.commentFaire`,
      bonnesPratiquesKey: `items.${categoryKey}.${itemKey}.bonnesPratiques`,
      exempleKey: `items.${categoryKey}.${itemKey}.exemple`
    }
  }
}

// Fonction pour générer les traductions
function generateTranslations(items, category, language) {
  const categoryKey = category.replace('-', '')
  const translations = {}
  
  items.forEach(item => {
    const itemKey = item.id.replace(/-/g, '')
    
    if (!translations[categoryKey]) {
      translations[categoryKey] = {}
    }
    
    translations[categoryKey][itemKey] = {
      label: item.label,
      description: item.description,
      explication: item.details.explication,
      commentFaire: item.details.commentFaire,
      bonnesPratiques: item.details.bonnesPratiques,
      exemple: item.details.exemple
    }
  })
  
  return translations
}

// Fonction principale de migration
function migrateData() {
  console.log('🚀 Début de la migration des données de checklist...')
  
  // Structure pour le fichier JSON global
  const globalChecklistData = {}
  
  // Structure pour les traductions
  const translations = {
    fr: { items: {} },
    en: { items: {} }
  }
  
  // Traiter chaque catégorie
  categories.forEach(category => {
    console.log(`\n📁 Traitement de la catégorie: ${category}`)
    
    const items = []
    
    // Traiter chaque langue
    languages.forEach(language => {
      const filePath = path.join(__dirname, '..', 'server', 'data', 'i18n', `${category}-items-${language}.json`)
      
      if (fs.existsSync(filePath)) {
        const data = readJsonFile(filePath)
        
        if (data && data.items) {
          console.log(`  ✅ ${language}: ${data.items.length} items trouvés`)
          
          // Pour la première langue (fr), créer la structure globale
          if (language === 'fr') {
            data.items.forEach(item => {
              items.push(convertItemToNewFormat(item, category, language))
            })
          }
          
          // Ajouter les traductions
          const categoryTranslations = generateTranslations(data.items, category, language)
          translations[language].items[category.replace('-', '')] = categoryTranslations[category.replace('-', '')]
        }
      } else {
        console.log(`  ⚠️  Fichier non trouvé: ${filePath}`)
      }
    })
    
    // Ajouter la catégorie au fichier global
    globalChecklistData[category] = {
      items: items
    }
  })
  
  // Écrire le fichier JSON global
  const globalFilePath = path.join(__dirname, '..', 'app', 'data', 'checklist-items.json')
  fs.writeFileSync(globalFilePath, JSON.stringify(globalChecklistData, null, 2))
  console.log(`\n✅ Fichier global créé: ${globalFilePath}`)
  
  // Mettre à jour les fichiers de traduction
  languages.forEach(language => {
    const translationFilePath = path.join(__dirname, '..', 'i18n', 'locales', `${language}.json`)
    
    if (fs.existsSync(translationFilePath)) {
      const existingTranslations = readJsonFile(translationFilePath)
      
      // Fusionner les nouvelles traductions
      if (!existingTranslations.items) {
        existingTranslations.items = {}
      }
      
      Object.assign(existingTranslations.items, translations[language].items)
      
      // Écrire le fichier mis à jour
      fs.writeFileSync(translationFilePath, JSON.stringify(existingTranslations, null, 2))
      console.log(`✅ Traductions ${language} mises à jour: ${translationFilePath}`)
    }
  })
  
  console.log('\n🎉 Migration terminée avec succès!')
  console.log('\n📊 Résumé:')
  console.log(`- ${Object.keys(globalChecklistData).length} catégories traitées`)
  console.log(`- ${languages.length} langues traitées`)
  
  // Compter le nombre total d'items
  let totalItems = 0
  Object.values(globalChecklistData).forEach(category => {
    totalItems += category.items.length
  })
  console.log(`- ${totalItems} items au total`)
}

// Exécuter la migration
migrateData()

