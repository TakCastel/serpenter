describe('📁 Gestion des projets', () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté pour tous les tests
    cy.mockLogin()
  })

  describe('État vide (EmptyState)', () => {
    it('devrait afficher l\'état vide quand aucun projet', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="empty-state"]').should('be.visible')
      cy.get('[data-cy="empty-state-title"]').should('contain', 'Aucun projet')
      cy.get('[data-cy="project-name-input"]').should('be.visible')
      cy.get('[data-cy="project-description-input"]').should('be.visible')
    })

    it('devrait permettre de créer un projet depuis l\'état vide', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get('[data-cy="project-description-input"]').type(projects.webProject.description)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        
        // Mock de la création de projet
        cy.intercept('POST', '**/firestore.googleapis.com/**', {
          statusCode: 200,
          body: {
            name: 'projects/test-project-1',
            fields: {
              name: { stringValue: projects.webProject.name },
              description: { stringValue: projects.webProject.description },
              checklistType: { stringValue: projects.webProject.checklistType }
            }
          }
        }).as('createProject')
        
        cy.get('[data-cy="create-project-button"]').click()
        cy.wait('@createProject')
        cy.get('[data-cy="empty-state"]').should('not.exist')
      })
    })

    it('devrait valider les champs requis', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="create-project-button"]').should('be.disabled')
      
      cy.get('[data-cy="project-name-input"]').type('Test')
      cy.get('[data-cy="create-project-button"]').should('not.be.disabled')
    })
  })

  describe('Sélection de type de checklist', () => {
    it('devrait afficher les types de checklist disponibles', () => {
      cy.visit('/select-checklist')
      cy.get('[data-cy="checklist-type-web-prelaunch"]').should('be.visible')
      cy.get('[data-cy="checklist-type-appstore-preflight"]').should('be.visible')
      cy.get('[data-cy="checklist-type-security-checker"]').should('be.visible')
    })

    it('devrait permettre de sélectionner un type de checklist', () => {
      cy.visit('/select-checklist')
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.url().should('include', '/dashboard')
    })

    it('devrait rediriger si le projet a déjà un type', () => {
      // Simuler un projet avec un type déjà défini
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      cy.visit('/select-checklist')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('ProjectSelector', () => {
    beforeEach(() => {
      // Mock des projets existants
      cy.intercept('GET', '**/firestore.googleapis.com/**', {
        fixture: 'firestore-response.json'
      }).as('getProjects')
    })

    it('devrait afficher le sélecteur de projet', () => {
      cy.visit('/dashboard')
      cy.wait('@getProjects')
      cy.get('[data-cy="project-selector"]').should('be.visible')
    })

    it('devrait ouvrir le dropdown au clic', () => {
      cy.visit('/dashboard')
      cy.wait('@getProjects')
      cy.get('[data-cy="project-selector"]').click()
      cy.get('[data-cy="project-dropdown"]').should('be.visible')
    })

    it('devrait permettre de changer de projet', () => {
      cy.visit('/dashboard')
      cy.wait('@getProjects')
      cy.get('[data-cy="project-selector"]').click()
      cy.get('[data-cy="project-option"]').first().click()
      cy.get('[data-cy="project-dropdown"]').should('not.exist')
    })

    it('devrait fermer le dropdown en cliquant à l\'extérieur', () => {
      cy.visit('/dashboard')
      cy.wait('@getProjects')
      cy.get('[data-cy="project-selector"]').click()
      cy.get('[data-cy="project-dropdown"]').should('be.visible')
      cy.get('body').click(0, 0)
      cy.get('[data-cy="project-dropdown"]').should('not.exist')
    })
  })

  describe('Création de projet avancée', () => {
    it('devrait gérer les noms de projet longs', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.get('[data-cy="project-name-input"]').type(projects.longNameProject.name)
        cy.get('[data-cy="project-description-input"]').type(projects.longNameProject.description)
        cy.get(`[data-cy="checklist-type-${projects.longNameProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').should('not.be.disabled')
      })
    })

    it('devrait permettre de créer un projet sans description', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.get('[data-cy="project-name-input"]').type(projects.emptyProject.name)
        cy.get(`[data-cy="checklist-type-${projects.emptyProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').should('not.be.disabled')
      })
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de création de projet', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="project-name-input"]').type('Test Project')
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      
      // Mock d'une erreur de création
      cy.intercept('POST', '**/firestore.googleapis.com/**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('createProjectError')
      
      cy.get('[data-cy="create-project-button"]').click()
      cy.wait('@createProjectError')
      cy.get('[data-cy="error-message"]').should('be.visible')
    })
  })

  describe('Synchronisation temps réel', () => {
    it('devrait mettre à jour la liste des projets en temps réel', () => {
      cy.visit('/dashboard')
      
      // Simuler l'ajout d'un nouveau projet via Firestore
      cy.window().then((win) => {
        // Simuler un événement de mise à jour Firestore
        win.dispatchEvent(new CustomEvent('firestore-update', {
          detail: { type: 'project-added', project: { id: 'new-project', name: 'Nouveau Projet' } }
        }))
      })
      
      cy.get('[data-cy="project-selector"]').should('contain', 'Nouveau Projet')
    })
  })
})
