describe('💨 Smoke Tests', () => {
  describe('Tests de base sans authentification', () => {
    it('devrait charger la page d\'accueil', () => {
      cy.visit('/')
      cy.get('body').should('be.visible')
      cy.contains('Serpenter').should('be.visible')
    })

    it('devrait charger la page de connexion', () => {
      cy.visit('/login')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/login')
    })

    it('devrait charger la page d\'inscription', () => {
      cy.visit('/register')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/register')
    })

    it('devrait charger la page d\'aide', () => {
      cy.visit('/help')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/help')
    })
  })

  describe('Tests de redirection', () => {
    it('devrait rediriger vers login pour les routes protégées', () => {
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })

    it('devrait permettre l\'accès aux routes publiques', () => {
      const publicRoutes = ['/', '/login', '/register', '/help']
      
      publicRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', route)
        cy.get('body').should('be.visible')
      })
    })
  })

  describe('Tests de responsive basique', () => {
    it('devrait s\'afficher correctement sur mobile', () => {
      cy.viewport(375, 667)
      cy.visit('/')
      cy.get('body').should('be.visible')
    })

    it('devrait s\'afficher correctement sur tablet', () => {
      cy.viewport(768, 1024)
      cy.visit('/')
      cy.get('body').should('be.visible')
    })

    it('devrait s\'afficher correctement sur desktop', () => {
      cy.viewport(1280, 720)
      cy.visit('/')
      cy.get('body').should('be.visible')
    })
  })

  describe('Tests de performance basique', () => {
    it('devrait charger en moins de 5 secondes', () => {
      const start = Date.now()
      cy.visit('/')
      cy.get('body').should('be.visible').then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(5000)
      })
    })
  })

  describe('Tests avec authentification simulée', () => {
    it('devrait charger le dashboard avec un utilisateur connecté', () => {
      cy.mockLogin()
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/dashboard')
    })

    it('devrait permettre la déconnexion simulée', () => {
      cy.mockLogin()
      cy.visit('/dashboard')
      cy.mockLogout()
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })
  })

  describe('Tests des ressources statiques', () => {
    it('devrait charger les données de checklist web', () => {
      cy.request('/data/checklist-items-web.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
      })
    })

    it('devrait charger les données de checklist app', () => {
      cy.request('/data/checklist-items-app.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
      })
    })

    it('devrait charger les données de checklist sécurité', () => {
      cy.request('/data/checklist-items-security.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
      })
    })
  })

  describe('Tests de configuration i18n', () => {
    it('devrait charger les traductions françaises', () => {
      cy.request('/locales/fr.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
      })
    })

    it('devrait charger les traductions anglaises', () => {
      cy.request('/locales/en.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('object')
      })
    })
  })
})
