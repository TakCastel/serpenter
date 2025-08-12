describe('🔐 Authentification', () => {
  beforeEach(() => {
    // Nettoyer l'état d'authentification avant chaque test
    cy.mockLogout()
  })

  describe('Page de connexion', () => {
    it('devrait afficher la page de connexion', () => {
      cy.visit('/login')
      cy.get('h1').should('contain', 'Connexion')
      cy.get('[data-cy="email-input"]').should('be.visible')
      cy.get('[data-cy="password-input"]').should('be.visible')
      cy.get('[data-cy="login-button"]').should('be.visible')
    })

    it('devrait valider les champs requis', () => {
      cy.visit('/login')
      cy.get('[data-cy="login-button"]').click()
      // Vérifier que la validation empêche la soumission
      cy.url().should('include', '/login')
    })

    it('devrait afficher une erreur pour des identifiants invalides', () => {
      cy.fixture('users').then((users) => {
        cy.visit('/login')
        cy.get('[data-cy="email-input"]').type(users.invalidUser.email)
        cy.get('[data-cy="password-input"]').type(users.invalidUser.password)
        cy.get('[data-cy="login-button"]').click()
        cy.get('[data-cy="error-message"]').should('be.visible')
      })
    })

    it('devrait permettre de basculer la visibilité du mot de passe', () => {
      cy.visit('/login')
      cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'password')
      cy.get('[data-cy="toggle-password"]').click()
      cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'text')
    })

    it('devrait rediriger vers le dashboard après connexion réussie', () => {
      cy.fixture('users').then((users) => {
        cy.visit('/login')
        cy.get('[data-cy="email-input"]').type(users.validUser.email)
        cy.get('[data-cy="password-input"]').type(users.validUser.password)
        
        // Mock de la réponse Firebase
        cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
          statusCode: 200,
          body: {
            kind: 'identitytoolkit#VerifyPasswordResponse',
            localId: users.validUser.uid,
            email: users.validUser.email,
            displayName: users.validUser.displayName,
            idToken: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: '3600'
          }
        }).as('loginRequest')
        
        cy.get('[data-cy="login-button"]').click()
        cy.wait('@loginRequest')
        cy.url().should('include', '/dashboard')
      })
    })
  })

  describe('Page d\'inscription', () => {
    it('devrait afficher la page d\'inscription', () => {
      cy.visit('/register')
      cy.get('h1').should('contain', 'Inscription')
      cy.get('[data-cy="email-input"]').should('be.visible')
      cy.get('[data-cy="password-input"]').should('be.visible')
      cy.get('[data-cy="register-button"]').should('be.visible')
    })

    it('devrait permettre l\'inscription avec des données valides', () => {
      cy.fixture('users').then((users) => {
        cy.visit('/register')
        cy.get('[data-cy="email-input"]').type(users.validUser2.email)
        cy.get('[data-cy="password-input"]').type(users.validUser2.password)
        
        // Mock de la réponse Firebase pour l'inscription
        cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
          statusCode: 200,
          body: {
            kind: 'identitytoolkit#SignupNewUserResponse',
            localId: users.validUser2.uid,
            email: users.validUser2.email,
            idToken: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: '3600'
          }
        }).as('registerRequest')
        
        cy.get('[data-cy="register-button"]').click()
        cy.wait('@registerRequest')
        cy.url().should('include', '/dashboard')
      })
    })

    it('devrait afficher le bouton de connexion Google', () => {
      cy.visit('/register')
      cy.get('[data-cy="google-login-button"]').should('be.visible')
    })
  })

  describe('Protection des routes', () => {
    it('devrait rediriger vers /login pour les routes protégées', () => {
      const protectedRoutes = ['/dashboard', '/profile', '/settings', '/help']
      
      protectedRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', '/login')
      })
    })

    it('devrait permettre l\'accès aux routes publiques', () => {
      const publicRoutes = ['/', '/login', '/register']
      
      publicRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', route)
      })
    })
  })

  describe('Déconnexion', () => {
    beforeEach(() => {
      // Simuler un utilisateur connecté
      cy.mockLogin()
      cy.visit('/dashboard')
    })

    it('devrait permettre la déconnexion depuis le header', () => {
      cy.get('[data-cy="user-menu"]').click()
      cy.get('[data-cy="logout-button"]').should('be.visible').click()
      cy.url().should('include', '/login')
    })

    it('devrait nettoyer la session après déconnexion', () => {
      cy.get('[data-cy="user-menu"]').click()
      cy.get('[data-cy="logout-button"]').click()
      
      // Vérifier que l'utilisateur ne peut plus accéder aux routes protégées
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })
  })

  describe('Persistance de session', () => {
    it('devrait maintenir la session après rechargement de page', () => {
      cy.mockLogin()
      cy.visit('/dashboard')
      cy.reload()
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy="user-menu"]').should('be.visible')
    })
  })
})
