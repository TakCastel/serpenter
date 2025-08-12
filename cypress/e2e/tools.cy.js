describe('🔍 Outils intégrés', () => {
  beforeEach(() => {
    cy.mockLogin()
  })

  describe('Lighthouse Audit (Web Pre-launch)', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Site Web',
          checklistType: 'web-prelaunch'
        }))
      })
    })

    it('devrait afficher l\'accordéon Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion"]').should('be.visible')
    })

    it('devrait permettre d\'ouvrir/fermer l\'accordéon Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-accordion-content"]').should('be.visible')
      
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-accordion-content"]').should('not.be.visible')
    })

    it('devrait afficher le formulaire d\'audit Lighthouse', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-url-input"]').should('be.visible')
      cy.get('[data-cy="lighthouse-run-button"]').should('be.visible')
    })

    it('devrait valider l\'URL avant de lancer l\'audit', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-run-button"]').should('be.disabled')
      
      cy.get('[data-cy="lighthouse-url-input"]').type('https://example.com')
      cy.get('[data-cy="lighthouse-run-button"]').should('not.be.disabled')
    })

    it('devrait afficher un état de chargement pendant l\'audit', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-url-input"]').type('https://example.com')
      
      // Mock de la requête Lighthouse
      cy.intercept('POST', '/api/lh', {
        statusCode: 200,
        body: {
          performance: 85,
          accessibility: 92,
          bestPractices: 88,
          seo: 95
        },
        delay: 2000 // Simuler un délai
      }).as('lighthouseAudit')
      
      cy.get('[data-cy="lighthouse-run-button"]').click()
      cy.get('[data-cy="lighthouse-loading"]').should('be.visible')
      
      cy.wait('@lighthouseAudit')
      cy.get('[data-cy="lighthouse-loading"]').should('not.exist')
      cy.get('[data-cy="lighthouse-results"]').should('be.visible')
    })
  })

  describe('Security Scanner (Security Checker)', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'Audit Sécurité',
          checklistType: 'security-checker'
        }))
      })
    })

    it('devrait afficher l\'accordéon Security Scanner', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="security-scanner-accordion"]').should('be.visible')
    })

    it('devrait permettre de lancer un scan de sécurité', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="security-scanner-accordion-header"]').click()
      cy.get('[data-cy="security-url-input"]').type('https://example.com')
      
      // Mock de la requête de scan
      cy.intercept('POST', '/api/security-scan', {
        statusCode: 200,
        body: {
          vulnerabilities: [],
          score: 95,
          recommendations: ['Enable HSTS', 'Update dependencies']
        }
      }).as('securityScan')
      
      cy.get('[data-cy="security-scan-button"]').click()
      cy.wait('@securityScan')
      cy.get('[data-cy="security-results"]').should('be.visible')
    })

    it('devrait cocher automatiquement les éléments après un scan réussi', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="security-scanner-accordion-header"]').click()
      cy.get('[data-cy="security-url-input"]').type('https://example.com')
      
      cy.intercept('POST', '/api/security-scan', {
        statusCode: 200,
        body: {
          autoCheckedItems: ['security-headers', 'security-ssl'],
          score: 95
        }
      }).as('securityScanAutoCheck')
      
      cy.get('[data-cy="security-scan-button"]').click()
      cy.wait('@securityScanAutoCheck')
      
      // Vérifier que les éléments sont cochés automatiquement
      cy.get('[data-cy="checklist-checkbox"][data-item-id="security-headers"]').should('be.checked')
      cy.get('[data-cy="checklist-checkbox"][data-item-id="security-ssl"]').should('be.checked')
    })
  })

  describe('App Preflight (App Store Preflight)', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          name: 'App Mobile',
          checklistType: 'appstore-preflight'
        }))
      })
    })

    it('devrait afficher l\'accordéon App Preflight', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="app-preflight-accordion"]').should('be.visible')
    })

    it('devrait permettre d\'analyser une app', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="app-preflight-accordion-header"]').click()
      cy.get('[data-cy="app-url-input"]').type('https://apps.apple.com/app/test')
      
      // Mock de l'analyse d'app
      cy.intercept('POST', '/api/app-analysis', {
        statusCode: 200,
        body: {
          appInfo: {
            name: 'Test App',
            version: '1.0.0',
            rating: 4.5
          },
          compliance: {
            appStore: true,
            playStore: true
          }
        }
      }).as('appAnalysis')
      
      cy.get('[data-cy="app-preflight-check-button"]').click()
      cy.wait('@appAnalysis')
      cy.get('[data-cy="app-preflight-results"]').should('be.visible')
    })
  })

  describe('Gestion des erreurs des outils', () => {
    it('devrait gérer les erreurs de Lighthouse', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-url-input"]').type('https://invalid-url')
      
      cy.intercept('POST', '/api/lh', {
        statusCode: 500,
        body: { error: 'URL invalide' }
      }).as('lighthouseError')
      
      cy.get('[data-cy="lighthouse-run-button"]').click()
      cy.wait('@lighthouseError')
      cy.get('[data-cy="lighthouse-error"]').should('be.visible')
    })

    it('devrait gérer les timeouts des outils', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'security-checker'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="security-scanner-accordion-header"]').click()
      cy.get('[data-cy="security-url-input"]').type('https://slow-site.com')
      
      cy.intercept('POST', '/api/security-scan', {
        statusCode: 408,
        body: { error: 'Timeout' }
      }).as('securityTimeout')
      
      cy.get('[data-cy="security-scan-button"]').click()
      cy.wait('@securityTimeout')
      cy.get('[data-cy="security-error"]').should('contain', 'Timeout')
    })
  })

  describe('Intégration outils et checklist', () => {
    it('devrait mettre à jour la progression après utilisation d\'un outil', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="progress-percentage"]').invoke('text').then((initialProgress) => {
        
        cy.get('[data-cy="lighthouse-accordion-header"]').click()
        cy.get('[data-cy="lighthouse-url-input"]').type('https://example.com')
        
        cy.intercept('POST', '/api/lh', {
          statusCode: 200,
          body: {
            performance: 95,
            accessibility: 98,
            bestPractices: 92,
            seo: 96,
            autoCheckedItems: ['meta-title', 'meta-description']
          }
        }).as('lighthouseSuccess')
        
        cy.get('[data-cy="lighthouse-run-button"]').click()
        cy.wait('@lighthouseSuccess')
        
        // Vérifier que la progression a augmenté
        cy.get('[data-cy="progress-percentage"]').invoke('text').should('not.equal', initialProgress)
      })
    })

    it('devrait afficher les résultats des outils de manière persistante', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      cy.get('[data-cy="lighthouse-url-input"]').type('https://example.com')
      
      cy.intercept('POST', '/api/lh', {
        statusCode: 200,
        body: { performance: 85, accessibility: 92 }
      }).as('lighthouseAudit')
      
      cy.get('[data-cy="lighthouse-run-button"]').click()
      cy.wait('@lighthouseAudit')
      cy.get('[data-cy="lighthouse-results"]').should('be.visible')
      
      // Recharger la page
      cy.reload()
      cy.get('[data-cy="lighthouse-accordion-header"]').click()
      
      // Les résultats devraient être persistants
      cy.get('[data-cy="lighthouse-results"]').should('be.visible')
    })
  })

  describe('Responsive design des outils', () => {
    it('devrait adapter l\'affichage des outils sur mobile', () => {
      cy.setMobileViewport()
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      
      cy.visit('/dashboard')
      
      // Sur mobile, les outils devraient être en bas
      cy.get('[data-cy="lighthouse-accordion"]').should('be.visible')
      cy.get('[data-cy="lighthouse-accordion"]').should('have.class', 'mobile-bottom')
    })
  })
})
