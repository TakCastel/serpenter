// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,

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

  // Configuration optimisée pour réduire l'utilisation mémoire
  nitro: {
    preset: 'netlify',
    // Désactiver complètement le prerendering
    prerender: {
      crawlLinks: false,
      routes: []
    },
    // Optimisations mémoire maximales
    inlineDynamicImports: false,
    minify: true,
    sourceMap: false,
    // Externaliser Firebase pour réduire la taille du bundle
    externals: {
      inline: [],
      external: ['firebase']
    },
    // Réduire la parallélisation
    rollupConfig: {
      output: {
        maxParallelFileOps: 1
      }
    }
  },

  // Optimisations drastiques pour réduire l'utilisation mémoire
  vite: {
    build: {
      sourcemap: false,
      // Réduire la taille des chunks pour éviter les gros bundles
      rollupOptions: {
        output: {
          manualChunks: {
            'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'vue': ['vue', '@vue/runtime-core'],
            'vendor': ['@nuxt/icon', '@nuxtjs/i18n']
          }
        }
      },
      // Limiter la parallélisation pour économiser la RAM
      terserOptions: {
        parallel: 1
      }
    },
    // Optimisations supplémentaires
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      }
    }
  }
})
