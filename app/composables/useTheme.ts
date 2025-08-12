import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useTheme = () => {
  const isDark = ref(true)
  const isClient = ref(false)

  // Computed pour les classes CSS
  const themeClass = computed(() => isDark.value ? '' : 'light-theme')
  
  // Fonction pour basculer le thème
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isClient.value) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      applyTheme()
    }
  }

  // Fonction pour définir le thème
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    if (isClient.value) {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
      applyTheme()
    }
  }

  // Fonction pour appliquer le thème au DOM
  const applyTheme = () => {
    if (isClient.value) {
      const root = document.documentElement
      if (isDark.value) {
        root.classList.remove('light-theme')
      } else {
        root.classList.add('light-theme')
      }
    }
  }

  // Fonction pour initialiser le thème
  const initTheme = () => {
    if (isClient.value) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'light') {
        isDark.value = false
      } else {
        isDark.value = true
      }
      applyTheme()
    }
  }

  // Initialiser le thème quand le composant est monté
  onMounted(() => {
    isClient.value = true
    initTheme()
  })

  // Nettoyer quand le composant est démonté
  onUnmounted(() => {
    isClient.value = false
  })

  return {
    isDark,
    themeClass,
    toggleTheme,
    setTheme,
    initTheme
  }
}
