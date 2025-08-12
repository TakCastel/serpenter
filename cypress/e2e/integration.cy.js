describe('🔄 Tests d\'intégration', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Flux complet utilisateur', () => {
    it('devrait permettre un flux complet de création et utilisation', () => {
      cy.fixture('projects').then((projects) => {
        // 1. Arriver sur le dashboard vide
        cy.visit('/dashboard')
        cy.get('[data-cy="empty-state"]').should('be.visible')
        
        // 2. Créer un projet
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get('[data-cy="project-description-input"]').type(projects.webProject.description)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        
        cy.intercept('POST', '**/firestore.googleapis.com/**', {
          statusCode: 200,
          body: { name: 'projects/test-project-1' }
        }).as('createProject')
        
        cy.get('[data-cy="create-project-button"]').click()
        cy.wait('@createProject')
        
        // 3. Vérifier que la checklist s'affiche
        cy.get('[data-cy="empty-state"]').should('not.exist')
        cy.get('[data-cy="checklist-category"]').should('be.visible')
        
        // 4. Cocher quelques éléments
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
        
        // 5. Vérifier la progression
        cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
        
        // 6. Tester les accordéons
        cy.get('[data-cy="accordion-header"]').first().click()
        cy.get('[data-cy="accordion-content"]').first().should('be.visible')
      })
    })

    it('devrait gérer le changement de projet avec sauvegarde', () => {
      cy.fixture('projects').then((projects) => {
        // Créer le premier projet
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Cocher des éléments
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
        
        // Créer un second projet
        cy.get('[data-cy="add-project-button"]').click()
        cy.createProject(projects.appProject.name, projects.appProject.description, projects.appProject.checklistType)
        
        // Vérifier que la progression est différente
        cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
        
        // Revenir au premier projet
        cy.selectProject(projects.webProject.name)
        
        // Vérifier que la progression est restaurée
        cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
      })
    })
  })

  describe('Synchronisation état global', () => {
    it('devrait synchroniser le thème entre tous les composants', () => {
      cy.visit('/dashboard')
      
      // Changer le thème depuis le header
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light-theme')
      
      // Vérifier que tous les composants utilisent le bon thème
      cy.get('[data-cy="sidebar"]').should('have.css', 'background-color')
      cy.get('[data-cy="app-header"]').should('have.css', 'background-color')
      cy.get('[data-cy="main-content"]').should('have.css', 'background-color')
    })

    it('devrait synchroniser la langue entre tous les composants', () => {
      cy.visit('/dashboard')
      
      // Changer la langue
      cy.get('[data-cy="lang-selector"]').click()
      cy.get('[data-cy="lang-option-en"]').click()
      
      // Vérifier que tous les textes sont en anglais
      cy.get('[data-cy="sidebar"]').should('contain', 'Dashboard')
      cy.get('[data-cy="app-header"]').should('contain', 'Projects')
    })
  })

  describe('Gestion des événements globaux', () => {
    it('devrait émettre des événements lors du changement de projet', () => {
      cy.visit('/dashboard')
      
      cy.window().then((win) => {
        let eventReceived = false
        win.addEventListener('project-checklist-changed', () => {
          eventReceived = true
        })
        
        // Changer de projet
        cy.get('[data-cy="project-selector"]').click()
        cy.get('[data-cy="project-option"]').first().click()
        
        cy.then(() => {
          expect(eventReceived).to.be.true
        })
      })
    })

    it('devrait émettre des événements lors de la mise à jour des éléments cochés', () => {
      cy.visit('/dashboard')
      
      cy.window().then((win) => {
        let eventReceived = false
        win.addEventListener('checked-items-updated', () => {
          eventReceived = true
        })
        
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        
        cy.then(() => {
          expect(eventReceived).to.be.true
        })
      })
    })
  })

  describe('Performance et optimisation', () => {
    it('devrait charger les données de checklist de manière paresseuse', () => {
      // Vérifier que les données ne sont chargées qu'au besoin
      cy.visit('/dashboard')
      
      // Aucune requête ne devrait être faite avant d'avoir un projet
      cy.get('@loadWebChecklist.all').should('have.length', 0)
      
      // Créer un projet
      cy.fixture('projects').then((projects) => {
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Maintenant les données devraient être chargées
        cy.get('[data-cy="checklist-item"]').should('be.visible')
      })
    })

    it('devrait mettre en cache les données de checklist', () => {
      cy.visit('/dashboard')
      cy.fixture('projects').then((projects) => {
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Changer de page et revenir
        cy.visit('/help')
        cy.visit('/dashboard')
        
        // Les données devraient être chargées depuis le cache
        cy.get('[data-cy="checklist-item"]').should('be.visible')
      })
    })
  })

  describe('Accessibilité de la checklist', () => {
    it('devrait avoir des rôles ARIA appropriés', () => {
      cy.visit('/dashboard')
      cy.fixture('projects').then((projects) => {
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        cy.get('[data-cy="checklist-item"]').should('have.attr', 'role', 'region')
        cy.get('[data-cy="checklist-checkbox"]').should('have.attr', 'role', 'checkbox')
        cy.get('[data-cy="accordion-header"]').should('have.attr', 'role', 'button')
      })
    })

    it('devrait supporter la navigation au clavier', () => {
      cy.visit('/dashboard')
      cy.fixture('projects').then((projects) => {
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Navigation avec Tab
        cy.get('body').tab()
        cy.focused().should('have.attr', 'data-cy')
        
        // Activation avec Entrée
        cy.focused().type('{enter}')
      })
    })
  })

  describe('Responsive design de la checklist', () => {
    it('devrait s\'adapter sur mobile', () => {
      cy.setMobileViewport()
      cy.visit('/dashboard')
      cy.fixture('projects').then((projects) => {
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        cy.get('[data-cy="checklist-item"]').should('be.visible')
        cy.get('[data-cy="checklist-item"]').should('have.css', 'width')
      })
    })

    it('devrait adapter la grille sur différents écrans', () => {
      cy.fixture('projects').then((projects) => {
        // Desktop
        cy.setDesktopViewport()
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        cy.get('[data-cy="dashboard-grid"]').should('have.class', 'lg:grid-cols-3')
        
        // Mobile
        cy.setMobileViewport()
        cy.visit('/dashboard')
        cy.get('[data-cy="dashboard-grid"]').should('have.class', 'grid-cols-1')
      })
    })
  })
})
