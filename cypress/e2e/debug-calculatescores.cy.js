describe('🐛 Debug calculateScores errors', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  it('devrait pouvoir changer de projet sans erreurs calculateScores', () => {
    cy.fixture('projects').then((projects) => {
      cy.visit('/dashboard')
      
      // Intercepter les erreurs console
      cy.window().then((win) => {
        const originalError = win.console.error
        const errors = []
        win.console.error = (...args) => {
          errors.push(args.join(' '))
          originalError.apply(win.console, args)
        }
        
        // Créer le premier projet
        cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
        cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').click()
        
        // Attendre que le projet soit créé
        cy.wait(1000)
        
        // Créer un second projet
        cy.get('[data-cy="add-project-button"]').click()
        cy.get('[data-cy="project-name-input"]').clear().type(projects.appProject.name)
        cy.get(`[data-cy="checklist-type-${projects.appProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').click()
        
        // Attendre que le projet soit créé
        cy.wait(1000)
        
        // Changer entre les projets plusieurs fois
        cy.get('[data-cy="project-selector"]').click()
        cy.get('[data-cy="project-option"]').contains(projects.webProject.name).click()
        
        cy.wait(500)
        
        cy.get('[data-cy="project-selector"]').click()
        cy.get('[data-cy="project-option"]').contains(projects.appProject.name).click()
        
        cy.wait(500)
        
        cy.get('[data-cy="project-selector"]').click()
        cy.get('[data-cy="project-option"]').contains(projects.webProject.name).click()
        
        // Vérifier qu'il n'y a pas d'erreurs calculateScores
        cy.then(() => {
          const calculateScoresErrors = errors.filter(error => 
            error.includes('calculateScores is not defined')
          )
          expect(calculateScoresErrors).to.have.length(0)
        })
        
        // Restaurer console.error
        win.console.error = originalError
      })
    })
  })

  it('devrait pouvoir émettre des événements project-checklist-changed sans erreur', () => {
    cy.visit('/dashboard')
    
    // Intercepter les erreurs console
    cy.window().then((win) => {
      const originalError = win.console.error
      const errors = []
      win.console.error = (...args) => {
        errors.push(args.join(' '))
        originalError.apply(win.console, args)
      }
      
      // Émettre manuellement l'événement
      win.dispatchEvent(new CustomEvent('project-checklist-changed', {
        detail: {
          projectId: 'test-project',
          checklistType: 'web-prelaunch'
        }
      }))
      
      // Attendre un peu
      cy.wait(500)
      
      // Vérifier qu'il n'y a pas d'erreurs
      cy.then(() => {
        const calculateScoresErrors = errors.filter(error => 
          error.includes('calculateScores is not defined')
        )
        expect(calculateScoresErrors).to.have.length(0)
      })
      
      // Restaurer console.error
      win.console.error = originalError
    })
  })

  it('devrait pouvoir émettre des événements checked-items-updated sans erreur', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('currentProject', JSON.stringify({
        id: 'test-project',
        checklistType: 'web-prelaunch'
      }))
    })
    
    cy.visit('/dashboard')
    
    // Intercepter les erreurs console
    cy.window().then((win) => {
      const originalError = win.console.error
      const errors = []
      win.console.error = (...args) => {
        errors.push(args.join(' '))
        originalError.apply(win.console, args)
      }
      
      // Émettre manuellement l'événement
      win.dispatchEvent(new CustomEvent('checked-items-updated', {
        detail: {
          projectId: 'test-project',
          itemIds: ['meta-title', 'meta-description']
        }
      }))
      
      // Attendre un peu
      cy.wait(500)
      
      // Vérifier qu'il n'y a pas d'erreurs
      cy.then(() => {
        const calculateScoresErrors = errors.filter(error => 
          error.includes('calculateScores is not defined')
        )
        expect(calculateScoresErrors).to.have.length(0)
      })
      
      // Restaurer console.error
      win.console.error = originalError
    })
  })

  it('devrait pouvoir appeler calculateScores directement', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('currentProject', JSON.stringify({
        id: 'test-project',
        checklistType: 'web-prelaunch'
      }))
    })
    
    cy.visit('/dashboard')
    
    // Vérifier que la fonction calculateScores existe dans le scope
    cy.window().then((win) => {
      // Attendre que le composant soit monté
      cy.wait(1000)
      
      // Vérifier qu'il n'y a pas d'erreurs dans la console
      const originalError = win.console.error
      let hasError = false
      
      win.console.error = (...args) => {
        if (args.join(' ').includes('calculateScores is not defined')) {
          hasError = true
        }
        originalError.apply(win.console, args)
      }
      
      // Déclencher un changement qui devrait appeler calculateScores
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      
      cy.wait(500)
      
      cy.then(() => {
        expect(hasError).to.be.false
      })
      
      // Restaurer console.error
      win.console.error = originalError
    })
  })

  it('devrait gérer les watchers sans erreur', () => {
    cy.fixture('projects').then((projects) => {
      cy.visit('/dashboard')
      
      // Créer un projet
      cy.get('[data-cy="project-name-input"]').type(projects.webProject.name)
      cy.get(`[data-cy="checklist-type-${projects.webProject.checklistType}"]`).click()
      cy.get('[data-cy="create-project-button"]').click()
      
      // Intercepter les erreurs console
      cy.window().then((win) => {
        const originalError = win.console.error
        const errors = []
        win.console.error = (...args) => {
          errors.push(args.join(' '))
          originalError.apply(win.console, args)
        }
        
        // Créer un second projet (cela devrait déclencher le watcher)
        cy.get('[data-cy="add-project-button"]').click()
        cy.get('[data-cy="project-name-input"]').clear().type(projects.appProject.name)
        cy.get(`[data-cy="checklist-type-${projects.appProject.checklistType}"]`).click()
        cy.get('[data-cy="create-project-button"]').click()
        
        // Attendre que les watchers se déclenchent
        cy.wait(1000)
        
        // Vérifier qu'il n'y a pas d'erreurs calculateScores
        cy.then(() => {
          const calculateScoresErrors = errors.filter(error => 
            error.includes('calculateScores is not defined')
          )
          expect(calculateScoresErrors).to.have.length(0)
        })
        
        // Restaurer console.error
        win.console.error = originalError
      })
    })
  })
})
