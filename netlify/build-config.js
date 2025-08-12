/**
 * Configuration de build spécifique pour Netlify en mode SPA
 */

module.exports = {
  // Configuration Nuxt pour le mode SPA
  nuxt: {
    ssr: false,
    nitro: {
      preset: 'netlify-static',
      prerender: false
    }
  },
  
  // Variables d'environnement pour le build
  env: {
    NODE_ENV: 'production',
    NUXT_APP_ENV: 'production',
    NUXT_SSR: 'false'
  },
  
  // Configuration des Netlify Functions
  functions: {
    directory: 'netlify/functions',
    nodeVersion: '18'
  }
};
