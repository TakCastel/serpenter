describe('🏠 Pages publiques', () => {
  describe('Page d\'accueil', () => {
    it('devrait afficher la page d\'accueil', () => {
      cy.visit('/')
      cy.get('[data-cy="hero-section"]').should('be.visible')
      cy.get('[data-cy="features-section"]').should('be.visible')
      cy.get('[data-cy="pricing-section"]').should('be.visible')
    })

    it('devrait afficher le logo et le nom de l\'application', () => {
      cy.visit('/')
      cy.get('[data-cy="app-logo"]').should('be.visible')
      cy.get('[data-cy="app-name"]').should('contain', 'Serpenter')
    })

    it('devrait afficher les liens de navigation', () => {
      cy.visit('/')
      cy.get('[data-cy="nav-login"]').should('be.visible')
      cy.get('[data-cy="nav-register"]').should('be.visible')
      cy.get('[data-cy="nav-help"]').should('be.visible')
    })

    it('devrait permettre de naviguer vers les pages d\'authentification', () => {
      cy.visit('/')
      
      cy.get('[data-cy="nav-login"]').click()
      cy.url().should('include', '/login')
      
      cy.visit('/')
      cy.get('[data-cy="nav-register"]').click()
      cy.url().should('include', '/register')
    })

    it('devrait afficher les call-to-action', () => {
      cy.visit('/')
      cy.get('[data-cy="cta-primary"]').should('be.visible')
      cy.get('[data-cy="cta-secondary"]').should('be.visible')
    })
  })

  describe('Section Hero', () => {
    it('devrait afficher le titre principal', () => {
      cy.visit('/')
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="hero-title"]').should('contain', 'checklist')
    })

    it('devrait afficher la description', () => {
      cy.visit('/')
      cy.get('[data-cy="hero-description"]').should('be.visible')
    })

    it('devrait afficher les boutons d\'action', () => {
      cy.visit('/')
      cy.get('[data-cy="hero-cta-primary"]').should('be.visible')
      cy.get('[data-cy="hero-cta-secondary"]').should('be.visible')
    })
  })

  describe('Section Features', () => {
    it('devrait afficher les fonctionnalités principales', () => {
      cy.visit('/')
      cy.get('[data-cy="feature-item"]').should('have.length.at.least', 3)
    })

    it('devrait afficher les icônes et descriptions des fonctionnalités', () => {
      cy.visit('/')
      cy.get('[data-cy="feature-item"]').each(($feature) => {
        cy.wrap($feature).find('[data-cy="feature-icon"]').should('be.visible')
        cy.wrap($feature).find('[data-cy="feature-title"]').should('be.visible')
        cy.wrap($feature).find('[data-cy="feature-description"]').should('be.visible')
      })
    })
  })

  describe('Section Pricing', () => {
    it('devrait afficher les plans tarifaires', () => {
      cy.visit('/')
      cy.get('[data-cy="pricing-plan"]').should('have.length.at.least', 1)
    })

    it('devrait afficher les détails des plans', () => {
      cy.visit('/')
      cy.get('[data-cy="pricing-plan"]').each(($plan) => {
        cy.wrap($plan).find('[data-cy="plan-name"]').should('be.visible')
        cy.wrap($plan).find('[data-cy="plan-price"]').should('be.visible')
        cy.wrap($plan).find('[data-cy="plan-features"]').should('be.visible')
      })
    })
  })

  describe('Page d\'aide', () => {
    it('devrait afficher la page d\'aide', () => {
      cy.visit('/help')
      cy.get('[data-cy="help-content"]').should('be.visible')
      cy.get('h1').should('contain', 'Aide')
    })

    it('devrait être accessible sans authentification', () => {
      cy.mockLogout()
      cy.visit('/help')
      cy.url().should('include', '/help')
      cy.get('[data-cy="help-content"]').should('be.visible')
    })

    it('devrait afficher les sections d\'aide', () => {
      cy.visit('/help')
      cy.get('[data-cy="help-section"]').should('have.length.at.least', 1)
    })
  })

  describe('Navigation entre pages publiques', () => {
    it('devrait permettre de naviguer entre toutes les pages publiques', () => {
      const publicPages = [
        { path: '/', title: 'Accueil' },
        { path: '/login', title: 'Connexion' },
        { path: '/register', title: 'Inscription' },
        { path: '/help', title: 'Aide' }
      ]

      publicPages.forEach(page => {
        cy.visit(page.path)
        cy.url().should('include', page.path)
        cy.get('title').should('contain', page.title)
      })
    })

    it('devrait afficher le bon layout pour chaque page', () => {
      // Pages avec layout auth
      cy.visit('/login')
      cy.get('[data-cy="auth-layout"]').should('be.visible')
      
      cy.visit('/register')
      cy.get('[data-cy="auth-layout"]').should('be.visible')
      
      // Pages avec layout default
      cy.visit('/')
      cy.get('[data-cy="default-layout"]').should('be.visible')
      
      cy.visit('/help')
      cy.get('[data-cy="default-layout"]').should('be.visible')
    })
  })

  describe('Responsive design des pages publiques', () => {
    it('devrait s\'adapter sur mobile', () => {
      cy.setMobileViewport()
      cy.visit('/')
      
      cy.get('[data-cy="hero-section"]').should('be.visible')
      cy.get('[data-cy="mobile-nav"]').should('be.visible')
      cy.get('[data-cy="desktop-nav"]').should('not.be.visible')
    })

    it('devrait s\'adapter sur tablet', () => {
      cy.setTabletViewport()
      cy.visit('/')
      
      cy.get('[data-cy="hero-section"]').should('be.visible')
      cy.get('[data-cy="features-section"]').should('be.visible')
    })

    it('devrait s\'adapter sur desktop', () => {
      cy.setDesktopViewport()
      cy.visit('/')
      
      cy.get('[data-cy="hero-section"]').should('be.visible')
      cy.get('[data-cy="desktop-nav"]').should('be.visible')
      cy.get('[data-cy="mobile-nav"]').should('not.be.visible')
    })
  })

  describe('SEO et métadonnées', () => {
    it('devrait avoir les bonnes métadonnées sur la page d\'accueil', () => {
      cy.visit('/')
      cy.get('head title').should('contain', 'Serpenter')
      cy.get('head meta[name="description"]').should('exist')
      cy.get('head meta[property="og:title"]').should('exist')
    })

    it('devrait avoir les bonnes métadonnées sur les pages d\'auth', () => {
      cy.visit('/login')
      cy.get('head title').should('contain', 'Connexion')
      
      cy.visit('/register')
      cy.get('head title').should('contain', 'Inscription')
    })
  })

  describe('Performance des pages publiques', () => {
    it('devrait charger rapidement', () => {
      const start = Date.now()
      cy.visit('/')
      cy.get('[data-cy="hero-section"]').should('be.visible').then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(2000) // Moins de 2 secondes
      })
    })

    it('devrait optimiser les images', () => {
      cy.visit('/')
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'loading', 'lazy')
      })
    })
  })

  describe('Thème sur les pages publiques', () => {
    it('devrait permettre de changer le thème sur les pages publiques', () => {
      cy.visit('/')
      cy.get('[data-cy="theme-toggle"]').should('be.visible')
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light-theme')
    })

    it('devrait persister le thème entre les pages', () => {
      cy.visit('/')
      cy.get('[data-cy="theme-toggle"]').click()
      
      cy.visit('/login')
      cy.get('html').should('have.class', 'light-theme')
    })
  })
})
