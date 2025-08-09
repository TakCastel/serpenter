// Option 2
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getApps, initializeApp } from 'firebase/app'
import { ref } from 'vue'

const currentUser = ref<User | null>(null)
const isReady = ref(false)
let listenerInitialized = false

export function useAuth() {
  // Initialiser Firebase app si besoin
  if (typeof window !== 'undefined' && !getApps().length) {
    const config = useRuntimeConfig()
    const firebaseConfig = {
      apiKey: config.public.firebase.apiKey,
      authDomain: config.public.firebase.authDomain,
      projectId: config.public.firebase.projectId,
      storageBucket: config.public.firebase.storageBucket,
      messagingSenderId: config.public.firebase.messagingSenderId,
      appId: config.public.firebase.appId
    }
    if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId) {
      initializeApp(firebaseConfig)
    }
  }

  const auth = getAuth()

  // Hydrater immédiatement l’état courant
  if (currentUser.value === null) {
    currentUser.value = auth.currentUser
    if (auth.currentUser) isReady.value = true
  }

  // Attacher l’écouteur une seule fois côté client, sans onMounted
  if (typeof window !== 'undefined' && !listenerInitialized) {
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      isReady.value = true
    })
    listenerInitialized = true
  }

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
  const register = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence)
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await setPersistence(auth, browserLocalPersistence)
    try {
      return await signInWithPopup(auth, provider)
    } catch (e: any) {
      // Fallback redirect si popup bloqué ou environnement non supporté
      if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/operation-not-supported-in-this-environment') {
        return await signInWithRedirect(auth, provider)
      }
      throw e
    }
  }
  const forgotPassword = (email: string) => sendPasswordResetEmail(auth, email)
  const logout = () => signOut(auth)

  return { currentUser, isReady, login, register, loginWithGoogle, forgotPassword, logout }
}
