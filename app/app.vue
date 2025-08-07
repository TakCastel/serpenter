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
            {{ $t('app.navigation.verifications') }}
          </h3>
          <nav class="space-y-2" role="navigation" :aria-label="$t('app.navigation.verificationsDescription')">
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
              :aria-label="$t('common.goToCategory', { name: $t(`categories.${category.id}.name`) })"
              :title="$t('common.goToCategory', { name: $t(`categories.${category.id}.name`) })"
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
              <span class="text-sm sm:text-base font-medium truncate hidden sm:block">{{ $t(`categories.${category.id}.name`) }}</span>
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
  
  if (process.client) {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const headerHeight = 80
    
    let closestCategory = null
    let closestDistance = Infinity
    
    // Vérifier chaque catégorie
    categories.value.forEach(category => {
      const element = document.getElementById(`category-${category.id}`)
      if (element) {
        const rect = element.getBoundingClientRect()
        const distance = Math.abs(rect.top - headerHeight)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestCategory = category.id
        }
      }
    })
    
    if (closestCategory && closestCategory !== activeCategory.value) {
      activeCategory.value = closestCategory
    }
  }
}

const scrollToCategory = (categoryId) => {
  if (process.client) {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      if (seoChecklist.value) {
        seoChecklist.value.openCategory(categoryId)
      }
      isScrollingProgrammatically.value = true
      setTimeout(() => {
        const headerElement = document.querySelector('header')
        const headerHeight = headerElement ? headerElement.offsetHeight : 80
        const elementTop = element.offsetTop
        const scrollPosition = elementTop - headerHeight - 20 // Added 20px offset
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        })
        activeCategory.value = categoryId
        setTimeout(() => {
          isScrollingProgrammatically.value = false
        }, 1000)
      }, 300)
    }
  }
}

const getSommaireIcon = (categoryId) => {
  const icons = {
    'seo': 'heroicons:magnifying-glass',
    'accessibilite': 'heroicons:heart',
    'performance': 'heroicons:bolt',
    'eco-conception': 'heroicons:sparkles',
    'responsive-ux': 'heroicons:device-phone-mobile',
    'securite': 'heroicons:shield-check',
    'analytics': 'heroicons:chart-bar'
  }
  return icons[categoryId] || 'heroicons:clipboard-document-list'
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', checkScroll)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', checkScroll)
  }
})
</script>

