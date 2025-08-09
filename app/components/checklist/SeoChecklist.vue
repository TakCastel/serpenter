<template>
  <div class="w-full" style="min-height: calc(100vh + 200px);">
    <!-- Carte de félicitations quand toutes les catégories sont complétées -->
    <DeploymentReadyCard 
      v-if="allCategoriesCompleted && !isLoading"
      :total-items="totalCount"
      :total-categories="totalCategoriesCount"
      @deploy-click="handleDeployClick"
    />
    
    <!-- En-tête, stats et barre de progression supprimés pour n'afficher que les accordéons -->

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
            class="p-4 md:p-5 cursor-pointer transition-all duration-300 hover:bg-opacity-80 relative overflow-hidden"
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
            <div class="p-4 md:p-5 space-y-4">
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
// Imports supprimés: ChecklistHeader, StatsCards
import DeploymentReadyCard from './DeploymentReadyCard.vue'
import SkeletonCategory from '../common/SkeletonCategory.vue'
import SkeletonItem from '../common/SkeletonItem.vue'
import { useI18n } from 'vue-i18n'
import { useProjectsStore } from '~/stores/projects'
import { useChecklistData } from '~/composables/useChecklistData'

const emit = defineEmits(['categories-loaded'])
const { locale } = useI18n()
const projectsStore = useProjectsStore()
const { getCategoryItems, getAllCategories, getCategoryData } = useChecklistData()
const { currentUser } = useAuth()

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

// Computed pour vérifier si toutes les catégories sont complétées
const allCategoriesCompleted = computed(() => {
  return categories.value.length > 0 && categories.value.every(category => isCategoryCompleted(category))
})

// Computed pour le nombre total de catégories
const totalCategoriesCount = computed(() => {
  return categories.value.length
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

// Fonction pour gérer le clic sur le bouton de déploiement
const handleDeployClick = () => {
  console.log('🚀 Déploiement en cours...')
  if (process.client && window.dataLayer) {
    window.dataLayer.push({
      event: 'deployment_ready',
      category: 'checklist',
      action: 'deploy_click',
      label: 'all_categories_completed'
    })
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

// Chargement depuis Firestore via le store
const loadCheckedItems = async () => {
  try {
    if (!currentUser.value || !props.currentProjectId) {
      checkedItems.value = new Set()
      return
    }
    await projectsStore.loadProjectChecked(currentUser.value.uid, props.currentProjectId)
    checkedItems.value = projectsStore.getCheckedSet(props.currentProjectId)
  } catch (error) {
    console.error('Erreur lors du chargement du progrès:', error)
    checkedItems.value = new Set()
  }
}

const resetCheckedItems = async () => {
  checkedItems.value.clear()
  if (currentUser.value && props.currentProjectId) {
    projectsStore.setCheckedForProject(props.currentProjectId, checkedItems.value)
    await projectsStore.saveProjectChecked(currentUser.value.uid, props.currentProjectId)
  }
}

const saveCheckedItems = async () => {
  try {
    if (!currentUser.value || !props.currentProjectId) return
    projectsStore.setCheckedForProject(props.currentProjectId, checkedItems.value)
    await projectsStore.saveProjectChecked(currentUser.value.uid, props.currentProjectId)
    
    // Mettre à jour les scores dans le store
    const allItems = []
    categories.value.forEach(category => {
      if (category.items) allItems.push(...category.items)
    })
    projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du progrès:', error)
  }
}

// Nouvelle fonction pour vérifier si un item était ouvert avant d'être coché
const checkIfItemWasExpanded = (itemId) => expandedItems.value.has(itemId)
const markItemAsExpanded = (itemId) => { expandedItems.value.add(itemId) }
const markItemAsCollapsed = (itemId) => { expandedItems.value.delete(itemId) }

// Gestionnaires d'événements pour les accordéons
const handleAccordionOpened = (itemId) => { markItemAsExpanded(itemId) }
const handleAccordionClosed = (itemId) => { markItemAsCollapsed(itemId) }

const toggleItem = async (itemId) => {
  const wasChecked = checkedItems.value.has(itemId)
  if (wasChecked) checkedItems.value.delete(itemId)
  else checkedItems.value.add(itemId)
  
  await saveCheckedItems()
  
  const category = categories.value.find(cat => cat.items?.some(item => item.id === itemId))
  if (category) {
    if (!wasChecked && isCategoryCompleted(category)) {
      nextTick(() => { generateCategoryExplosion(category.id) })
      expandedCategories.value.delete(category.id)
    } else if (wasChecked && !isCategoryCompleted(category)) {
      expandedCategories.value.add(category.id)
    } else if (!wasChecked) {
      const currentItemIndex = category.items.findIndex(item => item.id === itemId)
      if (currentItemIndex !== -1 && currentItemIndex < category.items.length - 1) {
        const nextItem = category.items[currentItemIndex + 1]
        const wasCurrentItemExpanded = checkIfItemWasExpanded(itemId)
        if (wasCurrentItemExpanded && nextItem && !isItemChecked(nextItem.id)) {
          if (!expandedCategories.value.has(category.id)) {
            expandedCategories.value.add(category.id)
          }
          nextTick(() => {
            if (process.client) {
              markItemAsExpanded(nextItem.id)
              window.dispatchEvent(new CustomEvent('open-item-accordion', { detail: { itemId: nextItem.id } }))
            }
          })
        }
      }
    }
  }
}

const isItemChecked = (itemId) => checkedItems.value.has(itemId)

const isCategoryCompleted = (category) => {
  if (!category.items || category.items.length === 0) return false
  return category.items.every(item => isItemChecked(item.id))
}

const showCategoryExplosion = ref(null)
const categoryParticles = computed(() => {
  const particles = []
  for (let i = 0; i < 12; i++) {
    particles.push({ id: i, angle: (i / 12) * 360, delay: i * 40, distance: 80 + Math.random() * 40 })
  }
  return particles
})

const generateCategoryExplosion = (categoryId) => { showCategoryExplosion.value = categoryId }
const isCategoryExpanded = (categoryId) => expandedCategories.value.has(categoryId)
const getCategoryCompletedCount = (category) => (category.items ? category.items.filter(item => isItemChecked(item.id)).length : 0)

const toggleCategory = (categoryId) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
    const category = categories.value.find(cat => cat.id === categoryId)
    if (category && category.items && process.client) {
      category.items.forEach(item => { window.dispatchEvent(new CustomEvent('close-item-accordion', { detail: { itemId: item.id } })) })
    }
  } else {
    if (process.client) {
      categories.value.forEach(category => {
        if (category.items) {
          category.items.forEach(item => { window.dispatchEvent(new CustomEvent('close-item-accordion', { detail: { itemId: item.id } })) })
        }
      })
    }
    expandedCategories.value.clear()
    expandedCategories.value.add(categoryId)
    if (isCategoryCompleted(categories.value.find(cat => cat.id === categoryId))) {
      generateCategoryExplosion(categoryId)
    }
  }
}

// Méthodes exposées
const openCategory = (categoryId) => {
  if (process.client) {
    categories.value.forEach(category => {
      if (category.items) {
        category.items.forEach(item => { window.dispatchEvent(new CustomEvent('close-item-accordion', { detail: { itemId: item.id } })) })
      }
    })
  }
  expandedCategories.value.clear()
  expandedCategories.value.add(categoryId)
}

// Émettre la progression
watch(progressPercentage, (newPercentage) => {
  if (process.client) {
    window.dispatchEvent(new CustomEvent('progress-updated', { detail: { percentage: Math.round(newPercentage) } }))
  }
}, { immediate: true })

// Recharger la checklist quand la langue change
watch(locale, async () => { await loadCategories() }, { immediate: false })

// Changement de projet → charger les checked depuis la BDD et recalculer les scores
watch(() => props.currentProjectId, async () => {
  await loadCheckedItems()
  nextTick(() => {
    const allItems = []
    categories.value.forEach(category => { if (category.items) allItems.push(...category.items) })
    projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
  })
}, { immediate: false })

// Lifecycle
onMounted(async () => {
  await loadCheckedItems()
  await loadCategories()
  if (categories.value.length > 0) {
    expandedCategories.value.add(categories.value[0].id)
  }
  if (process.client) {
    window.addEventListener('open-category', (event) => {
      if (event.detail && event.detail.categoryId) openCategory(event.detail.categoryId)
    })
    // Réception des mises à jour auto-check depuis l'audit Lighthouse
    window.addEventListener('checked-items-updated', async (event) => {
      try {
        if (!currentUser.value || !props.currentProjectId) return
        // Recharger l'état depuis Firestore via le store
        await projectsStore.loadProjectChecked(currentUser.value.uid, props.currentProjectId)
        checkedItems.value = projectsStore.getCheckedSet(props.currentProjectId)
        // Recalcule des scores
        const allItems = []
        categories.value.forEach(category => { if (category.items) allItems.push(...category.items) })
        projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
      } catch (e) {
        // noop
      }
    })
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('open-category', (event) => {
      if (event.detail && event.detail.categoryId) openCategory(event.detail.categoryId)
    })
    window.removeEventListener('checked-items-updated', () => {})
  }
})

// Exposer les méthodes
const resetProgress = async () => {
  // Clear local set
  checkedItems.value = new Set()
  // Sauvegarder en BDD si possible
  if (currentUser.value && props.currentProjectId) {
    projectsStore.setCheckedForProject(props.currentProjectId, checkedItems.value)
    await projectsStore.saveProjectChecked(currentUser.value.uid, props.currentProjectId)
  }
  // Mettre à jour scores
  const allItems = []
  categories.value.forEach(category => { if (category.items) allItems.push(...category.items) })
  projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
  // Événement progression
  if (process.client) {
    window.dispatchEvent(new CustomEvent('progress-updated', { detail: { percentage: 0 } }))
  }
}

defineExpose({ openCategory, resetProgress })
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