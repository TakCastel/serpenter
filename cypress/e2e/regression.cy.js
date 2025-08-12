describe('🔄 Tests de régression', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Régression - Authentification', () => {
    it('devrait maintenir la session après navigation', () => {
      cy.visit('/dashboard')
      cy.shouldBeLoggedIn()
      
      cy.visit('/help')
      cy.visit('/dashboard')
      cy.shouldBeLoggedIn()
    })

    it('devrait gérer les tentatives de connexion multiples', () => {
      cy.mockLogout()
      cy.visit('/login')
      
      // Plusieurs tentatives avec mauvais mot de passe
      for (let i = 0; i < 3; i++) {
        cy.get('[data-cy="email-input"]').clear().type('test@example.com')
        cy.get('[data-cy="password-input"]').clear().type('wrongpassword')
        cy.get('[data-cy="login-button"]').click()
        cy.get('[data-cy="error-message"]').should('be.visible')
      }
      
      // Connexion réussie après
      cy.get('[data-cy="email-input"]').clear().type('test@example.com')
      cy.get('[data-cy="password-input"]').clear().type('correctpassword')
      
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 200,
        body: { localId: 'test-user', idToken: 'valid-token' }
      }).as('successLogin')
      
      cy.get('[data-cy="login-button"]').click()
      cy.wait('@successLogin')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Régression - Projets', () => {
    it('devrait maintenir la sélection de projet après rechargement', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        cy.reload()
        cy.get('[data-cy="project-selector"]').should('contain', projects.webProject.name)
      })
    })

    it('devrait gérer la suppression du projet actuel', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        cy.createProject(projects.appProject.name, projects.appProject.description, projects.appProject.checklistType)
        
        // Simuler la suppression du projet actuel
        cy.window().then((win) => {
          const projects = JSON.parse(win.localStorage.getItem('projects') || '[]')
          const filteredProjects = projects.filter(p => p.name !== projects.webProject.name)
          win.localStorage.setItem('projects', JSON.stringify(filteredProjects))
          win.localStorage.setItem('currentProjectId', filteredProjects[0]?.id || null)
        })
        
        cy.reload()
        cy.get('[data-cy="project-selector"]').should('contain', projects.appProject.name)
      })
    })
  })

  describe('Régression - Checklist', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
    })

    it('devrait maintenir l\'état des accordéons après navigation', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="accordion-header"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('be.visible')
      
      cy.visit('/help')
      cy.visit('/dashboard')
      
      // L'accordéon devrait rester ouvert
      cy.get('[data-cy="accordion-content"]').first().should('be.visible')
    })

    it('devrait calculer correctement la progression après modifications multiples', () => {
      cy.visit('/dashboard')
      
      // Cocher plusieurs éléments
      cy.get('[data-cy="checklist-checkbox"]').eq(0).click()
      cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
      cy.get('[data-cy="checklist-checkbox"]').eq(2).click()
      
      // Décocher un élément
      cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
      
      // Vérifier que la progression est correcte
      cy.get('[data-cy="progress-percentage"]').invoke('text').then((progress) => {
        const percentage = parseInt(progress.replace('%', ''))
        expect(percentage).to.be.greaterThan(0)
        expect(percentage).to.be.lessThan(100)
      })
    })

    it('devrait gérer le changement de type de checklist avec données existantes', () => {
      cy.visit('/dashboard')
      
      // Cocher des éléments dans web-prelaunch
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
      
      // Changer vers app-store
      cy.window().then((win) => {
        const project = JSON.parse(win.localStorage.getItem('currentProject'))
        project.checklistType = 'appstore-preflight'
        win.localStorage.setItem('currentProject', JSON.stringify(project))
      })
      
      cy.reload()
      cy.get('[data-cy="category-app-store"]').should('be.visible')
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
    })
  })

  describe('Régression - Interface', () => {
    it('devrait maintenir le thème après navigation entre pages', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light-theme')
      
      cy.visit('/help')
      cy.get('html').should('have.class', 'light-theme')
      
      cy.visit('/dashboard')
      cy.get('html').should('have.class', 'light-theme')
    })

    it('devrait maintenir l\'état de la sidebar après rechargement', () => {
      cy.setDesktopViewport()
      cy.visit('/dashboard')
      
      cy.get('[data-cy="sidebar-toggle"]').click()
      cy.get('[data-cy="sidebar"]').should('have.class', 'collapsed')
      
      cy.reload()
      cy.get('[data-cy="sidebar"]').should('have.class', 'collapsed')
    })

    it('devrait gérer les changements de viewport dynamiques', () => {
      cy.visit('/dashboard')
      
      // Commencer en desktop
      cy.setDesktopViewport()
      cy.get('[data-cy="sidebar"]').should('be.visible')
      
      // Passer en mobile
      cy.setMobileViewport()
      cy.get('[data-cy="mobile-menu-toggle"]').should('be.visible')
      
      // Revenir en desktop
      cy.setDesktopViewport()
      cy.get('[data-cy="sidebar"]').should('be.visible')
    })
  })

  describe('Régression - Performance', () => {
    it('devrait maintenir de bonnes performances avec de nombreuses interactions', () => {
      cy.visit('/dashboard')
      
      const start = Date.now()
      
      // Effectuer de nombreuses interactions
      for (let i = 0; i < 20; i++) {
        cy.get('[data-cy="theme-toggle"]').click()
      }
      
      const end = Date.now()
      const duration = end - start
      
      // Les interactions devraient rester rapides
      expect(duration).to.be.lessThan(5000)
    })

    it('devrait gérer efficacement les mises à jour de progression', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // Cocher rapidement de nombreux éléments
      cy.get('[data-cy="checklist-checkbox"]').each(($checkbox, index) => {
        if (index < 10) {
          cy.wrap($checkbox).click({ force: true })
        }
      })
      
      // La progression devrait être mise à jour correctement
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
    })
  })

  describe('Régression - Données', () => {
    it('devrait gérer la corruption des données localStorage', () => {
      cy.window().then((win) => {
        // Corrompre les données
        win.localStorage.setItem('currentProject', 'invalid-json')
        win.localStorage.setItem('projects', 'also-invalid')
      })
      
      cy.visit('/dashboard')
      
      // L'application devrait récupérer gracieusement
      cy.get('[data-cy="empty-state"]').should('be.visible')
    })

    it('devrait gérer les données manquantes', () => {
      cy.window().then((win) => {
        win.localStorage.clear()
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="empty-state"]').should('be.visible')
    })

    it('devrait gérer les versions de données obsolètes', () => {
      cy.window().then((win) => {
        // Simuler d'anciennes données avec structure différente
        win.localStorage.setItem('projects', JSON.stringify([
          { id: 'old-project', title: 'Old Project' } // Ancienne structure sans 'name'
        ]))
      })
      
      cy.visit('/dashboard')
      
      // L'application devrait gérer la migration ou ignorer les données obsolètes
      cy.get('body').should('be.visible')
    })
  })

  describe('Régression - Synchronisation', () => {
    it('devrait gérer les conflits de synchronisation', () => {
      cy.fixture('projects').then((projects) => {
        cy.visit('/dashboard')
        cy.createProject(projects.webProject.name, projects.webProject.description, projects.webProject.checklistType)
        
        // Simuler une mise à jour concurrente
        cy.window().then((win) => {
          win.dispatchEvent(new CustomEvent('firestore-update', {
            detail: {
              type: 'project-updated',
              project: {
                id: 'test-project',
                name: 'Nom modifié par un autre utilisateur',
                lastModified: new Date().toISOString()
              }
            }
          }))
        })
        
        // L'interface devrait se mettre à jour
        cy.get('[data-cy="project-selector"]').should('contain', 'Nom modifié')
      })
    })
  })
})
