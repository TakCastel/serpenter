<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader 
      :current-project-id="currentProjectId" 
      @reset-progress="handleResetProgress" 
    />
    
    <!-- Layout principal avec sidebar (offset ajusté pour le header plus petit) -->
    <div class="pt-[72px] flex">
      <!-- Sidebar avec sommaire -->
      <aside 
        class="w-16 sm:w-72 flex-shrink-0 border-r transition-all duration-300" 
        style="border-color: var(--bg-border); background-color: var(--bg-surface);"
        role="navigation"
        aria-label="Navigation des vérifications"
      >
        <div class="sticky top-20 p-4">
          <!-- Sélecteur de projet -->
          <div class="mb-6 hidden sm:block">
            <ProjectSelector @project-changed="handleProjectChanged" />
          </div>
          
          <!-- Contenu de la sidebar selon l'état -->
          <div v-if="isClient && hasProjects">
            <h3 class="text-xs font-semibold mb-4 transition-colors duration-200 hidden sm:block tracking-wide" style="color: var(--text-primary);">
              {{ $t('app.navigation.verifications') }}
            </h3>
            <nav class="space-y-2" role="navigation" :aria-label="$t('app.navigation.verificationsDescription')">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="scrollToCategory(category.id)"
                @keydown.enter="scrollToCategory(category.id)"
                @keydown.space.prevent="scrollToCategory(category.id)"
                class="w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 hover:bg-opacity-80"
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
                <span class="text-xs sm:text-sm font-medium truncate hidden sm:block">{{ $t(`categories.${category.id}.name`) }}</span>
              </button>
            </nav>
          </div>
          
          <!-- Message d'invitation quand aucun projet -->
          <div v-else-if="isClient" class="text-center hidden sm:block">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background-color: var(--bg-border);">
              <Icon name="heroicons:folder" class="w-8 h-8" style="color: var(--accent-primary);" aria-hidden="true" />
            </div>
            <h3 class="text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
              {{ $t('sidebar.welcome') }}
            </h3>
            <p class="text-xs transition-colors duration-200" style="color: var(--text-secondary);">
              {{ $t('sidebar.createProjectMessage') }}
            </p>
          </div>
        </div>
      </aside>
      
      <!-- Contenu principal -->
      <main class="flex-1 min-w-0" role="main" aria-label="Contenu principal des vérifications">
        <slot />
      </main>
    </div>

    <!-- Back to top -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import AppHeader from '~/components/dashboard/AppHeader.vue'
import ProjectSelector from '~/components/dashboard/ProjectSelector.vue'
import BackToTop from '~/components/common/BackToTop.vue'

const categories = ref([])
const activeCategory = ref(null)
const isClient = ref(false)
const projectsStore = useProjectsStore()
const hasProjects = computed(() => projectsStore.hasProjects)
const currentProjectId = computed(() => projectsStore.currentProjectId)

const handleResetProgress = () => {
  if (process.client) {
    // Émettre un événement personnalisé pour réinitialiser le progrès
    window.dispatchEvent(new CustomEvent('reset-checklist-progress'))
  }
}

const handleCategoriesLoaded = (event) => {
  if (event.detail && event.detail.categories) {
    categories.value = event.detail.categories
    
    // Définir la première catégorie comme active par défaut
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
    }
  }
}

const handleProjectChanged = (projectId) => {
  currentProjectId.value = projectId
}

const isScrollingProgrammatically = ref(false)

const checkScroll = () => {
  if (isScrollingProgrammatically.value) return
  
  if (process.client) {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const headerHeight = 80
    
    let closestCategory = null
    let closestDistance = Infinity
    
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
      isScrollingProgrammatically.value = true
      
      // Ouvrir l'accordéon de la catégorie
      window.dispatchEvent(new CustomEvent('open-category', { 
        detail: { categoryId } 
      }))
      
      setTimeout(() => {
        const headerElement = document.querySelector('header')
        const headerHeight = headerElement ? headerElement.offsetHeight : 80
        const elementTop = element.offsetTop
        const scrollPosition = elementTop - headerHeight - 20
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
    isClient.value = true
    window.addEventListener('scroll', checkScroll)
    window.addEventListener('categories-loaded', handleCategoriesLoaded)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', checkScroll)
    window.removeEventListener('categories-loaded', handleCategoriesLoaded)
  }
})
</script>
