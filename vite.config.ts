import { defineConfig } from 'vite'

export default defineConfig({
  // Résoudre le problème crypto.hash avec Node.js 18
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  
  // Configuration pour le mode SPA
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          firebase: ['firebase']
        }
      }
    }
  },
  
  // Résoudre les problèmes de polyfills
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer'
    }
  },
  
  // Optimisations pour le mode SPA
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
