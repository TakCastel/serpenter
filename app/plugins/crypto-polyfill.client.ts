/**
 * Plugin pour résoudre les problèmes de crypto en mode SPA
 * S'exécute uniquement côté client
 */

export default defineNuxtPlugin(() => {
  // Vérifier que nous sommes côté client
  if (process.client) {
    // Polyfill pour crypto si nécessaire
    if (typeof window !== 'undefined' && !window.crypto) {
      // Fallback simple pour crypto
      (window as any).crypto = {
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        }
      };
    }
  }
});
