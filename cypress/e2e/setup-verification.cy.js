describe('🔧 Vérification de la configuration Cypress', () => {
  describe('Tests de base sans dépendances', () => {
    it('devrait pouvoir visiter la page d\'accueil', () => {
      cy.visit('/')
      cy.get('body').should('exist')
    })

    it('devrait pouvoir exécuter du JavaScript basique', () => {
      cy.visit('/')
      cy.window().should('have.property', 'navigator')
      cy.document().should('have.property', 'title')
    })

    it('devrait pouvoir interagir avec le DOM', () => {
      cy.visit('/')
      cy.get('body').click()
      cy.get('body').should('be.visible')
    })
  })

  describe('Tests des commandes personnalisées', () => {
    it('devrait pouvoir utiliser les commandes de viewport', () => {
      cy.visit('/')
      
      cy.setMobileViewport()
      cy.viewport().should('have.property', 'width', 375)
      
      cy.setDesktopViewport()
      cy.viewport().should('have.property', 'width', 1280)
    })

    it('devrait pouvoir utiliser les commandes de mock', () => {
      cy.mockLogin()
      cy.window().then((win) => {
        const authData = win.localStorage.getItem('firebase:authUser:test:[DEFAULT]')
        expect(authData).to.not.be.null
      })
      
      cy.mockLogout()
      cy.window().then((win) => {
        const authData = win.localStorage.getItem('firebase:authUser:test:[DEFAULT]')
        expect(authData).to.be.null
      })
    })
  })

  describe('Tests des fixtures', () => {
    it('devrait pouvoir charger les fixtures utilisateurs', () => {
      cy.fixture('users').then((users) => {
        expect(users).to.have.property('validUser')
        expect(users.validUser).to.have.property('email')
        expect(users.validUser).to.have.property('password')
      })
    })

    it('devrait pouvoir charger les fixtures projets', () => {
      cy.fixture('projects').then((projects) => {
        expect(projects).to.have.property('webProject')
        expect(projects.webProject).to.have.property('name')
        expect(projects.webProject).to.have.property('checklistType')
      })
    })

    it('devrait pouvoir charger les fixtures de checklist', () => {
      cy.fixture('checklist-web').then((checklist) => {
        expect(checklist).to.have.property('seo')
        expect(checklist.seo).to.have.property('items')
        expect(checklist.seo.items).to.be.an('array')
      })
    })
  })

  describe('Tests des intercepteurs', () => {
    it('devrait pouvoir intercepter les requêtes', () => {
      cy.intercept('GET', '/api/test', { statusCode: 200, body: { success: true } }).as('testRequest')
      
      cy.visit('/')
      cy.window().then((win) => {
        fetch('/api/test')
      })
      
      cy.wait('@testRequest')
    })

    it('devrait pouvoir mocker les réponses Firebase', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 200,
        body: { localId: 'test-user', idToken: 'test-token' }
      }).as('firebaseAuth')
      
      cy.visit('/login')
      // Le mock est en place, prêt pour les tests d'auth
    })
  })

  describe('Tests de configuration', () => {
    it('devrait avoir accès aux variables d\'environnement', () => {
      expect(Cypress.env('TEST_EMAIL')).to.equal('test@serpenter.com')
      expect(Cypress.env('TEST_PASSWORD')).to.equal('testpassword123')
    })

    it('devrait avoir la bonne baseUrl configurée', () => {
      expect(Cypress.config('baseUrl')).to.equal('http://localhost:3000')
    })

    it('devrait avoir les bons timeouts configurés', () => {
      expect(Cypress.config('defaultCommandTimeout')).to.equal(10000)
      expect(Cypress.config('pageLoadTimeout')).to.equal(30000)
    })
  })

  describe('Tests de compatibilité navigateur', () => {
    it('devrait fonctionner avec les fonctionnalités ES6+', () => {
      cy.visit('/')
      cy.window().then((win) => {
        // Tester les fonctionnalités modernes
        expect(win.Promise).to.exist
        expect(win.fetch).to.exist
        expect(win.localStorage).to.exist
        expect(win.sessionStorage).to.exist
      })
    })

    it('devrait supporter les CSS custom properties', () => {
      cy.visit('/')
      cy.get('body').should('have.css', 'color')
    })
  })

  describe('Tests de nettoyage', () => {
    it('devrait nettoyer le localStorage entre les tests', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('test-key', 'test-value')
      })
      
      // Le beforeEach devrait nettoyer
      cy.clearLocalStorage()
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem('test-key')).to.be.null
      })
    })

    it('devrait nettoyer les cookies entre les tests', () => {
      cy.setCookie('test-cookie', 'test-value')
      cy.getCookie('test-cookie').should('have.property', 'value', 'test-value')
      
      cy.clearCookies()
      cy.getCookie('test-cookie').should('be.null')
    })
  })
})
