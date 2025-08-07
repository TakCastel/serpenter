// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  i18n: {
    defaultLocale: 'fr',
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
            // Dark theme: noir et doré
            dark: {
              bg: '#0a0a0a',
              surface: '#1a1a1a',
              border: '#2a2a2a',
              text: '#ffffff',
              accent: '#ffd700', // doré
              'accent-hover': '#ffed4e'
            },
            // Light theme: blanc et orange sombre
            light: {
              bg: '#ffffff',
              surface: '#f8f9fa',
              border: '#e9ecef',
              text: '#212529',
              accent: '#d63384', // orange sombre
              'accent-hover': '#c2255c'
            }
          }
        }
      }
    }
  },
  // Optimisations pour réduire l'utilisation mémoire
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-i18n'],
            utils: ['@nuxt/icon']
          }
        }
      }
    }
  },
  experimental: {
    payloadExtraction: false
  },
  // Optimisations pour le build
  build: {
    transpile: ['vue-i18n']
  }
})