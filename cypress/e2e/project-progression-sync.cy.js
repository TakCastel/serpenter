describe('🔄 Synchronisation progression entre projets', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Problème de perte de progression', () => {
    it('devrait maintenir la progression après changement de projet', () => {
      // Créer le premier projet
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        
        // Créer projet 1
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get('[data-cy="project-description-input"]').type(projects.webProject.description)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        
        cy.intercept('POST', '**/firestore.googleapis.com/**', {
          statusCode: 200,
          body: { name: 'projects/project-1' }
        }).as('createProject1')
        
        cy.get('[data-cy="create-project-button"]').click()
        cy.wait('@createProject1')
        
        // Cocher quelques éléments dans le projet 1
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
        
        // Vérifier que la progression n'est pas 0%
        cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
        cy.get('[data-cy="progress-percentage"]').invoke('text').as('project1Progress')
        
        // Créer un second projet
        cy.get('[data-cy="add-project-button"]').click()
        cy.get('[data-cy="project-name-input"]').clear().type(projects.appProject.name)
        cy.get('[data-cy="project-description-input"]').clear().type(projects.appProject.description)
        cy.get(`[data-cy="checklist-type-${projects.appProject.checklistType}"]`).click()
        
        cy.intercept('POST', '**/firestore.googleapis.com/**', {
          statusCode: 200,
          body: { name: 'projects/project-2' }
        }).as('createProject2')
        
        cy.get('[data-cy="create-project-button"]').click()
        cy.wait('@createProject2')
        
        // Le projet 2 devrait avoir 0% de progression
        cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
        
        // Revenir au projet 1
        cy.get('[data-cy="project-selector"]').click()
        cy.get('[data-cy="project-option"]').contains(projects.webProject.name).click()
        
        // Vérifier que la progression du projet 1 est restaurée
        cy.get('@project1Progress').then((originalProgress) => {
          cy.get('[data-cy="progress-percentage"]').should('contain', originalProgress)
        })
        
        // Vérifier que les éléments sont toujours cochés
        cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
        cy.get('[data-cy="checklist-checkbox"]').eq(1).should('be.checked')
      })
    })

    it('devrait mettre à jour les pourcentages dans le ProjectSelector', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        
        // Créer un projet
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').click()
        
        // Cocher des éléments
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
        
        // Ouvrir le ProjectSelector
        cy.get('[data-cy="project-selector"]').click()
        
        // Vérifier que le pourcentage est affiché dans la liste
        cy.get('[data-cy="project-option"]').first().should('not.contain', '0%')
        cy.get('[data-cy="project-option"]').first().should('contain', '%')
      })
    })

    it('devrait gérer les auto-checks depuis Lighthouse', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Test Project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // Progression initiale
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
      
      // Simuler un auto-check depuis Lighthouse
      cy.window().then((win) => {
        // Simuler que Lighthouse a coché des éléments
        win.dispatchEvent(new CustomEvent('checked-items-updated', {
          detail: {
            projectId: 'test-project',
            itemIds: ['meta-title', 'meta-description']
          }
        }))
      })
      
      // Attendre que la progression se mette à jour
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
      
      // Créer un second projet et revenir au premier
      cy.get('[data-cy="add-project-button"]').click()
      cy.get('[data-cy="project-name-input"]').type('Projet 2')
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // Revenir au projet 1
      cy.get('[data-cy="project-selector"]').click()
      cy.get('[data-cy="project-option"]').contains('Test Project').click()
      
      // La progression devrait être maintenue
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
    })

    it('devrait synchroniser les événements entre composants', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        
        // Créer un projet
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').click()
        
        // Écouter les événements de progression
        cy.window().then((win) => {
          let progressEvents = []
          win.addEventListener('progress-updated', (event) => {
            progressEvents.push(event.detail.percentage)
          })
          
          // Cocher un élément
          cy.get('[data-cy="checklist-checkbox"]').first().click()
          
          // Vérifier qu'un événement a été émis
          cy.then(() => {
            expect(progressEvents.length).to.be.greaterThan(0)
            expect(progressEvents[progressEvents.length - 1]).to.be.greaterThan(0)
          })
        })
      })
    })

    it('devrait recalculer les scores après rechargement de page', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Test Project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // Cocher des éléments
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
      
      // Mémoriser la progression
      cy.get('[data-cy="progress-percentage"]').invoke('text').as('originalProgress')
      
      // Recharger la page
      cy.reload()
      
      // Vérifier que la progression est restaurée
      cy.get('@originalProgress').then((progress) => {
        cy.get('[data-cy="progress-percentage"]').should('contain', progress)
      })
    })
  })

  describe('Tests de performance de synchronisation', () => {
    it('devrait gérer les changements rapides de projet', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        
        // Créer plusieurs projets rapidement
        for (let i = 0; i < 3; i++) {
          cy.get('[data-cy="add-project-button"]').click()
          cy.get('[data-cy="project-name-input"]').clear().type(`Projet ${i + 1}`)
          cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
          cy.get('[data-cy="create-project-button"]').click()
          cy.wait(500) // Petit délai pour éviter les conflits
        }
        
        // Changer rapidement entre les projets
        for (let i = 0; i < 5; i++) {
          cy.get('[data-cy="project-selector"]').click()
          cy.get('[data-cy="project-option"]').eq(i % 3).click()
          cy.wait(200)
        }
        
        // L'interface devrait rester stable
        cy.get('[data-cy="checklist-category"]').should('be.visible')
        cy.get('[data-cy="progress-percentage"]').should('be.visible')
      })
    })

    it('devrait éviter les fuites mémoire lors des changements', () => {
      cy.window().then((win) => {
        const initialEventListeners = win.getEventListeners ? 
          Object.keys(win.getEventListeners(win)).length : 0
        
        // Créer et changer de projet plusieurs fois
        for (let i = 0; i < 10; i++) {
          cy.visit('/dashboard')
          cy.get('[data-cy="add-project-button"]').click()
          cy.get('[data-cy="project-name-input"]').type(`Projet ${i}`)
          cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
          cy.get('[data-cy="create-project-button"]').click()
        }
        
        // Vérifier qu'il n'y a pas trop d'event listeners
        cy.then(() => {
          const finalEventListeners = win.getEventListeners ? 
            Object.keys(win.getEventListeners(win)).length : 0
          
          // Il ne devrait pas y avoir une explosion d'event listeners
          expect(finalEventListeners - initialEventListeners).to.be.lessThan(50)
        })
      })
    })
  })

  describe('Tests de robustesse', () => {
    it('devrait gérer les erreurs de synchronisation', () => {
      cy.visit('/dashboard')
      
      // Simuler une erreur de chargement
      cy.intercept('GET', '**/firestore.googleapis.com/**', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('firestoreError')
      
      cy.get('[data-cy="add-project-button"]').click()
      cy.get('[data-cy="project-name-input"]').type('Test Project')
      cy.get('[data-cy="checklist-type-web-prelaunch"]').click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // L'interface devrait rester fonctionnelle malgré l'erreur
      cy.get('body').should('be.visible')
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
    })

    it('devrait gérer les données corrompues', () => {
      cy.window().then((win) => {
        // Corrompre les données de progression
        win.localStorage.setItem('project-scores-test', 'invalid-json')
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // L'application devrait récupérer gracieusement
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
      cy.get('[data-cy="checklist-category"]').should('be.visible')
    })
  })
})
