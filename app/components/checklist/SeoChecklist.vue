<template>
  <div class="max-w-4xl mx-auto px-4 lg:px-6 py-8" style="min-height: calc(100vh + 200px);">
    <!-- Header -->
    <ChecklistHeader />
    
    <!-- Stats Cards -->
    <StatsCards 
      :is-loading="isLoading"
      :completed-count="completedCount"
      :total-count="totalCount"
      :progress-percentage="progressPercentage"
    />

    <!-- Progress Bar -->
    <div class="mb-8 progress-section">
      <div class="w-full rounded-full h-2 transition-colors duration-200 max-w-full overflow-hidden" style="background-color: var(--bg-border);">
        <div 
          class="h-2 rounded-full transition-all duration-500 ease-out"
          style="background-color: var(--accent-primary);"
          :style="{ width: Math.min(progressPercentage, 100) + '%' }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-6" role="region" aria-label="Catégories de la checklist">
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
            class="p-6 cursor-pointer transition-all duration-300 hover:bg-opacity-80 relative overflow-hidden"
            :class="{ 
              'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30 rounded-t-xl': isCategoryCompleted(category) && isCategoryExpanded(category.id),
              'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30 rounded-xl': isCategoryCompleted(category) && !isCategoryExpanded(category.id),
              'hover:bg-opacity-80 rounded-t-xl': !isCategoryCompleted(category) && isCategoryExpanded(category.id),
              'hover:bg-opacity-80 rounded-xl': !isCategoryCompleted(category) && !isCategoryExpanded(category.id)
            }"
            @click="toggleCategory(category.id)"
            @keydown.enter="toggleCategory(category.id)"
            @keydown.space.prevent="toggleCategory(category.id)"
            role="button"
            :aria-expanded="isCategoryExpanded(category.id)"
            :aria-controls="`category-${category.id}`"
            :aria-label="`${isCategoryExpanded(category.id) ? $t('common.closeCategory', { name: category.name }) : $t('common.openCategory', { name: category.name })}`"
            tabindex="0"
          >
            <div class="flex items-center justify-between relative z-10">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon 
                    :name="getCategoryIcon(category.id)" 
                    class="w-8 h-8 transition-colors duration-200" 
                    :class="{ 'text-white drop-shadow-sm': isCategoryCompleted(category) }"
                    :style="{ color: isCategoryCompleted(category) ? 'white' : 'var(--accent-primary)' }" 
                    aria-hidden="true" 
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-xl font-semibold leading-tight transition-colors duration-200 mb-1" :class="{ 'text-white': isCategoryCompleted(category) }" :style="{ color: isCategoryCompleted(category) ? 'white' : 'var(--text-primary)' }">
                    {{ category.name }}
                  </h2>
                  <p class="text-sm transition-colors duration-200" :class="{ 'text-green-100': isCategoryCompleted(category) }" :style="{ color: isCategoryCompleted(category) ? '#dcfce7' : 'var(--text-secondary)' }">
                    {{ category.description }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <div class="text-sm font-medium transition-colors duration-200" :class="{ 'text-white': isCategoryCompleted(category) }" :style="{ color: isCategoryCompleted(category) ? 'white' : 'var(--text-primary)' }">
                    {{ getCategoryCompletedCount(category) }} / {{ category.items?.length || 0 }}
                  </div>
                  <div class="text-xs transition-colors duration-200" :class="{ 'text-green-100': isCategoryCompleted(category) }" :style="{ color: isCategoryCompleted(category) ? '#dcfce7' : 'var(--text-muted)' }">{{ $t('app.progress.completed') }}</div>
                </div>
                <button 
                  class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-opacity-80"
                  :class="{ 
                    'rotate-180': isCategoryExpanded(category.id) && !isCategoryCompleted(category),
                    'bg-white/20 hover:bg-white/30': isCategoryCompleted(category)
                  }"
                  :aria-expanded="isCategoryExpanded(category.id)"
                  :aria-label="`${isCategoryExpanded(category.id) ? $t('common.closeCategory', { name: category.name }) : $t('common.openCategory', { name: category.name })}`"
                  aria-hidden="true"
                >
                  <Icon 
                    v-if="isCategoryCompleted(category)"
                    name="heroicons:check-circle" 
                    class="w-6 h-6 transition-colors duration-200 text-white"
                    aria-hidden="true"
                  />
                  <Icon 
                    v-else
                    name="heroicons:chevron-down" 
                    class="w-5 h-5 transition-colors duration-200"
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
            class="border-t transition-all duration-500 ease-out overflow-hidden"
            style="border-color: var(--bg-border); background-color: var(--bg-primary);"
            :class="{ 
              'max-h-0 opacity-0 transform -translate-y-2': !isCategoryExpanded(category.id), 
              'max-h-[10000px] opacity-100 transform translate-y-0': isCategoryExpanded(category.id) 
            }"
            role="region"
            :aria-label="`Contenu de la catégorie ${category.name}`"
          >
            <div class="p-6 space-y-4">
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
                  @accordion-opened="handleAccordionOpened"
                  @accordion-closed="handleAccordionClosed"
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
import ChecklistHeader from './ChecklistHeader.vue'
import StatsCards from './StatsCards.vue'
import SkeletonCard from '../common/SkeletonCard.vue'
import SkeletonCategory from '../common/SkeletonCategory.vue'
import SkeletonItem from '../common/SkeletonItem.vue'
import { useI18n } from 'vue-i18n'
import { useProjectsStore } from '~/stores/projects'
import { useChecklistData } from '~/composables/useChecklistData'

const emit = defineEmits(['categories-loaded'])
const { locale } = useI18n()
const projectsStore = useProjectsStore()
const { getCategoryItems, getAllCategories, getCategoryData } = useChecklistData()

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
const expandedItems = ref(new Set()) // Nouveau: pour tracker les items ouverts
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
    
    // Utiliser le nouveau système de données
    const categoryIds = getAllCategories()
    
    categories.value = categoryIds.map(categoryId => {
      const categoryData = getCategoryData(categoryId)
      const categoryName = $t(`categories.${categoryId}.name`)
      const categoryDescription = $t(`categories.${categoryId}.description`)
      
      return {
        id: categoryId,
        name: categoryName,
        description: categoryDescription,
        items: categoryData.items,
        icon: getCategoryIcon(categoryId),
        isLoading: false
      }
    })
    
    // Émettre l'événement avec les catégories chargées
    emit('categories-loaded', categories.value)
  } catch (error) {
    console.error('Erreur lors du chargement de la checklist:', error)
    categories.value = []
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
      
      // Sauvegarder les changements
      saveCheckedItems()
      
      // Émettre un événement de mise à jour de la progression
      window.dispatchEvent(new CustomEvent('progress-updated', {
        detail: { percentage: 0 }
      }))
      
      console.log('Progrès réinitialisé avec succès')
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du progrès:', error)
  }
}

// Nouvelle fonction pour vérifier si un item était ouvert avant d'être coché
const checkIfItemWasExpanded = (itemId) => {
  return expandedItems.value.has(itemId)
}

// Fonction pour marquer un item comme ouvert
const markItemAsExpanded = (itemId) => {
  expandedItems.value.add(itemId)
}

// Fonction pour marquer un item comme fermé
const markItemAsCollapsed = (itemId) => {
  expandedItems.value.delete(itemId)
}

// Gestionnaires d'événements pour les accordéons
const handleAccordionOpened = (itemId) => {
  markItemAsExpanded(itemId)
}

const handleAccordionClosed = (itemId) => {
  markItemAsCollapsed(itemId)
}

const toggleItem = (itemId) => {
  const wasChecked = checkedItems.value.has(itemId)
  
  if (wasChecked) {
    checkedItems.value.delete(itemId)
  } else {
    checkedItems.value.add(itemId)
  }
  
  saveCheckedItems()
  
  // Vérifier si une catégorie vient d'être complétée
  const category = categories.value.find(cat => cat.items?.some(item => item.id === itemId))
  if (category) {
    if (!wasChecked && isCategoryCompleted(category)) {
      // La catégorie vient d'être complétée, déclencher l'effet d'explosion
      nextTick(() => {
        generateCategoryExplosion(category.id)
      })
      
      // Fermer directement l'accordéon de la catégorie quand elle est complétée
      expandedCategories.value.delete(category.id)
    } else if (wasChecked && !isCategoryCompleted(category)) {
      // Un item a été décoché, rouvrir l'accordéon de la catégorie
      expandedCategories.value.add(category.id)
    } else if (!wasChecked) {
      // Un item vient d'être coché, vérifier si l'accordéon était ouvert avant
      const currentItemIndex = category.items.findIndex(item => item.id === itemId)
      if (currentItemIndex !== -1 && currentItemIndex < category.items.length - 1) {
        const nextItem = category.items[currentItemIndex + 1]
        
        // Vérifier si l'accordéon de l'item actuel était ouvert avant d'être coché
        const wasCurrentItemExpanded = checkIfItemWasExpanded(itemId)
        
        // Ouvrir l'élément suivant seulement si :
        // 1. L'élément actuel était ouvert avant d'être coché
        // 2. L'élément suivant existe et n'est pas déjà coché
        if (wasCurrentItemExpanded && nextItem && !isItemChecked(nextItem.id)) {
          // Ouvrir l'accordéon de la catégorie si elle n'est pas déjà ouverte
          if (!expandedCategories.value.has(category.id)) {
            expandedCategories.value.add(category.id)
          }
          
          // Ouvrir l'accordéon du prochain élément et le marquer comme ouvert
          nextTick(() => {
            if (process.client) {
              // Marquer l'élément suivant comme ouvert dans notre système de tracking
              markItemAsExpanded(nextItem.id)
              
              // Ouvrir l'accordéon du prochain élément
              window.dispatchEvent(new CustomEvent('open-item-accordion', { 
                detail: { itemId: nextItem.id } 
              }))
            }
          })
        }
      }
    }
  }
}

const isItemChecked = (itemId) => {
  return checkedItems.value.has(itemId)
}

const isCategoryCompleted = (category) => {
  if (!category.items || category.items.length === 0) return false
  return category.items.every(item => isItemChecked(item.id))
}

const showCategoryExplosion = ref(null)
const categoryParticles = computed(() => {
  const particles = []
  for (let i = 0; i < 12; i++) {
    particles.push({
      id: i,
      angle: (i / 12) * 360,
      delay: i * 40,
      distance: 80 + Math.random() * 40
    })
  }
  return particles
})

const generateCategoryExplosion = (categoryId) => {
  showCategoryExplosion.value = categoryId
  // L'effet sera automatiquement nettoyé par l'événement animationend
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

    if (isCategoryCompleted(categories.value.find(cat => cat.id === categoryId))) {
      generateCategoryExplosion(categoryId)
    }
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
  
  // Écouter l'événement open-category depuis le sommaire
  if (process.client) {
    window.addEventListener('open-category', (event) => {
      if (event.detail && event.detail.categoryId) {
        openCategory(event.detail.categoryId)
      }
    })
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('open-category', (event) => {
      if (event.detail && event.detail.categoryId) {
        openCategory(event.detail.categoryId)
      }
    })
  }
})

// Exposer les méthodes
defineExpose({
  openCategory,
  resetProgress
})
</script>

<style scoped>
@keyframes category-explosion {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(
      calc(-50% + cos(var(--explosion-angle)) * var(--explosion-distance)),
      calc(-50% + sin(var(--explosion-angle)) * var(--explosion-distance))
    ) scale(0);
  }
}

.animate-category-explosion {
  animation: category-explosion 1s ease-out forwards;
  animation-delay: var(--explosion-delay);
}

/* Support pour les navigateurs qui ne supportent pas les variables CSS dans les animations */
@supports not (animation-delay: var(--explosion-delay)) {
  .animate-category-explosion:nth-child(1) { animation-delay: 0ms; }
  .animate-category-explosion:nth-child(2) { animation-delay: 40ms; }
  .animate-category-explosion:nth-child(3) { animation-delay: 80ms; }
  .animate-category-explosion:nth-child(4) { animation-delay: 120ms; }
  .animate-category-explosion:nth-child(5) { animation-delay: 160ms; }
  .animate-category-explosion:nth-child(6) { animation-delay: 200ms; }
  .animate-category-explosion:nth-child(7) { animation-delay: 240ms; }
  .animate-category-explosion:nth-child(8) { animation-delay: 280ms; }
  .animate-category-explosion:nth-child(9) { animation-delay: 320ms; }
  .animate-category-explosion:nth-child(10) { animation-delay: 360ms; }
  .animate-category-explosion:nth-child(11) { animation-delay: 400ms; }
  .animate-category-explosion:nth-child(12) { animation-delay: 440ms; }
}
</style> 