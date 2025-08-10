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
      { id: 'preparation', name: 'Préparation', icon: 'heroicons:clipboard-document-list' },
      { id: 'conformite', name: 'Conformité', icon: 'heroicons:check-circle' }
    ],
    'wordpress-audit': [
      { id: 'configuration', name: 'Configuration', icon: 'heroicons:cog' },
      { id: 'securite', name: 'Sécurité', icon: 'heroicons:shield-check' },
      { id: 'performance', name: 'Performance', icon: 'heroicons:bolt' },
      { id: 'maintenance', name: 'Maintenance', icon: 'heroicons:wrench-screwdriver' }
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
      console.error('Erreur lors du chargement des catégories:', error)
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

