// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Commandes d'authentification
Cypress.Commands.add('login', (email = Cypress.env('TEST_EMAIL'), password = Cypress.env('TEST_PASSWORD')) => {
  cy.visit('/login')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)
  cy.get('[data-cy="login-button"]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('register', (email = Cypress.env('TEST_EMAIL_2'), password = Cypress.env('TEST_PASSWORD_2')) => {
  cy.visit('/register')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)
  cy.get('[data-cy="register-button"]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should('include', '/login')
})

// Commandes de gestion des projets
Cypress.Commands.add('createProject', (name, description = '', checklistType = 'web-prelaunch') => {
  cy.get('[data-cy="project-name-input"]').type(name)
  if (description) {
    cy.get('[data-cy="project-description-input"]').type(description)
  }
  cy.get(`[data-cy="checklist-type-${checklistType}"]`).click()
  cy.get('[data-cy="create-project-button"]').click()
})

Cypress.Commands.add('selectProject', (projectName) => {
  cy.get('[data-cy="project-selector"]').click()
  cy.get('[data-cy="project-option"]').contains(projectName).click()
})

// Commandes de navigation
Cypress.Commands.add('navigateToPage', (page) => {
  const routes = {
    'dashboard': '/dashboard',
    'login': '/login',
    'register': '/register',
    'help': '/help',
    'home': '/'
  }
  cy.visit(routes[page] || page)
})

// Commandes d'interface utilisateur
Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-cy="theme-toggle"]').click()
})

Cypress.Commands.add('toggleSidebar', () => {
  cy.get('[data-cy="sidebar-toggle"]').click()
})

// Commandes de checklist
Cypress.Commands.add('toggleChecklistItem', (itemId) => {
  cy.get(`[data-cy="checklist-item-${itemId}"]`).click()
})

Cypress.Commands.add('openAccordion', (itemId) => {
  cy.get(`[data-cy="accordion-header-${itemId}"]`).click()
})

Cypress.Commands.add('resetChecklistProgress', () => {
  cy.get('[data-cy="reset-progress-button"]').click()
  cy.get('[data-cy="confirm-reset-button"]').click()
})

// Commandes d'attente et vérification
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.get('[data-cy="loading"]').should('not.exist')
})

Cypress.Commands.add('waitForProjectLoad', () => {
  cy.get('[data-cy="project-selector"]').should('be.visible')
  cy.get('[data-cy="project-loading"]').should('not.exist')
})

// Commandes de vérification d'état
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.url().should('not.include', '/login')
  cy.get('[data-cy="user-menu"]').should('be.visible')
})

Cypress.Commands.add('shouldBeLoggedOut', () => {
  cy.url().should('include', '/login')
  cy.get('[data-cy="user-menu"]').should('not.exist')
})

// Commandes pour les tests responsive
Cypress.Commands.add('testResponsive', (callback) => {
  // Test desktop
  cy.setDesktopViewport()
  callback('desktop')
  
  // Test tablet
  cy.setTabletViewport()
  callback('tablet')
  
  // Test mobile
  cy.setMobileViewport()
  callback('mobile')
})

// Commandes pour simuler l'authentification sans Firebase
Cypress.Commands.add('mockLogin', () => {
  cy.window().then((win) => {
    // Simuler un utilisateur connecté dans localStorage
    win.localStorage.setItem('firebase:authUser:test:[DEFAULT]', JSON.stringify({
      uid: 'test-user-id',
      email: 'test@serpenter.com',
      displayName: 'Test User'
    }))
  })
  cy.reload()
})

Cypress.Commands.add('mockLogout', () => {
  cy.window().then((win) => {
    // Nettoyer l'authentification simulée
    Object.keys(win.localStorage).forEach(key => {
      if (key.includes('firebase:authUser')) {
        win.localStorage.removeItem(key)
      }
    })
  })
  cy.reload()
})
