// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Configuration globale pour tous les tests
beforeEach(() => {
  // Nettoyer le localStorage avant chaque test
  cy.clearLocalStorage()
  
  // Nettoyer les cookies
  cy.clearCookies()
  
  // Intercepter les requêtes Firebase pour éviter les erreurs en mode test
  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', { fixture: 'auth-response.json' }).as('firebaseAuth')
  cy.intercept('POST', '**/firestore.googleapis.com/**', { fixture: 'firestore-response.json' }).as('firestore')
})

// Configuration pour gérer les erreurs non capturées
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorer certaines erreurs Firebase en mode test
  if (err.message.includes('Firebase') || err.message.includes('auth')) {
    return false
  }
  // Laisser passer les autres erreurs
  return true
})

// Configuration pour les tests responsive
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667) // iPhone SE
})

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024) // iPad
})

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720) // Desktop
})
