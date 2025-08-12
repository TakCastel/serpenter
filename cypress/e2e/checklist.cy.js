describe('✅ Système de checklist', () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté avec un projet
    cy.mockLogin()
    cy.window().then((win) => {
      win.localStorage.setItem('currentProject', JSON.stringify({
        id: 'test-project',
        name: 'Test Project',
        checklistType: 'web-prelaunch'
      }))
    })
  })

  describe('Affichage de la checklist', () => {
    it('devrait afficher les catégories de checklist', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-category"]').should('have.length.at.least', 1)
      cy.get('[data-cy="category-seo"]').should('be.visible')
      cy.get('[data-cy="category-accessibilite"]').should('be.visible')
      cy.get('[data-cy="category-performance"]').should('be.visible')
      cy.get('[data-cy="category-securite"]').should('be.visible')
      cy.get('[data-cy="category-conformite"]').should('be.visible')
    })

    it('devrait afficher le pourcentage d\'avancement', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="progress-percentage"]').should('be.visible')
      cy.get('[data-cy="progress-bar"]').should('be.visible')
    })

    it('devrait afficher les éléments de checklist', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-item"]').should('have.length.at.least', 1)
    })
  })

  describe('Accordéons (ItemAccordion)', () => {
    it('devrait ouvrir et fermer les accordéons', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="accordion-header"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('be.visible')
      
      cy.get('[data-cy="accordion-header"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('not.be.visible')
    })

    it('devrait fermer l\'accordéon automatiquement quand l\'item est coché', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="accordion-header"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('be.visible')
      
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('not.be.visible')
    })

    it('devrait ouvrir l\'accordéon automatiquement quand l\'item est décoché', () => {
      cy.visit('/dashboard')
      // Cocher d'abord l'item
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      // Puis le décocher
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('be.visible')
    })

    it('ne devrait pas permettre d\'ouvrir l\'accordéon si l\'item est coché', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="accordion-header"]').first().click()
      cy.get('[data-cy="accordion-content"]').first().should('not.be.visible')
    })
  })

  describe('Cochage des éléments', () => {
    it('devrait permettre de cocher/décocher les éléments', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().should('not.be.checked')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
      
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="checklist-checkbox"]').first().should('not.be.checked')
    })

    it('devrait mettre à jour le pourcentage d\'avancement', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="progress-percentage"]').invoke('text').then((initialProgress) => {
        cy.get('[data-cy="checklist-checkbox"]').first().click()
        cy.get('[data-cy="progress-percentage"]').invoke('text').should('not.equal', initialProgress)
      })
    })

    it('devrait sauvegarder l\'état des éléments cochés', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.reload()
      cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
    })
  })

  describe('Navigation entre catégories', () => {
    it('devrait permettre de naviguer entre les catégories', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="category-nav-seo"]').click()
      cy.get('[data-cy="category-seo"]').should('be.visible')
      
      cy.get('[data-cy="category-nav-performance"]').click()
      cy.get('[data-cy="category-performance"]').should('be.visible')
    })

    it('devrait mettre en surbrillance la catégorie active', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="category-nav-seo"]').click()
      cy.get('[data-cy="category-nav-seo"]').should('have.class', 'active')
    })
  })

  describe('Réinitialisation des progrès', () => {
    it('devrait afficher le bouton de réinitialisation', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="reset-progress-button"]').should('be.visible')
    })

    it('devrait ouvrir la modal de confirmation', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="reset-progress-button"]').click()
      cy.get('[data-cy="reset-modal"]').should('be.visible')
      cy.get('[data-cy="confirm-reset-button"]').should('be.visible')
      cy.get('[data-cy="cancel-reset-button"]').should('be.visible')
    })

    it('devrait réinitialiser tous les progrès', () => {
      cy.visit('/dashboard')
      // Cocher quelques éléments
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      cy.get('[data-cy="checklist-checkbox"]').eq(1).click()
      
      // Réinitialiser
      cy.get('[data-cy="reset-progress-button"]').click()
      cy.get('[data-cy="confirm-reset-button"]').click()
      
      // Vérifier que tout est décoché
      cy.get('[data-cy="checklist-checkbox"]').should('not.be.checked')
      cy.get('[data-cy="progress-percentage"]').should('contain', '0%')
    })

    it('devrait permettre d\'annuler la réinitialisation', () => {
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      
      cy.get('[data-cy="reset-progress-button"]').click()
      cy.get('[data-cy="cancel-reset-button"]').click()
      
      cy.get('[data-cy="reset-modal"]').should('not.exist')
      cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
    })
  })

  describe('Types de checklist différents', () => {
    it('devrait afficher les bonnes catégories pour Web Pre-launch', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'web-prelaunch'
        }))
      })
      cy.visit('/dashboard')
      cy.get('[data-cy="category-seo"]').should('be.visible')
      cy.get('[data-cy="category-accessibilite"]').should('be.visible')
      cy.get('[data-cy="category-performance"]').should('be.visible')
    })

    it('devrait afficher les bonnes catégories pour App Store Preflight', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'appstore-preflight'
        }))
      })
      cy.visit('/dashboard')
      cy.get('[data-cy="category-app-store"]').should('be.visible')
      cy.get('[data-cy="category-play-store"]').should('be.visible')
    })

    it('devrait afficher les bonnes catégories pour Security Checker', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'test-project',
          checklistType: 'security-checker'
        }))
      })
      cy.visit('/dashboard')
      cy.get('[data-cy="category-security"]').should('be.visible')
    })
  })

  describe('Progression par projet', () => {
    it('devrait sauvegarder la progression individuellement par projet', () => {
      // Projet 1
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'project-1',
          name: 'Project 1',
          checklistType: 'web-prelaunch'
        }))
      })
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-checkbox"]').first().click()
      
      // Changer de projet
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'project-2',
          name: 'Project 2',
          checklistType: 'web-prelaunch'
        }))
      })
      cy.reload()
      cy.get('[data-cy="checklist-checkbox"]').first().should('not.be.checked')
      
      // Revenir au projet 1
      cy.window().then((win) => {
        win.localStorage.setItem('currentProject', JSON.stringify({
          id: 'project-1',
          name: 'Project 1',
          checklistType: 'web-prelaunch'
        }))
      })
      cy.reload()
      cy.get('[data-cy="checklist-checkbox"]').first().should('be.checked')
    })
  })
})
