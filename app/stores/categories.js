import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
  // Catégories parentes par type de checklist
  const categoriesByType = {
    'web-prelaunch': [
      { id: 'seo', name: 'SEO & Référencement', icon: 'heroicons:magnifying-glass' },
      { id: 'accessibilite', name: 'Accessibilité', icon: 'heroicons:heart' },
      { id: 'performance', name: 'Performance', icon: 'heroicons:bolt' },
      { id: 'securite', name: 'Sécurité', icon: 'heroicons:shield-check' },
      { id: 'conformite', name: 'Conformité', icon: 'heroicons:check-circle' }
    ],
    'appstore-preflight': [
      { id: 'app-store', name: 'App Store', icon: 'fluent-emoji:apple-logo' },
      { id: 'play-store', name: 'Play Store', icon: 'fluent-emoji:android-logo' }
    ],
    'security-checker': [
      { id: 'reseau-chiffrement', name: 'Sécurité réseau & chiffrement', icon: 'fluent-emoji:shield' },
      { id: 'authentification-acces', name: 'Authentification & contrôle d\'accès', icon: 'fluent-emoji:key' },
      { id: 'protection-attaques', name: 'Protection contre les attaques', icon: 'fluent-emoji:crossed-swords' },
      { id: 'fichiers-donnees', name: 'Sécurité des fichiers & données', icon: 'fluent-emoji:file-folder' },
      { id: 'maintenance-surveillance', name: 'Maintenance & surveillance', icon: 'fluent-emoji:eye' }
    ]
  }

  const categories = ref([])
  const activeCategory = ref(null)

  const loadCategoriesForProject = async (checklistType) => {
    try {
      const projectCategories = categoriesByType[checklistType] || []
      
      // Mettre à jour les catégories immédiatement
      categories.value = projectCategories
      
      // Définir la première catégorie comme active par défaut
      if (categories.value.length > 0) {
        activeCategory.value = categories.value[0].id
      } else {
        activeCategory.value = null
      }
      
      // Émettre un événement pour notifier les composants
      if (process.client) {
        window.dispatchEvent(new CustomEvent('categories-updated', { 
          detail: { 
            categories: categories.value,
            checklistType 
          } 
        }))
      }
      
      return categories.value
    } catch (error) {
      // Erreur lors du chargement des catégories
      categories.value = []
      activeCategory.value = null
      return []
    }
  }

  const setActiveCategory = (categoryId) => {
    activeCategory.value = categoryId
  }

  const getCategoryById = (categoryId) => {
    return categories.value.find(cat => cat.id === categoryId)
  }

  const resetCategories = () => {
    categories.value = []
    activeCategory.value = null
  }

  return {
    categories: computed(() => categories.value),
    activeCategory: computed(() => activeCategory.value),
    loadCategoriesForProject,
    setActiveCategory,
    getCategoryById,
    categoriesByType,
    resetCategories
  }
})

