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
});
