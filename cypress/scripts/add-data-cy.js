#!/usr/bin/env node

/**
 * Script pour ajouter automatiquement les attributs data-cy aux composants Vue
 * Usage: node cypress/scripts/add-data-cy.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mappings des sélecteurs vers les attributs data-cy
const dataCyMappings = {
  // Authentification
  'input[type="email"]': 'email-input',
  'input[type="password"]': 'password-input',
  'button[type="submit"]': 'login-button',
  '.google-login': 'google-login-button',
  '.error-message': 'error-message',
  
  // Projets
  '.empty-state': 'empty-state',
  '.project-selector': 'project-selector',
  '.project-dropdown': 'project-dropdown',
  '.create-project': 'create-project-button',
  
  // Checklist
  '.checklist-item': 'checklist-item',
  'input[type="checkbox"]': 'checklist-checkbox',
  '.accordion-header': 'accordion-header',
  '.accordion-content': 'accordion-content',
  '.progress-percentage': 'progress-percentage',
  '.progress-bar': 'progress-bar',
  
  // Interface
  '.theme-toggle': 'theme-toggle',
  '.sidebar': 'sidebar',
  '.sidebar-toggle': 'sidebar-toggle',
  '.app-header': 'app-header',
  '.mobile-menu': 'mobile-menu',
  '.mobile-menu-toggle': 'mobile-menu-toggle'
}

// Fonction pour traiter un fichier Vue
function processVueFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Pour chaque mapping, ajouter l'attribut data-cy si absent
    Object.entries(dataCyMappings).forEach(([selector, dataCy]) => {
      // Regex pour trouver les éléments sans data-cy
      const regex = new RegExp(`<([^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*?)(?!.*data-cy)([^>]*>)`, 'g')
      
      content = content.replace(regex, (match, beforeClass, afterClass) => {
        modified = true
        return `${beforeClass} data-cy="${dataCy}"${afterClass}`
      })
    })

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Modifié: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message)
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath)
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (item.endsWith('.vue')) {
        processVueFile(fullPath)
      }
    })
  } catch (error) {
    console.error(`❌ Erreur lors du parcours de ${dirPath}:`, error.message)
  }
}

// Dossiers à traiter
const foldersToProcess = [
  path.join(__dirname, '../../app/components'),
  path.join(__dirname, '../../app/pages'),
  path.join(__dirname, '../../app/layouts')
]

console.log('🚀 Ajout des attributs data-cy...')

foldersToProcess.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`📁 Traitement du dossier: ${folder}`)
    processDirectory(folder)
  } else {
    console.log(`⚠️ Dossier non trouvé: ${folder}`)
  }
})

console.log('✨ Terminé ! Vérifiez les modifications et ajustez manuellement si nécessaire.')
console.log('📖 Consultez cypress/DATA_CY_GUIDE.md pour la liste complète des attributs requis.')
