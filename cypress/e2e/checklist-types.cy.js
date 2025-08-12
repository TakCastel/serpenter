describe('📋 Types de checklists', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Web Pre-launch', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Site Web',
          checklistType: 'web-prelaunch'
        }))
      })
    })

    it('devrait afficher les catégories Web Pre-launch', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="category-seo"]').should('be.visible')
      cy.get('[data-cy="category-accessibilite"]').should('be.visible')
      cy.get('[data-cy="category-performance"]').should('be.visible')
      cy.get('[data-cy="category-securite"]').should('be.visible')
      cy.get('[data-cy="category-conformite"]').should('be.visible')
    })

    it('devrait charger les données de checklist web', () => {
      cy.intercept('GET', '/data/checklist-items-web.json', { fixture: 'checklist-web.json' }).as('loadWebChecklist')
      cy.visit('/dashboard')
      cy.wait('@loadWebChecklist')
      cy.get('[data-cy="checklist-item"]').should('have.length.at.least', 5)
    })

    it('devrait afficher l\'outil Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion"]').should('be.visible')
    })
  })

  describe('App Store Preflight', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'App Mobile',
          checklistType: 'appstore-preflight'
        }))
      })
    })

    it('devrait afficher les catégories App Store', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="category-app-store"]').should('be.visible')
      cy.get('[data-cy="category-play-store"]').should('be.visible')
    })

    it('devrait charger les données de checklist app', () => {
      cy.intercept('GET', '/data/checklist-items-app.json', { fixture: 'checklist-app.json' }).as('loadAppChecklist')
      cy.visit('/dashboard')
      cy.wait('@loadAppChecklist')
      cy.get('[data-cy="checklist-item"]').should('have.length.at.least', 3)
    })

    it('devrait afficher l\'outil App Preflight', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="app-preflight-accordion"]').should('be.visible')
    })

    it('ne devrait pas afficher l\'outil Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion"]').should('not.exist')
    })
  })

  describe('Security Checker', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Audit Sécurité',
          checklistType: 'security-checker'
        }))
      })
    })

    it('devrait afficher les catégories Security', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="category-security"]').should('be.visible')
    })

    it('devrait charger les données de checklist sécurité', () => {
      cy.intercept('GET', '/data/checklist-items-security.json', { fixture: 'checklist-security.json' }).as('loadSecurityChecklist')
      cy.visit('/dashboard')
      cy.wait('@loadSecurityChecklist')
      cy.get('[data-cy="checklist-item"]').should('have.length.at.least', 3)
    })

    it('devrait afficher l\'outil Security Scanner', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="security-scanner-accordion"]').should('be.visible')
    })

    it('ne devrait pas afficher l\'outil Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion"]').should('not.exist')
    })
  })

  describe('Changement de type de checklist', () => {
    it('devrait permettre de changer le type de checklist', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Test Project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="category-seo"]').should('be.visible')
      
      // Changer vers App Store Preflight
      cy.get('[data-cy="change-checklist-type"]').click()
      cy.get('[data-cy="checklist-type-appstore-preflight"]').click()
      
      cy.get('[data-cy="category-app-store"]').should('be.visible')
      cy.get('[data-cy="category-seo"]').should('not.exist')
    })

    it('devrait réinitialiser la progression lors du changement de type', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Test Project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="progress-percentage"]').should('not.contain', '0%')
      
      // Changer de type
      cy.get('[data-cy="change-checklist-type"]').click()
      cy.get('[data-cy="checklist-type-security-checker"]').click()
      
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
    })
  })

  describe('Chargement des données JSON', () => {
    it('devrait charger les données web correctement', () => {
      cy.request('/data/checklist-items-web.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('seo')
        expect(response.body).to.have.property('accessibilite')
        expect(response.body).to.have.property('performance')
      })
    })

    it('devrait charger les données app correctement', () => {
      cy.request('/data/checklist-items-app.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('app-store')
        expect(response.body).to.have.property('play-store')
      })
    })

    it('devrait charger les données sécurité correctement', () => {
      cy.request('/data/checklist-items-security.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('security')
      })
    })
  })

  describe('Validation des structures de données', () => {
    it('devrait avoir la structure correcte pour les données web', () => {
      cy.request('/data/checklist-items-web.json').then((response) => {
        const data = response.body
        Object.keys(data).forEach(categoryKey => {
          expect(data[categoryKey]).to.have.property('name')
          expect(data[categoryKey]).to.have.property('description')
          expect(data[categoryKey]).to.have.property('items')
          expect(data[categoryKey].items).to.be.an('array')
          
          data[categoryKey].items.forEach(item => {
            expect(item).to.have.property('id')
            expect(item).to.have.property('labelKey')
            expect(item).to.have.property('descriptionKey')
          })
        })
      })
    })
  })

  describe('Gestion des erreurs de chargement', () => {
    it('devrait gérer les erreurs de chargement des données', () => {
      cy.intercept('GET', '/data/checklist-items-web.json', {
        statusCode: 404,
        body: 'Not Found'
      }).as('loadError')
      
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.wait('@loadError')
      cy.get('[data-cy="error-message"]').should('be.visible')
    })
  })
})
