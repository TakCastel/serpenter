// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  nitro: {
    preset: 'netlify-static',
    inlineDynamicImports: false,
    minify: true,
    externals: { inline: [] },
    sourceMap: false
  },
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
    class: 'icon'
  },
  i18n: {
    defaultLocale: 'fr',
    langDir: '/i18n/locales/',
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'no prefix',
      alwaysRedirect: false,
      fallbackLocale: 'fr'
    },
    compilation: {
      strictMessage: false
    },
    vueI18n: './i18n.config.ts'
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
  vite: {
    plugins: [{
      name: 'force-node-crypto',
      enforce: 'pre',
      configResolved() {
        // Plugin noop pour s'assurer qu'aucun alias crypto ne s'applique
      }
    }],
    resolve: {
      alias: {
        // Surtout ne pas rediriger 'node:crypto' vers un polyfill
      }
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },
  experimental: {
    payloadExtraction: false
  },
  
  render: {
    fallback: true
  }
})