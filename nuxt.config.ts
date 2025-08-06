// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss'
  ],
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
  }
})