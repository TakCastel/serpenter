export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  const { currentUser } = useAuth()

  // Protéger le dashboard et ses sous-routes
  const isProtected = to.path.startsWith('/dashboard')
  if (!isProtected) return

  if (!currentUser.value) {
    return navigateTo('/login')
  }
})
