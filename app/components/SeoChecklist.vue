<template>
  <div class="max-w-5xl mx-auto px-6 lg:px-8 py-12" style="min-height: calc(100vh + 200px);">
    <!-- Header -->
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold mb-8 transition-colors duration-200 tracking-tight" style="color: var(--text-primary);">
        {{ $t('app.hero.title') }}
      </h1>
      <p class="text-xl transition-colors duration-200 mb-12 max-w-3xl mx-auto" style="color: var(--text-secondary);">
        {{ $t('app.hero.description') }}
      </p>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
        <!-- Skeleton pour les stats cards pendant le chargement -->
        <template v-if="isLoading">
          <SkeletonCard />
          <SkeletonCard />
        </template>
        
        <!-- Stats cards réelles -->
        <template v-else>
          <div class="card p-8">
            <div class="flex items-center justify-center space-x-4">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
                <Icon name="heroicons:check-circle" class="w-8 h-8" style="color: white;" />
              </div>
              <div class="text-left">
                <div class="text-4xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
                  {{ completedCount }}
                </div>
                <div class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
                  {{ $t('app.progress.completedCount', { count: totalCount }) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="card p-8">
            <div class="flex items-center justify-center space-x-4">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
                <Icon name="heroicons:chart-bar" class="w-8 h-8" style="color: white;" />
              </div>
              <div class="text-left">
                <div class="text-4xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
                  {{ Math.round(progressPercentage) }}%
                </div>
                <div class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
                  {{ $t('app.progress.percentage') }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-12 progress-section">
      <div class="w-full rounded-full h-3 transition-colors duration-200" style="background-color: var(--bg-border);">
        <div 
          class="h-3 rounded-full transition-all duration-500 ease-out"
          style="background-color: var(--accent-primary);"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-12" role="region" aria-label="Catégories de la checklist">
      <!-- Skeleton pour les catégories pendant le chargement -->
      <template v-if="isLoading">
        <SkeletonCategory v-for="i in 3" :key="`skeleton-category-${i}`" />
      </template>
      
      <!-- Catégories réelles -->
      <template v-else>
        <template v-for="(category, index) in categories" :key="category.id">
          <div 
            class="card"
            role="region"
            :aria-label="`Catégorie ${category.name}`"
          >
          <!-- Category Header -->
          <div 
            class="p-8 cursor-pointer transition-colors duration-200 hover:bg-opacity-80"
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
              <div class="flex items-center space-x-6">
                <div class="flex-shrink-0">
                  <Icon :name="getCategoryIcon(category.id)" class="w-10 h-10 transition-colors duration-200" style="color: var(--accent-primary);" aria-hidden="true" />
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-2xl font-semibold leading-tight transition-colors duration-200 mb-2" style="color: var(--text-primary);">
                    {{ category.name }}
                  </h2>
                  <p class="text-base transition-colors duration-200" style="color: var(--text-secondary);">
                    {{ category.description }}
                  </p>
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
                  class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-opacity-80"
                  :class="{ 'rotate-180': isCategoryExpanded(category.id) }"
                  :aria-expanded="isCategoryExpanded(category.id)"
                  :aria-label="`${isCategoryExpanded(category.id) ? $t('common.closeCategory', { name: category.name }) : $t('common.openCategory', { name: category.name })}`"
                  aria-hidden="true"
                >
                  <Icon 
                    name="heroicons:chevron-down" 
                    class="w-6 h-6 transition-colors duration-200"
                    style="color: var(--text-muted);"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Category Content -->
          <div 
            :id="`category-${category.id}`"
            class="border-t transition-all duration-500 ease-in-out overflow-hidden"
            style="border-color: var(--bg-border); background-color: var(--bg-primary);"
            :class="{ 'max-h-0': !isCategoryExpanded(category.id) }"
            role="region"
            :aria-label="`Contenu de la catégorie ${category.name}`"
          >
            <div class="p-8 space-y-6">
              <!-- Skeleton pour les items pendant le chargement -->
              <template v-if="category.isLoading">
                <SkeletonItem v-for="i in 3" :key="`skeleton-item-${i}`" />
              </template>
              
              <!-- Items réels -->
              <template v-else>
                <ItemAccordion 
                  v-for="item in category.items" 
                  :key="item.id" 
                  :item="item"
                  :is-item-checked="isItemChecked(item.id)"
                  @toggle-item="toggleItem"
                />
              </template>
            </div>
          </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import ItemAccordion from './ItemAccordion.vue'
import SkeletonCard from './SkeletonCard.vue'
import SkeletonCategory from './SkeletonCategory.vue'
import SkeletonItem from './SkeletonItem.vue' // Added SkeletonItem import
import { useI18n } from 'vue-i18n'
import { useProjectsStore } from '~/stores/projects'

const emit = defineEmits(['categories-loaded'])
const { locale } = useI18n()
const projectsStore = useProjectsStore()

// Props pour recevoir l'ID du projet actuel
const props = defineProps({
  currentProjectId: {
    type: String,
    default: 'default'
  }
})

// État réactif
const categories = ref([])
const checkedItems = ref(new Set())
const expandedCategories = ref(new Set())
const isLoading = ref(true)

// Computed properties
const totalCount = computed(() => {
  return categories.value.reduce((total, category) => {
    return total + (category.items?.length || 0)
  }, 0)
})

const completedCount = computed(() => {
  return projectsStore.getProjectScores(props.currentProjectId).completedItems
})

const progressPercentage = computed(() => {
  return projectsStore.getProjectScores(props.currentProjectId).percentage
})

// Méthodes
const loadCategories = async () => {
  try {
    isLoading.value = true
    
    // Charger les catégories via l'API
    const response = await $fetch('/api/categories')
    if (response && response.categories) {
      categories.value = response.categories
      
      // Charger les items pour chaque catégorie
      for (const category of categories.value) {
        if (category.dataFile) {
          try {
            // Extraire le nom de la catégorie du nom de fichier
            const categoryName = category.dataFile.replace('-items.json', '')
            const itemsResponse = await $fetch(`/api/items/${categoryName}?locale=${locale.value}`)
            
            if (itemsResponse && itemsResponse.items) {
              category.items = itemsResponse.items
            } else {
              console.error(`Erreur lors du chargement des items pour ${categoryName}`)
              category.items = []
            }
          } catch (error) {
            console.error(`Erreur lors du chargement des items pour ${category.dataFile}:`, error)
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
  } finally {
    isLoading.value = false
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
      const saved = localStorage.getItem(`checklist-progress-${props.currentProjectId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        checkedItems.value = new Set(parsed.checkedItems || [])
      } else {
        // Si aucun progrès sauvegardé pour ce projet, réinitialiser
        checkedItems.value.clear()
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du progrès:', error)
    checkedItems.value.clear()
  }
}

const resetCheckedItems = () => {
  checkedItems.value.clear()
}

const saveCheckedItems = () => {
  try {
    if (process.client) {
      const data = {
        checkedItems: Array.from(checkedItems.value),
        timestamp: Date.now()
      }
      localStorage.setItem(`checklist-progress-${props.currentProjectId}`, JSON.stringify(data))
      
      // Mettre à jour les scores dans le store
      const allItems = []
      categories.value.forEach(category => {
        if (category.items) {
          allItems.push(...category.items)
        }
      })
      projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du progrès:', error)
  }
}

const resetProgress = () => {
  try {
    if (process.client) {
      checkedItems.value.clear()
      localStorage.removeItem(`checklist-progress-${props.currentProjectId}`)
      projectsStore.resetProjectScores(props.currentProjectId)
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

// Watcher pour recharger les items cochés quand le projet change
watch(() => props.currentProjectId, () => {
  loadCheckedItems()
  // Recalculer les scores après le chargement
  nextTick(() => {
    const allItems = []
    categories.value.forEach(category => {
      if (category.items) {
        allItems.push(...category.items)
      }
    })
    projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
  })
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