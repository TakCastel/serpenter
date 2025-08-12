import { initializeApp, getApps } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(async () => {
  const cfg = useRuntimeConfig().public.firebase

  // Pas de config → on ne fait rien (évite un 500 sur environnements sans vars)
  if (!cfg?.apiKey) {
    // Configuration Firebase manquante
    return
  }

  // Configuration Firebase chargée

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey: cfg.apiKey,
        authDomain: cfg.authDomain,
        projectId: cfg.projectId,
        storageBucket: cfg.storageBucket,
        messagingSenderId: cfg.messagingSenderId,
        appId: cfg.appId,
        measurementId: cfg.measurementId
      })

  const auth = getAuth(app)
  await setPersistence(auth, browserLocalPersistence)
  const db = getFirestore(app)

  // Firebase initialisé avec succès

  return {
    provide: {
      firebaseApp: app,
      auth,
      db
    }
  }
})
