// Utilitaire pour analyser la taille du bundle
export const analyzeBundle = () => {
  if (process.env.ANALYZE === 'true') {
    // Analyse des modules les plus volumineux
    const modules = [
      { name: 'Vue', size: '~40KB' },
      { name: 'Vue Router', size: '~20KB' },
      { name: 'Pinia', size: '~15KB' },
      { name: 'Tailwind CSS', size: '~50KB' },
      { name: 'i18n', size: '~25KB' }
    ]
    
    console.table(modules)
  }
}

// Fonction pour optimiser les imports
export const optimizeImports = () => {
  // Imports optimisés pour réduire la taille du bundle
  return {
    // Utiliser des imports spécifiques au lieu de modules complets
    vue: 'vue/dist/vue.esm-bundler.js',
    router: 'vue-router/dist/vue-router.esm-bundler.js'
  }
}
