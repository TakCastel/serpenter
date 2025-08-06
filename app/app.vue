<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader @reset-progress="handleResetProgress" />
    
    <!-- Layout principal avec sidebar -->
    <div class="pt-[85px] flex">
      <!-- Sidebar avec sommaire -->
      <aside 
        class="w-16 sm:w-64 flex-shrink-0 border-r transition-all duration-200" 
        style="border-color: var(--bg-border); background-color: var(--bg-surface);"
        role="navigation"
        aria-label="Navigation des vérifications"
      >
        <div class="sticky top-24 p-4">
          <h3 class="text-sm font-semibold mb-4 transition-colors duration-200 hidden sm:block" style="color: var(--text-primary);">
            Vérifications
          </h3>
          <nav class="space-y-2" role="navigation" aria-label="Vérifications de pré-déploiement">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="scrollToCategory(category.id)"
              @keydown.enter="scrollToCategory(category.id)"
              @keydown.space.prevent="scrollToCategory(category.id)"
              class="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3"

              :style="{
                backgroundColor: activeCategory === category.id ? 'var(--bg-border)' : 'transparent',
                color: 'var(--text-primary)',
                borderColor: 'transparent'
              }"
              :aria-current="activeCategory === category.id ? 'location' : undefined"
              :aria-label="`Aller à la catégorie ${category.name}`"
              :title="`Aller à la catégorie ${category.name}`"
              role="menuitem"
              tabindex="0"
            >
              <Icon 
                v-if="category.icon"
                :name="getSommaireIcon(category.id)" 
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                :style="{ color: 'var(--text-primary)' }"
                aria-hidden="true"
              />
              <span class="text-sm sm:text-base font-medium truncate hidden sm:block">{{ category.name }}</span>
            </button>
          </nav>
        </div>
      </aside>
      
      <!-- Contenu principal -->
      <main class="flex-1 min-w-0" role="main" aria-label="Contenu principal des vérifications">
        <SeoChecklist ref="seoChecklist" @categories-loaded="handleCategoriesLoaded" />
      </main>
    </div>
    
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seoChecklist = ref(null)
const categories = ref([])
const activeCategory = ref(null)

const handleResetProgress = () => {
  console.log('handleResetProgress called')
  if (seoChecklist.value) {
    console.log('Calling resetProgress on seoChecklist')
    seoChecklist.value.resetProgress()
  } else {
    console.log('seoChecklist.value is null')
  }
}

const handleCategoriesLoaded = (loadedCategories) => {
  categories.value = loadedCategories
  
  // Définir la première catégorie comme active par défaut
  if (loadedCategories.length > 0) {
    activeCategory.value = loadedCategories[0].id
  }
}

const isScrollingProgrammatically = ref(false)

const checkScroll = () => {
  // Ne pas exécuter si on est en train de scroller programmatiquement
  if (isScrollingProgrammatically.value) return
  
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const headerHeight = 80
  
  let closestCategory = null
  let closestDistance = Infinity
  
  for (const category of categories.value) {
    const element = document.getElementById(`category-${category.id}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementBottom = rect.bottom
      
      const elementCenter = (elementTop + elementBottom) / 2
      const viewportCenter = windowHeight / 2
      const distance = Math.abs(elementCenter - viewportCenter)
      
      if (elementTop <= windowHeight * 0.3 && elementBottom >= windowHeight * 0.1) {
        if (distance < closestDistance) {
          closestDistance = distance
          closestCategory = category.id
        }
      }
    }
  }
  
  if (closestCategory) {
    activeCategory.value = closestCategory
  }
}

const getSommaireIcon = (categoryId) => {
  const icons = {
    'seo': 'heroicons:magnifying-glass',
    'accessibilite': 'heroicons:user-circle',
    'performance': 'heroicons:bolt',
    'eco-conception': 'heroicons:globe-alt',
    'responsive-ux': 'heroicons:device-phone-mobile',
    'securite': 'heroicons:lock-closed',
    'analytics': 'heroicons:chart-bar'
  }
  return icons[categoryId] || 'heroicons:clipboard-document-list'
}

const scrollToCategory = (categoryId) => {
  const element = document.getElementById(`category-${categoryId}`)
  if (element) {
    // Forcer l'ouverture de la catégorie d'abord
    if (seoChecklist.value) {
      seoChecklist.value.openCategory(categoryId)
    }
    
    // Désactiver checkScroll temporairement
    isScrollingProgrammatically.value = true
    
    // Attendre que l'accordéon soit complètement ouvert puis positionner
    setTimeout(() => {
      // Calculer la hauteur réelle du header
      const headerElement = document.querySelector('header')
      const headerHeight = headerElement ? headerElement.offsetHeight : 80
      const elementTop = element.offsetTop
      const scrollPosition = elementTop - headerHeight - 90 // Ajouter un espacement de 20px
      
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
      
      activeCategory.value = categoryId
      
      // Réactiver checkScroll après un délai pour laisser le scroll se terminer
      setTimeout(() => {
        isScrollingProgrammatically.value = false
      }, 1000) // Délai suffisant pour que le scroll smooth se termine
    }, 300) // Délai plus long pour laisser l'animation d'ouverture se terminer
  }
}

// Écouter le scroll pour mettre à jour la catégorie active
onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>
