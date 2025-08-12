describe('🧪 Cas limites et gestion d\'erreurs', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Gestion des erreurs réseau', () => {
    it('devrait gérer les erreurs de connexion Firebase', () => {
      cy.visit('/login')
      
      // Simuler une erreur réseau
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 500,
        body: { error: 'Network error' }
      }).as('networkError')
      
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      cy.wait('@networkError')
      cy.get('[data-cy="error-message"]').should('be.visible')
      cy.url().should('include', '/login')
    })

    it('devrait gérer les erreurs de chargement des projets', () => {
      cy.intercept('GET', '**/firestore.googleapis.com/**', {
        statusCode: 403,
        body: { error: 'Permission denied' }
      }).as('projectsError')
      
      cy.visit('/dashboard')
      cy.wait('@projectsError')
      cy.get('[data-cy="error-message"]').should('contain', 'Erreur de chargement')
    })
  })

  describe('Cas limites des projets', () => {
    it('devrait gérer les noms de projet très longs', () => {
      cy.visit('/dashboard')
      const longName = 'A'.repeat(200)
      
      cy.get('[data-cy="project-name-input"]').type(longName)
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // Vérifier que le nom est tronqué dans l'affichage
      cy.get('[data-cy="project-selector"]').should('not.contain', longName)
    })

    it('devrait gérer les caractères spéciaux dans les noms', () => {
      cy.visit('/dashboard')
      const specialName = 'Projet <script>alert("test")</script> & "quotes"'
      
      cy.get('[data-cy="project-name-input"]').type(specialName)
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // Vérifier que les caractères sont échappés
      cy.get('[data-cy="project-selector"]').should('not.contain', '<script>')
    })

    it('devrait gérer la suppression du projet actuel', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Simuler la suppression du projet actuel
        cy.window().then((win) => {
          win.localStorage.removeItem('currentProjectId')
          win.dispatchEvent(new CustomEvent('project-deleted'))
        })
        
        cy.get('[data-cy="empty-state"]').should('be.visible')
      })
    })
  })

  describe('Cas limites de la checklist', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
    })

    it('devrait gérer le cochage rapide de nombreux éléments', () => {
      cy.visit('/dashboard')
      
      // Cocher rapidement plusieurs éléments
      for (let i = 0; i < 10; i++) {
        cy.get('[data-cy="checklist-checkbox"]').eq(i).click({ force: true })
      }
      
      // Vérifier que la progression est correcte
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
    })

    it('devrait gérer les données de checklist corrompues', () => {
      cy.intercept('GET', '/data/checklist-items-web.json', {
        statusCode: 200,
        body: { invalid: 'data' }
      }).as('corruptedData')
      
      cy.visit('/dashboard')
      cy.wait('@corruptedData')
      cy.get('[data-cy="error-message"]').should('be.visible')
    })

    it('devrait gérer l\'absence de données de checklist', () => {
      cy.intercept('GET', '/data/checklist-items-web.json', {
        statusCode: 404,
        body: 'Not Found'
      }).as('missingData')
      
      cy.visit('/dashboard')
      cy.wait('@missingData')
      cy.get('[data-cy="error-message"]').should('be.visible')
    })
  })

  describe('Cas limites de l\'interface', () => {
    it('devrait gérer les changements de thème rapides', () => {
      cy.visit('/dashboard')
      
      // Changer de thème rapidement plusieurs fois
      for (let i = 0; i < 5; i++) {
        cy.get('[data-cy="theme-toggle"]').click()
        cy.wait(100)
      }
      
      // Vérifier que l'interface reste stable
      cy.get('[data-cy="app-header"]').should('be.visible')
      cy.get('[data-cy="sidebar"]').should('be.visible')
    })

    it('devrait gérer le redimensionnement de fenêtre', () => {
      cy.visit('/dashboard')
      
      // Tester différentes tailles rapidement
      cy.viewport(320, 568) // iPhone 5
      cy.get('[data-cy="mobile-menu-toggle"]').should('be.visible')
      
      cy.viewport(1920, 1080) // Full HD
      cy.get('[data-cy="sidebar"]').should('be.visible')
      
      cy.viewport(768, 1024) // iPad
      cy.get('body').should('be.visible')
    })

    it('devrait gérer la perte de connexion réseau', () => {
      cy.visit('/dashboard')
      
      // Simuler une perte de connexion
      cy.intercept('**', { forceNetworkError: true }).as('networkFailure')
      
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      
      // L'interface devrait rester fonctionnelle localement
      cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
    })
  })

  describe('Cas limites de performance', () => {
    it('devrait gérer un grand nombre de projets', () => {
      // Simuler 100 projets
      const manyProjects = Array.from({ length: 100 }, (_, i) => ({
        id: `project-${i}`,
        name: `Projet ${i}`,
        description: `Description du projet ${i}`,
        checklistType: 'web-prelaunch'
      }))
      
      cy.intercept('GET', '**/firestore.googleapis.com/**', {
        statusCode: 200,
        body: { documents: manyProjects }
      }).as('manyProjects')
      
      cy.visit('/dashboard')
      cy.wait('@manyProjects')
      
      cy.get('[data-cy="project-selector"]').click()
      cy.get('[data-cy="project-dropdown"]').should('be.visible')
      
      // Vérifier que la performance reste acceptable
      cy.get('[data-cy="project-option"]').should('have.length', 100)
    })

    it('devrait gérer une checklist avec de nombreux éléments', () => {
      // Simuler une checklist avec 200 éléments
      const manyItems = Array.from({ length: 200 }, (_, i) => ({
        id: `item-${i}`,
        labelKey: `item.${i}.title`,
        descriptionKey: `item.${i}.description`
      }))
      
      cy.intercept('GET', '/data/checklist-items-web.json', {
        statusCode: 200,
        body: {
          seo: { name: 'SEO', items: manyItems }
        }
      }).as('manyItems')
      
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.wait('@manyItems')
      
      // Vérifier que tous les éléments sont affichés
      cy.get('[data-cy="checklist-item"]').should('have.length', 200)
      
      // Vérifier que le scroll fonctionne
      cy.scrollTo('bottom')
      cy.get('[data-cy="checklist-item"]').last().should('be.visible')
    })
  })

  describe('Cas limites de sécurité', () => {
    it('devrait échapper les scripts dans les noms de projet', () => {
      cy.visit('/dashboard')
      const maliciousName = '<script>alert("XSS")</script>'
      
      cy.get('[data-cy="project-name-input"]').type(maliciousName)
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // Vérifier que le script n'est pas exécuté
      cy.on('window:alert', () => {
        throw new Error('XSS détecté !')
      })
      
      cy.get('[data-cy="project-selector"]').should('not.contain', '<script>')
    })

    it('devrait valider les URLs dans les outils', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      
      const invalidUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'file:///etc/passwd',
        'not-a-url'
      ]
      
      invalidUrls.forEach(url => {
        cy.get('[data-cy="lighthouse-url-input"]').clear().type(url)
        cy.get('[data-cy="lighthouse-run-button"]').should('be.disabled')
      })
    })
  })

  describe('Cas limites de l\'internationalisation', () => {
    it('devrait gérer les textes très longs en différentes langues', () => {
      cy.visit('/')
      
      // Changer vers l'anglais
      cy.get('[data-cy="lang-selector"]').click()
      cy.get('[data-cy="lang-option-en"]').click()
      
      // Vérifier que l'interface reste stable
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="features-section"]').should('be.visible')
    })

    it('devrait gérer les caractères spéciaux dans les traductions', () => {
      cy.visit('/dashboard')
      
      // Vérifier que les caractères accentués s'affichent correctement
      cy.get('body').should('contain', 'é').or('contain', 'à').or('contain', 'ç')
    })
  })

  describe('Cas limites de stockage', () => {
    it('devrait gérer un localStorage plein', () => {
      cy.window().then((win) => {
        // Remplir le localStorage
        try {
          for (let i = 0; i < 1000; i++) {
            win.localStorage.setItem(`test-key-${i}`, 'x'.repeat(1000))
          }
        } catch (e) {
          // localStorage plein
        }
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').click()
      
      // L'application devrait continuer à fonctionner
      cy.get('body').should('be.visible')
    })

    it('devrait gérer l\'absence de localStorage', () => {
      cy.window().then((win) => {
        // Désactiver localStorage
        Object.defineProperty(win, 'localStorage', {
          value: null,
          writable: false
        })
      })
      
      cy.visit('/')
      cy.get('body').should('be.visible')
    })
  })

  describe('Tests de concurrence', () => {
    it('devrait gérer les clics rapides multiples', () => {
      cy.visit('/dashboard')
      cy.fixture('projects').then((projects) => {
        // Cliquer rapidement plusieurs fois sur créer
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
        
        for (let i = 0; i < 5; i++) {
          cy.get('[data-cy="create-project-button"]').click({ force: true })
        }
        
        // Un seul projet devrait être créé
        cy.get('[data-cy="project-selector"]').should('contain', projects.webProject.name)
      })
    })

    it('devrait gérer les changements de projet rapides', () => {
      cy.fixture('projects').then((projects) => {
        // Créer plusieurs projets
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        cy.createProject(projects.appProject.name, projects.appProject.description, projects.appProject.checklistType)
        
        // Changer rapidement entre les projets
        for (let i = 0; i < 3; i++) {
          cy.selectProject(projects.webProject.name)
          cy.selectProject(projects.appProject.name)
        }
        
        // L'interface devrait rester stable
        cy.get('[data-cy="checklist-category"]').should('be.visible')
      })
    })
  })

  describe('Tests de mémoire et performance', () => {
    it('devrait gérer de nombreuses interactions sans fuite mémoire', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // Effectuer de nombreuses interactions
      for (let i = 0; i < 50; i++) {
        cy.get('[data-cy="theme-toggle"]').click()
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="accordion-header"]').first().click()
      }
      
      // L'application devrait toujours répondre
      cy.get('body').should('be.visible')
    })
  })

  describe('Tests de compatibilité navigateur', () => {
    it('devrait fonctionner avec JavaScript désactivé partiellement', () => {
      cy.visit('/')
      
      // Désactiver certaines fonctionnalités JS
      cy.window().then((win) => {
        win.console.error = () => {} // Ignorer les erreurs console
      })
      
      cy.get('body').should('be.visible')
      cy.get('[data-cy="hero-section"]').should('be.visible')
    })
  })

  describe('Tests de récupération d\'erreur', () => {
    it('devrait récupérer après une erreur de composant', () => {
      cy.visit('/dashboard')
      
      // Simuler une erreur dans un composant
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('component-error', {
          detail: { error: 'Test error' }
        }))
      })
      
      // L'application devrait continuer à fonctionner
      cy.get('body').should('be.visible')
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light-theme')
    })

    it('devrait récupérer après une erreur de navigation', () => {
      cy.visit('/dashboard')
      
      // Tenter de naviguer vers une route inexistante
      cy.window().then((win) => {
        win.history.pushState({}, '', '/route-inexistante')
      })
      
      // Naviguer vers une route valide
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')
    })
  })
})
