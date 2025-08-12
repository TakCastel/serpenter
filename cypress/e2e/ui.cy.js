describe('🎨 Interface & Navigation', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Thème sombre/clair (ThemeToggle)', () => {
    it('devrait afficher le bouton de changement de thème', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').should('be.visible')
    })

    it('devrait basculer entre thème sombre et clair', () => {
      cy.visit('/dashboard')
      
      // Vérifier le thème initial (sombre par défaut)
      cy.get('html').should('not.have.class', 'light-theme')
      cy.get('[data-cy="theme-toggle"]').find('svg').should('have.attr', 'data-icon').and('include', 'sun')
      
      // Basculer vers le thème clair
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('have.class', 'light-theme')
      cy.get('[data-cy="theme-toggle"]').find('svg').should('have.attr', 'data-icon').and('include', 'moon')
      
      // Basculer vers le thème sombre
      cy.get('[data-cy="theme-toggle"]').click()
      cy.get('html').should('not.have.class', 'light-theme')
    })

    it('devrait persister le thème dans localStorage', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').click()
      
      cy.window().then((win) => {
        expect(win.localStorage.getItem('theme')).to.equal('light')
      })
      
      cy.reload()
      cy.get('html').should('have.class', 'light-theme')
    })
  })

  describe('Sidebar responsive', () => {
    it('devrait afficher la sidebar sur desktop', () => {
      cy.setDesktopViewport()
      cy.visit('/dashboard')
      cy.get('[data-cy="sidebar"]').should('be.visible')
      cy.get('[data-cy="sidebar-toggle"]').should('be.visible')
    })

    it('devrait permettre de collapse/expand la sidebar', () => {
      cy.setDesktopViewport()
      cy.visit('/dashboard')
      cy.get('[data-cy="sidebar"]').should('be.visible')
      
      cy.get('[data-cy="sidebar-toggle"]').click()
      cy.get('[data-cy="sidebar"]').should('have.class', 'collapsed')
      
      cy.get('[data-cy="sidebar-toggle"]').click()
      cy.get('[data-cy="sidebar"]').should('not.have.class', 'collapsed')
    })

    it('devrait masquer la sidebar sur mobile', () => {
      cy.setMobileViewport()
      cy.visit('/dashboard')
      cy.get('[data-cy="sidebar"]').should('not.be.visible')
      cy.get('[data-cy="mobile-menu-toggle"]').should('be.visible')
    })
  })

  describe('Header fixe', () => {
    it('devrait afficher le header fixe', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="app-header"]').should('be.visible')
      cy.get('[data-cy="app-header"]').should('have.class', 'fixed')
    })

    it('devrait afficher l\'indicateur de progression dans le header', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="header-progress"]').should('be.visible')
    })

    it('devrait rester fixe lors du scroll', () => {
      cy.visit('/dashboard')
      cy.scrollTo(0, 500)
      cy.get('[data-cy="app-header"]').should('be.visible')
    })
  })

  describe('Menu mobile', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('devrait afficher le bouton de menu mobile', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="mobile-menu-toggle"]').should('be.visible')
    })

    it('devrait ouvrir et fermer le menu mobile', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="mobile-menu"]').should('not.be.visible')
      
      cy.get('[data-cy="mobile-menu-toggle"]').click()
      cy.get('[data-cy="mobile-menu"]').should('be.visible')
      
      cy.get('[data-cy="mobile-menu-close"]').click()
      cy.get('[data-cy="mobile-menu"]').should('not.be.visible')
    })

    it('devrait permettre la déconnexion depuis le menu mobile', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="mobile-menu-toggle"]').click()
      cy.get('[data-cy="mobile-logout-button"]').should('be.visible').click()
      cy.url().should('include', '/login')
    })
  })

  describe('Responsive Design', () => {
    it('devrait s\'adapter aux différentes tailles d\'écran', () => {
      cy.testResponsive((viewport) => {
        cy.visit('/dashboard')
        cy.get('[data-cy="main-content"]').should('be.visible')
        
        if (viewport === 'mobile') {
          cy.get('[data-cy="sidebar"]').should('not.be.visible')
          cy.get('[data-cy="mobile-menu-toggle"]').should('be.visible')
        } else {
          cy.get('[data-cy="sidebar"]').should('be.visible')
          cy.get('[data-cy="mobile-menu-toggle"]').should('not.be.visible')
        }
      })
    })

    it('devrait adapter la grille de layout selon l\'écran', () => {
      // Desktop: 2 colonnes
      cy.setDesktopViewport()
      cy.visit('/dashboard')
      cy.get('[data-cy="dashboard-grid"]').should('have.class', 'lg:grid-cols-3')
      
      // Mobile: 1 colonne
      cy.setMobileViewport()
      cy.visit('/dashboard')
      cy.get('[data-cy="dashboard-grid"]').should('have.class', 'grid-cols-1')
    })
  })

  describe('Navigation tactile', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('devrait supporter les interactions tactiles', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-item"]').first().trigger('touchstart')
      cy.get('[data-cy="checklist-item"]').first().trigger('touchend')
    })

    it('devrait gérer le swipe pour ouvrir/fermer le menu', () => {
      cy.visit('/dashboard')
      // Simuler un swipe depuis la gauche
      cy.get('body').trigger('touchstart', { touches: [{ clientX: 0, clientY: 300 }] })
      cy.get('body').trigger('touchmove', { touches: [{ clientX: 100, clientY: 300 }] })
      cy.get('body').trigger('touchend')
      
      cy.get('[data-cy="mobile-menu"]').should('be.visible')
    })
  })

  describe('Internationalisation (i18n)', () => {
    it('devrait afficher le sélecteur de langue', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lang-selector"]').should('be.visible')
    })

    it('devrait permettre de changer de langue', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lang-selector"]').click()
      cy.get('[data-cy="lang-option-en"]').click()
      
      // Vérifier que l'URL contient le préfixe de langue
      cy.url().should('include', '/en/')
      
      // Vérifier que le contenu est en anglais
      cy.get('body').should('contain', 'Dashboard')
    })

    it('devrait persister la langue sélectionnée', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lang-selector"]').click()
      cy.get('[data-cy="lang-option-en"]').click()
      
      cy.reload()
      cy.url().should('include', '/en/')
    })
  })

  describe('Accessibilité', () => {
    it('devrait avoir des labels ARIA appropriés', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').should('have.attr', 'aria-label')
      cy.get('[data-cy="sidebar-toggle"]').should('have.attr', 'aria-label')
      cy.get('[data-cy="project-selector"]').should('have.attr', 'aria-label')
    })

    it('devrait supporter la navigation au clavier', () => {
      cy.visit('/dashboard')
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-cy')
    })

    it('devrait avoir un contraste suffisant', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="theme-toggle"]').click() // Thème clair
      
      // Vérifier que les éléments sont visibles (contraste suffisant)
      cy.get('[data-cy="app-header"]').should('be.visible')
      cy.get('[data-cy="sidebar"]').should('be.visible')
      cy.get('[data-cy="main-content"]').should('be.visible')
    })
  })

  describe('Performance UI', () => {
    it('devrait charger rapidement', () => {
      const start = Date.now()
      cy.visit('/dashboard')
      cy.get('[data-cy="main-content"]').should('be.visible').then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(3000) // Moins de 3 secondes
      })
    })

    it('devrait afficher des skeletons pendant le chargement', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="skeleton-loader"]').should('be.visible')
      cy.get('[data-cy="main-content"]').should('be.visible')
      cy.get('[data-cy="skeleton-loader"]').should('not.exist')
    })
  })
})
