// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      },
      // Informations de version
      app: {
        name: 'serpenter',
        version: '1.0.0',
        buildDate: process.env.BUILD_DATE || new Date().toISOString(),
        buildHash: process.env.BUILD_HASH || 'dev',
        buildEnv: process.env.NODE_ENV || 'development'
      }
    }
  },

  icon: {
    size: '24px',
    class: 'icon',
    aliases: {
      nuxt: 'logos:nuxt-icon'
    }
  },

  i18n: {
    defaultLocale: 'fr',
    langDir: 'locales/',
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              bg: '#0a0a0a',
              surface: '#1a1a1a',
              border: '#2a2a2a',
              text: '#ffffff',
              accent: '#ffd700',
              'accent-hover': '#ffed4e'
            },
            light: {
              bg: '#ffffff',
              surface: '#f8f9fa',
              border: '#e9ecef',
              text: '#212529',
              accent: '#d63384',
              'accent-hover': '#c2255c'
            }
          }
        }
      }
    }
  },

  // Configuration pour le mode SPA (pas de prerendering)
  nitro: {
    preset: 'netlify-static',
    // Désactiver le prerendering en mode SPA
    prerender: false,
    // Allègement du bundle Nitro
    inlineDynamicImports: false,
    minify: true,
    externals: { inline: [] },
    sourceMap: false
  },

  // Configuration Vite simplifiée
  vite: {
    build: { sourcemap: false }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      }
    }
  }
})
