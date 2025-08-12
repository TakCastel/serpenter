// Configuration spécifique pour les tests en CI/CD

// Commandes pour les tests en environnement CI
Cypress.Commands.add('setupCI', () => {
  // Configuration spécifique pour CI
  cy.task('log', 'Configuration CI activée')
  
  // Désactiver les animations pour accélérer les tests
  cy.window().then((win) => {
    win.document.body.style.setProperty('--animation-duration', '0s')
    win.document.body.style.setProperty('--transition-duration', '0s')
  })
  
  // Augmenter les timeouts pour les environnements CI plus lents
  Cypress.config('defaultCommandTimeout', 15000)
  Cypress.config('requestTimeout', 15000)
  Cypress.config('responseTimeout', 15000)
})

// Mock plus robuste pour CI
Cypress.Commands.add('mockLoginCI', () => {
  cy.window().then((win) => {
    // Simuler un utilisateur connecté avec plus de détails pour CI
    const mockUser = {
      uid: 'ci-test-user-id',
      email: 'ci-test@serpenter.com',
      displayName: 'CI Test User',
      emailVerified: true,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      }
    }
    
    win.localStorage.setItem('firebase:authUser:test:[DEFAULT]', JSON.stringify(mockUser))
    
    // Mock des projets pour CI
    const mockProjects = [
      {
        id: 'ci-project-1',
        name: 'CI Test Project',
        description: 'Projet de test pour CI',
        checklistType: 'web-prelaunch',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    ]
    
    win.localStorage.setItem('projects', JSON.stringify(mockProjects))
    win.localStorage.setItem('currentProjectId', 'ci-project-1')
  })
})

// Nettoyage spécifique pour CI
Cypress.Commands.add('cleanupCI', () => {
  cy.window().then((win) => {
    // Nettoyer complètement le localStorage
    win.localStorage.clear()
    
    // Nettoyer les cookies
    cy.clearCookies()
    
    // Nettoyer le sessionStorage
    win.sessionStorage.clear()
  })
})

// Configuration pour les tests parallèles en CI
if (Cypress.env('CI')) {
  beforeEach(() => {
    cy.setupCI()
  })
  
  afterEach(() => {
    cy.cleanupCI()
  })
}
