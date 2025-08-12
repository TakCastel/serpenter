import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Configuration pour les tests avec Firebase
    env: {
      // Variables d'environnement pour les tests
      TEST_EMAIL: 'test@serpenter.com',
      TEST_PASSWORD: 'testpassword123',
      TEST_EMAIL_2: 'test2@serpenter.com',
      TEST_PASSWORD_2: 'testpassword456'
    },

    setupNodeEvents(on, config) {
      // Configuration des événements Node.js si nécessaire
      on('task', {
        // Tâches personnalisées pour les tests
        log(message) {
          console.log(message)
          return null
        }
      })
    },

    // Patterns de fichiers de test
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Exclusions
    excludeSpecPattern: [
      '**/node_modules/**',
      '**/dist/**'
    ],

    // Configuration pour les tests en mode headless
    chromeWebSecurity: false,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    }
  },

  component: {
    devServer: {
      framework: 'nuxt',
      bundler: 'vite'
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false
  }
})
