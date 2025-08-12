import { ref } from 'vue'
import {
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'

export function useAuth() {
  // Garde SSR: renvoie un mock neutre côté serveur avec l'API complète
  if (import.meta.server) {
    const user = ref<User | null>(null)
    const ready = ref(false)
    return {
      user,
      currentUser: user,
      ready,
      isReady: ready,
      signIn: async () => { throw new Error('Auth indisponible côté serveur') },
      signOut: async () => {},
      logout: async () => {},
      login: async () => { throw new Error('Auth indisponible côté serveur') },
      register: async () => { throw new Error('Auth indisponible côté serveur') },
      loginWithGoogle: async () => { throw new Error('Auth indisponible côté serveur') },
      forgotPassword: async () => { throw new Error('Auth indisponible côté serveur') }
    }
  }

  const { $auth } = useNuxtApp() as any

  // Plugin non chargé → fail-safe sans casser l'app
  if (!$auth) {
    const user = ref<User | null>(null)
    const ready = ref(false)
    // Plugin Firebase non initialisé
    return {
      user,
      currentUser: user,
      ready,
      isReady: ready,
      signIn: async () => { throw new Error('Auth indisponible (plugin Firebase non initialisé)') },
      signOut: async () => { /* SignOut appelé sans Firebase */ },
      logout: async () => { /* Logout appelé sans Firebase */ },
      login: async () => { throw new Error('Auth indisponible (plugin Firebase non initialisé)') },
      register: async () => { throw new Error('Auth indisponible (plugin Firebase non initialisé)') },
      loginWithGoogle: async () => { throw new Error('Auth indisponible (plugin Firebase non initialisé)') },
      forgotPassword: async () => { throw new Error('Auth indisponible (plugin Firebase non initialisé)') }
    }
  }

  const user = ref<User | null>(null)
  const ready = ref(false)

  // Initialiser l'état d'authentification immédiatement
  onAuthStateChanged($auth, (u: User | null) => {
    user.value = u ?? null
    ready.value = true
  })

  // Gérer les résultats de redirection Google
  if (import.meta.client) {
    getRedirectResult($auth).then((result) => {
      if (result) {
        // Connexion Google réussie via redirect
      }
    }).catch(() => {
      // Erreur lors du traitement du redirect Google
    })
  }

  const signIn = async () => {
    // Utiliser redirect pour éviter les problèmes COOP
    const provider = new GoogleAuthProvider()
    await signInWithRedirect($auth, provider)
  }

  const login = async (email: string, password: string) => {
    try {
      await setPersistence($auth, browserLocalPersistence)
      return await signInWithEmailAndPassword($auth, email, password)
    } catch (error) {
      // Erreur lors de la connexion
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      await setPersistence($auth, browserLocalPersistence)
      return await createUserWithEmailAndPassword($auth, email, password)
    } catch (error) {
      // Erreur lors de l'inscription
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await setPersistence($auth, browserLocalPersistence)

      // Essayer popup d'abord, fallback sur redirect si nécessaire
      try {
        return await signInWithPopup($auth, provider)
      } catch (popupError: any) {
        // Si popup échoue (bloqué par navigateur), utiliser redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          // Popup bloqué, utilisation de redirect
          return await signInWithRedirect($auth, provider)
        }
        throw popupError
      }
    } catch (error) {
      // Erreur lors de la connexion Google
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      return await sendPasswordResetEmail($auth, email)
    } catch (error) {
      // Erreur lors de l'envoi du mail de réinitialisation
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut($auth)
      // Nettoyer le localStorage après la déconnexion
      if (import.meta.client) {
        // Chercher et supprimer toutes les clés Firebase
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.startsWith('firebase:authUser:') || key.startsWith('firebase:'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
      }
    } catch (error) {
      // Erreur lors de la déconnexion
      throw error
    }
  }

  return {
    user,
    currentUser: user,
    ready,
    isReady: ready,
    signIn,
    signOut,
    logout: signOut, // Alias pour compatibilité
    login,
    register,
    loginWithGoogle,
    forgotPassword
  }
}
