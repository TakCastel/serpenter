export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  
  // Protéger le dashboard et ses sous-routes, ainsi que les pages de profil
  const isProtected = to.path.startsWith('/dashboard') || 
                     to.path.startsWith('/profile') || 
                     to.path.startsWith('/settings') || 
                     to.path.startsWith('/help')
  
  if (!isProtected) return

  // Vérifier l'authentification côté client uniquement
  if (process.client) {
    const { currentUser } = useAuth()
    if (!currentUser.value) {
      return navigateTo('/login')
    }
  }
})
