<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-6 transition-colors duration-200" style="color: var(--text-primary);">
        Checklist Pré-Déploiement
      </h1>
      <p class="text-xl transition-colors duration-200 mb-8" style="color: var(--text-secondary);">
        Vérifiez tous les aspects essentiels avant de mettre votre site en ligne
      </p>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border transition-all duration-200" style="background-color: var(--bg-surface); border-color: var(--bg-border);">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
              <Icon name="heroicons:check-circle" class="w-6 h-6" style="color: var(--bg-primary);" />
            </div>
            <div class="text-left">
              <div class="text-3xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
                {{ completedCount }}
              </div>
              <div class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
                sur {{ totalCount }} complétés
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border transition-all duration-200" style="background-color: var(--bg-surface); border-color: var(--bg-border);">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
              <Icon name="heroicons:chart-bar" class="w-6 h-6" style="color: var(--bg-primary);" />
            </div>
            <div class="text-left">
              <div class="text-3xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
                {{ Math.round(progressPercentage) }}%
              </div>
              <div class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
                terminé
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="w-full bg-gray-200 rounded-full h-2 transition-colors duration-200" style="background-color: var(--bg-border);">
        <div 
          class="h-2 rounded-full transition-all duration-300 ease-out"
          style="background-color: var(--accent-primary);"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-6" role="region" aria-label="Catégories de la checklist">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="rounded-lg border transition-colors duration-200"
        style="background-color: var(--bg-primary); border-color: var(--bg-border);"
        role="region"
        :aria-label="`Catégorie ${category.name}`"
      >
        <!-- Category Header -->
        <div 
          class="p-6 cursor-pointer transition-colors duration-200 hover:opacity-80"
          @click="toggleCategory(category.id)"
          @keydown.enter="toggleCategory(category.id)"
          @keydown.space.prevent="toggleCategory(category.id)"
          role="button"
          :aria-expanded="isCategoryExpanded(category.id)"
          :aria-controls="`category-${category.id}`"
          :aria-label="`${isCategoryExpanded(category.id) ? 'Fermer' : 'Ouvrir'} la catégorie ${category.name}`"
          tabindex="0"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon :name="getCategoryIcon(category.id)" class="w-8 h-8 transition-colors duration-200" style="color: var(--accent-primary);" aria-hidden="true" />
              </div>
              <div>
                <h2 class="text-xl font-semibold transition-colors duration-200" style="color: var(--text-primary);">{{ category.name }}</h2>
                <p class="text-sm transition-colors duration-200" style="color: var(--text-secondary);">{{ category.description }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-medium transition-colors duration-200" style="color: var(--text-primary);">
                  {{ getCategoryCompletedCount(category) }} / {{ category.items?.length || 0 }}
                </div>
                <div class="text-xs transition-colors duration-200" style="color: var(--text-muted);">complétés</div>
              </div>
              <button 
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style="background-color: var(--bg-border);"
                :class="{ 'rotate-180': isCategoryExpanded(category.id) }"
                :aria-expanded="isCategoryExpanded(category.id)"
                :aria-controls="`category-${category.id}`"
                :aria-label="`${isCategoryExpanded(category.id) ? 'Fermer' : 'Ouvrir'} la catégorie ${category.name}`"
              >
                <Icon 
                  name="heroicons:chevron-down" 
                  class="w-4 h-4 transition-colors duration-200"
                  style="color: var(--text-primary);"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Category Items -->
        <div 
          v-if="category.items" 
          :id="`category-${category.id}`"
          class="border-t transition-all duration-300 ease-in-out overflow-hidden"
          style="border-color: var(--bg-border);"
          :class="{ 'max-h-0': !isCategoryExpanded(category.id) }"
          role="region"
          :aria-label="`Éléments de la catégorie ${category.name}`"
        >
          <div class="p-6 space-y-4">
            <ItemAccordion
              v-for="item in category.items" 
              :key="item.id"
              :item="item"
              :is-item-checked="isItemChecked(item.id)"
              @toggle-item="toggleItem"
            />
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="p-6 text-center" role="status" aria-live="polite">
          <p class="transition-colors duration-200" style="color: var(--text-muted);">Chargement des critères...</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center">
      <p class="text-sm mb-2 transition-colors duration-200" style="color: var(--text-muted);">
        Vos progrès sont automatiquement sauvegardés dans votre navigateur
      </p>
      <p class="text-xs transition-colors duration-200" style="color: var(--text-muted); opacity: 0.7;">
        Checklist complète pour un déploiement réussi : SEO, accessibilité, performance et sécurité
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ItemAccordion from './ItemAccordion.vue'

const emit = defineEmits(['categories-loaded'])

// État réactif
const categories = ref([])
const checkedItems = ref(new Set())
const expandedCategories = ref(new Set())

// Computed properties
const totalCount = computed(() => {
  return categories.value.reduce((total, category) => {
    return total + (category.items?.length || 0)
  }, 0)
})

const completedCount = computed(() => {
  return checkedItems.value.size
})

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return (completedCount.value / totalCount.value) * 100
})

// Méthodes
const loadCategories = async () => {
  try {
    // Charger le fichier principal de checklist
    const response = await fetch('/data/seo-checklist.json')
    if (response.ok) {
      const checklistData = await response.json()
      categories.value = checklistData.categories
      
              // Charger les items pour chaque catégorie
        for (const category of categories.value) {
          if (category.dataFile) {
            try {
              const itemsResponse = await fetch(`/data/${category.dataFile}`)
              if (itemsResponse.ok) {
                const itemsData = await itemsResponse.json()
                category.items = itemsData.items
              } else {
                console.error(`Erreur lors du chargement de ${category.dataFile}`)
                category.items = []
              }
            } catch (error) {
              console.error(`Erreur lors du chargement de ${category.dataFile}:`, error)
              category.items = []
            }
          }
          
          // Ajouter les propriétés nécessaires pour le sommaire
          category.icon = getCategoryIcon(category.id)
        }
    } else {
      console.error('Erreur lors du chargement du fichier principal')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const loadCheckedItems = () => {
  if (process.client) {
    const saved = localStorage.getItem('seo-checklist-progress')
    if (saved) {
      checkedItems.value = new Set(JSON.parse(saved))
    }
  }
}

const saveCheckedItems = () => {
  if (process.client) {
    localStorage.setItem('seo-checklist-progress', JSON.stringify([...checkedItems.value]))
  }
}

const isItemChecked = (itemId) => {
  return checkedItems.value.has(itemId)
}

const toggleItem = (itemId) => {
  if (checkedItems.value.has(itemId)) {
    checkedItems.value.delete(itemId)
  } else {
    checkedItems.value.add(itemId)
  }
  saveCheckedItems()
}

const getCategoryCompletedCount = (category) => {
  if (!category.items) return 0
  return category.items.filter(item => checkedItems.value.has(item.id)).length
}

const getCategoryIcon = (categoryId) => {
  const icons = {
    'seo': 'fluent-emoji:magnifying-glass-tilted-left',
    'accessibilite': 'fluent-emoji:wheelchair-symbol',
    'performance': 'fluent-emoji:high-voltage',
    'eco-conception': 'fluent-emoji:seedling',
    'responsive-ux': 'fluent-emoji:mobile-phone',
    'securite': 'fluent-emoji:locked',
    'analytics': 'fluent-emoji:bar-chart'
  }
  return icons[categoryId] || 'fluent-emoji:clipboard'
}

const isCategoryExpanded = (categoryId) => {
  return expandedCategories.value.has(categoryId)
}

const toggleCategory = (categoryId) => {
  if (expandedCategories.value.has(categoryId)) {
    // Fermer la catégorie si elle est déjà ouverte
    expandedCategories.value.delete(categoryId)
    
    // Fermer tous les accordéons des items de cette catégorie
    const category = categories.value.find(cat => cat.id === categoryId)
    if (category && category.items) {
      category.items.forEach(item => {
        // Émettre un événement pour fermer l'accordéon de l'item
        window.dispatchEvent(new CustomEvent('close-item-accordion', { 
          detail: { itemId: item.id } 
        }))
      })
    }
  } else {
    // Fermer toutes les autres catégories et ouvrir celle-ci
    expandedCategories.value.clear()
    expandedCategories.value.add(categoryId)
  }
}

// Méthodes exposées
const openCategory = (categoryId) => {
  // Fermer toutes les autres catégories et ouvrir celle-ci
  expandedCategories.value.clear()
  expandedCategories.value.add(categoryId)
}

// Lifecycle
onMounted(async () => {
  loadCheckedItems()
  await loadCategories()
  
  // Ouvrir la première catégorie (SEO) par défaut
  if (categories.value.length > 0) {
    expandedCategories.value.add(categories.value[0].id)
  }
})

// Émettre les catégories quand elles sont chargées
watch(categories, (newCategories) => {
  if (newCategories.length > 0) {
    emit('categories-loaded', newCategories)
  }
}, { immediate: true })

// Exposer les méthodes
defineExpose({
  resetProgress: () => {
    checkedItems.value.clear()
    saveCheckedItems()
    expandedCategories.value.clear()
  },
  openCategory
})
</script> 