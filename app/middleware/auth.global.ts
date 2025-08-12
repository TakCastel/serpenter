export default defineNuxtRouteMiddleware((to) => {
  // Ne rien faire côté serveur
  if (import.meta.server) return

  // Protéger le dashboard et ses sous-routes, ainsi que les pages de profil
  const isProtected = to.path.startsWith('/dashboard') ||
                     to.path.startsWith('/profile') ||
                     to.path.startsWith('/settings') ||
                     to.path.startsWith('/help')

  if (!isProtected) return

  // Vérifier l'authentification côté client uniquement
  if (import.meta.client) {
    // Essayer de trouver la clé Firebase dans le localStorage
    let firebaseUser = null

    // Chercher toutes les clés qui correspondent au pattern Firebase
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('firebase:authUser:') && key.endsWith(':[DEFAULT]')) {
        firebaseUser = localStorage.getItem(key)
        break
      }
    }

    if (!firebaseUser) {
      // Accès refusé - Redirection vers login
      return navigateTo('/login')
    }

    try {
      const userData = JSON.parse(firebaseUser)
      if (!userData.uid) {
        // Utilisateur invalide - Redirection vers login
        return navigateTo('/login')
      }
    } catch (error) {
      // Erreur parsing user - Redirection vers login
      return navigateTo('/login')
    }
  }
})
