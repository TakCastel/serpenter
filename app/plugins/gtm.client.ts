export default defineNuxtPlugin(() => {
  // Le module @nuxtjs/google-tag-manager gère automatiquement l'injection
  // Ce plugin est optionnel mais peut être utilisé pour des configurations personnalisées
  
  if (process.client) {
    // Vérifier que GTM est chargé
    window.dataLayer = window.dataLayer || []
    
    // Fonction pour envoyer des événements personnalisés
    const gtm = {
      push(event: any) {
        window.dataLayer.push(event)
      }
    }
    
    // Exposer gtm globalement pour une utilisation dans les composants
    return {
      provide: {
        gtm
      }
    }
  }
})
