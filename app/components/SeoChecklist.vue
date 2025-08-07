<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style="min-height: calc(100vh + 200px);">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-6 transition-colors duration-200" style="color: var(--text-primary);">
        {{ $t('app.hero.title') }}
      </h1>
      <p class="text-xl transition-colors duration-200 mb-8" style="color: var(--text-secondary);">
        {{ $t('app.hero.description') }}
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
                {{ $t('app.progress.completedCount', { count: totalCount }) }}
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
                {{ $t('app.progress.percentage') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8 progress-section">
      <div class="w-full bg-gray-200 rounded-full h-2 transition-colors duration-200" style="background-color: var(--bg-border);">
        <div 
          class="h-2 rounded-full transition-all duration-300 ease-out"
          style="background-color: var(--accent-primary);"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-8" role="region" aria-label="Catégories de la checklist">
      <template v-for="(category, index) in categories" :key="category.id">
        <div 
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
          :aria-label="`${isCategoryExpanded(category.id) ? $t('common.closeCategory', { name: category.name }) : $t('common.openCategory', { name: category.name })}`"
          tabindex="0"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <Icon :name="getCategoryIcon(category.id)" class="w-8 h-8 transition-colors duration-200" style="color: var(--accent-primary);" aria-hidden="true" />
              </div>
              <div>
                <h2 class="text-xl font-semibold transition-colors duration-200" style="color: var(--text-primary);">{{ $t(`categories.${category.id}.name`) }}</h2>
                <p class="text-sm transition-colors duration-200" style="color: var(--text-secondary);">{{ $t(`categories.${category.id}.description`) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
                      <div class="text-right">
          <div class="text-sm font-medium transition-colors duration-200" style="color: var(--text-primary);">
            {{ getCategoryCompletedCount(category) }} / {{ category.items?.length || 0 }}
          </div>
          <div class="text-xs transition-colors duration-200" style="color: var(--text-muted);">{{ $t('app.progress.completed') }}</div>
        </div>
              <button 
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style="background-color: var(--bg-border);"
                :class="{ 'rotate-180': isCategoryExpanded(category.id) }"
                :aria-expanded="isCategoryExpanded(category.id)"
                :aria-controls="`category-${category.id}`"
                :aria-label="`${isCategoryExpanded(category.id) ? $t('common.closeCategory', { name: category.name }) : $t('common.openCategory', { name: category.name })}`"
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
          :aria-label="$t('common.categoryItems', { name: category.name })"
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
          <p class="transition-colors duration-200" style="color: var(--text-muted);">{{ $t('common.loading') }}</p>
        </div>
      </div>
      </template>
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
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['categories-loaded'])
const { locale } = useI18n()

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
                // Charger le fichier traduit selon la langue
                const translatedFileName = category.dataFile.replace('.json', `-${locale.value}.json`)
                const itemsResponse = await fetch(`/data/i18n/${translatedFileName}`)
                
                if (itemsResponse.ok) {
                  const itemsData = await itemsResponse.json()
                  category.items = itemsData.items
                } else {
                  console.error(`Erreur lors du chargement de ${translatedFileName}`)
                  category.items = []
                }
              } catch (error) {
                console.error(`Erreur lors du chargement de ${category.dataFile}:`, error)
                category.items = []
              }
            }
        
        // Assigner l'icône à la catégorie
        category.icon = getCategoryIcon(category.id)
      }
      
      // Émettre l'événement avec les catégories chargées
      emit('categories-loaded', categories.value)
    } else {
      console.error('Erreur lors du chargement de la checklist')
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la checklist:', error)
  }
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

const loadCheckedItems = () => {
  try {
    if (process.client) {
      const saved = localStorage.getItem('checklist-progress')
      if (saved) {
        const parsed = JSON.parse(saved)
        checkedItems.value = new Set(parsed.checkedItems || [])
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du progrès:', error)
  }
}

const saveCheckedItems = () => {
  try {
    if (process.client) {
      const data = {
        checkedItems: Array.from(checkedItems.value),
        timestamp: Date.now()
      }
      localStorage.setItem('checklist-progress', JSON.stringify(data))
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du progrès:', error)
  }
}

const resetProgress = () => {
  try {
    if (process.client) {
      checkedItems.value.clear()
      localStorage.removeItem('checklist-progress')
      console.log('Progrès réinitialisé avec succès')
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du progrès:', error)
  }
}

const toggleItem = (itemId) => {
  if (checkedItems.value.has(itemId)) {
    checkedItems.value.delete(itemId)
  } else {
    checkedItems.value.add(itemId)
  }
  saveCheckedItems()
}

const isItemChecked = (itemId) => {
  return checkedItems.value.has(itemId)
}

const isCategoryExpanded = (categoryId) => {
  return expandedCategories.value.has(categoryId)
}

const getCategoryCompletedCount = (category) => {
  if (!category.items) return 0
  return category.items.filter(item => isItemChecked(item.id)).length
}

const toggleCategory = (categoryId) => {
  if (expandedCategories.value.has(categoryId)) {
    // Fermer la catégorie si elle est déjà ouverte
    expandedCategories.value.delete(categoryId)
    
    // Fermer tous les accordéons des items de cette catégorie
    const category = categories.value.find(cat => cat.id === categoryId)
    if (category && category.items && process.client) {
      category.items.forEach(item => {
        // Émettre un événement pour fermer l'accordéon de l'item
        window.dispatchEvent(new CustomEvent('close-item-accordion', { 
          detail: { itemId: item.id } 
        }))
      })
    }
  } else {
    // Fermer tous les accordéons des items de toutes les catégories
    if (process.client) {
      categories.value.forEach(category => {
        if (category.items) {
          category.items.forEach(item => {
            window.dispatchEvent(new CustomEvent('close-item-accordion', { 
              detail: { itemId: item.id } 
            }))
          })
        }
      })
    }
    
    // Fermer toutes les autres catégories et ouvrir celle-ci
    expandedCategories.value.clear()
    expandedCategories.value.add(categoryId)
  }
}

// Méthodes exposées
const openCategory = (categoryId) => {
  // Fermer tous les accordéons des items de toutes les catégories
  if (process.client) {
    categories.value.forEach(category => {
      if (category.items) {
        category.items.forEach(item => {
          window.dispatchEvent(new CustomEvent('close-item-accordion', { 
            detail: { itemId: item.id } 
          }))
        })
      }
    })
  }
  
  // Fermer toutes les autres catégories et ouvrir celle-ci
  expandedCategories.value.clear()
  expandedCategories.value.add(categoryId)
}

// Watcher pour émettre les événements de progression
watch(progressPercentage, (newPercentage) => {
  if (process.client) {
    window.dispatchEvent(new CustomEvent('progress-updated', {
      detail: { percentage: Math.round(newPercentage) }
    }))
  }
}, { immediate: true })

// Watcher pour recharger les données quand la langue change
watch(locale, async () => {
  await loadCategories()
}, { immediate: false })

// Lifecycle
onMounted(async () => {
  loadCheckedItems()
  await loadCategories()
  
  // Ouvrir la première catégorie par défaut
  if (categories.value.length > 0) {
    expandedCategories.value.add(categories.value[0].id)
  }
})

// Exposer les méthodes
defineExpose({
  openCategory,
  resetProgress
})
</script> 