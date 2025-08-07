// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: false,

  ssr: true,

  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

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

  nitro: {
    preset: 'vercel',
    // Optimisations pour réduire la consommation mémoire
    minify: true,
    compressPublicAssets: true,
    experimental: {
      wasm: false
    },
    // Optimisations de build
    prerender: {
      crawlLinks: false
    }
  },

  // Optimisations Vite pour réduire la taille du bundle
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            pinia: ['pinia'],
            i18n: ['@nuxtjs/i18n']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia']
    }
  },

  // Optimisations de build
  experimental: {
    payloadExtraction: false
  }
});
