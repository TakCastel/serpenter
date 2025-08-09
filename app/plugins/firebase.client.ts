import { initializeApp, getApps } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
    if (process.dev) {
      // eslint-disable-next-line no-console
      console.error('[Firebase] Config incomplète. Vérifiez vos variables .env (NUXT_PUBLIC_FIREBASE_*)')
    }
    return
  }

  let app
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  }
  const auth = getAuth()
  await setPersistence(auth, browserLocalPersistence)
  const db = getFirestore()

  return {
    provide: {
      db
    }
  }
})
