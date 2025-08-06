<template>
  <div class="container seo-checklist">
    <!-- Header -->
    <div class="header">
      <p class="subtitle">Optimisez votre site pour les moteurs de recherche et l'accessibilité</p>
      <div class="stats">
        <div class="stat-box">
          <span class="stat-number">{{ completedCount }}</span>
          <span class="stat-text"> / {{ totalCount }} complétés</span>
        </div>
        <div class="stat-box">
          <span class="stat-number">{{ Math.round(progressPercentage) }}%</span>
          <span class="stat-text"> terminé</span>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="categories">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category"
      >
        <!-- Category Header -->
        <div class="category-header" @click="toggleCategory(category.id)">
          <div class="category-info">
            <div class="category-icon">
              <Icon :name="getCategoryIcon(category.id)" size="1.5rem" />
            </div>
            <div>
              <h2 class="category-title">{{ category.name }}</h2>
              <p class="category-description">{{ category.description }}</p>
            </div>
          </div>
          <div class="category-actions">
            <div class="category-stats">
              <div class="category-count">
                {{ getCategoryCompletedCount(category) }} / {{ category.items?.length || 0 }}
              </div>
              <div class="category-label">complétés</div>
            </div>
            <button 
              class="category-toggle"
              :class="{ 'expanded': isCategoryExpanded(category.id) }"
              :aria-expanded="isCategoryExpanded(category.id)"
              :aria-controls="`category-${category.id}`"
            >
              <span class="toggle-icon">{{ isCategoryExpanded(category.id) ? '−' : '+' }}</span>
            </button>
          </div>
        </div>

        <!-- Category Items -->
        <div 
          v-if="category.items" 
          :id="`category-${category.id}`"
          class="category-content"
          :class="{ 'expanded': isCategoryExpanded(category.id) }"
        >
          <div class="items">
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
        <div v-else class="loading-state">
          <p>Chargement des critères...</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">Vos progrès sont automatiquement sauvegardés dans votre navigateur</p>
      <p class="footer-note">Checklist mise à jour avec les meilleures pratiques SEO, accessibilité et éco-conception</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ItemAccordion from './ItemAccordion.vue'

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
    'performance': 'fluent-emoji:lightning-bolt',
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
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

// Lifecycle
onMounted(async () => {
  loadCheckedItems()
  await loadCategories()
})
</script> 