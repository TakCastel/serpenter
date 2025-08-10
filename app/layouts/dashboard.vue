<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader 
      :current-project-id="currentProjectId" 
      :is-sidebar-collapsed="isSidebarCollapsed"
      @reset-progress="handleResetProgress" 
      @toggle-sidebar="toggleSidebar"
    />
    
    <!-- Layout principal avec sidebar (offset ajusté pour le header plus petit) -->
    <div class="pt-[77px] flex items-stretch overflow-hidden">
      <!-- Sidebar avec sommaire -->
      <aside 
        :class="['fixed left-0 top-[77px] border-r transition-all duration-500 ease-in-out h-[calc(100vh-77px)] flex flex-col z-10 shadow-lg', isSidebarCollapsed ? 'w-14' : 'w-72']" 
        style="border-color: var(--bg-border); background-color: var(--bg-surface);"
        role="navigation"
        aria-label="Navigation des vérifications"
      >
        <div :class="[
          'flex-1 min-h-0 overflow-auto',
          isSidebarCollapsed ? 'px-2 pb-0' : 'p-4 pb-0'
        ]">
          <!-- Sélecteur de projet -->
          <div class="mb-6" v-if="!isSidebarCollapsed">
            <ProjectSelector @project-changed="handleProjectChanged" />
          </div>
          
          <!-- Contenu de la sidebar selon l'état -->
          <div v-if="isClient && hasProjects && currentProject?.checklistType">
            <h3 class="text-xs font-semibold mb-4 transition-colors duration-200 hidden sm:block tracking-wide" style="color: var(--text-primary);">
              <span v-if="!isSidebarCollapsed">{{ $t('app.navigation.verifications') }}</span>
            </h3>
            <nav class="space-y-2" role="navigation" :aria-label="$t('app.navigation.verificationsDescription')">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="scrollToCategory(category.id)"
                @keydown.enter="scrollToCategory(category.id)"
                @keydown.space.prevent="scrollToCategory(category.id)"
                :class="[
                  'rounded-xl transition-all duration-200 flex items-center',
                  isSidebarCollapsed ? 'w-10 h-10 mx-auto justify-center' : 'w-full text-left px-2 py-2 sm:px-3 sm:py-2'
                ]"
                :style="{
                  backgroundColor: activeCategory === category.id ? 'var(--bg-border)' : 'transparent',
                  color: 'var(--text-primary)',
                  borderColor: 'transparent'
                }"
                :aria-current="activeCategory === category.id ? 'location' : undefined"
                                            :aria-label="$t('common.goToCategory', { name: category.name })"
                            :title="$t('common.goToCategory', { name: category.name })"
                role="menuitem"
                tabindex="0"
              >
                <Icon 
                  v-if="category.icon"
                  :name="getSommaireIcon(category.id)" 
                  :class="[
                    'flex-shrink-0',
                    isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-0.5'
                  ]"
                  :style="{ color: 'var(--text-primary)' }"
                  aria-hidden="true"
                />
                                            <span v-if="!isSidebarCollapsed" class="text-xs sm:text-sm font-medium truncate ml-2">{{ category.name }}</span>
              </button>
            </nav>
          </div>
          
          <!-- Message d'invitation quand aucun projet ou pas de type de checklist -->
          <div v-else-if="isClient && !isSidebarCollapsed && (!hasProjects || !currentProject?.checklistType)" class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background-color: var(--bg-border);">
              <Icon name="heroicons:folder" class="w-8 h-8" style="color: var(--accent-primary);" aria-hidden="true" />
            </div>
            <h3 class="text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
              {{ !hasProjects ? $t('sidebar.welcome') : 'Choisir un type de checklist' }}
            </h3>
            <p class="text-xs transition-colors duration-200" style="color: var(--text-secondary);">
              {{ !hasProjects ? $t('sidebar.createProjectMessage') : 'Sélectionnez le type de checklist qui correspond à votre projet' }}
            </p>
          </div>
        </div>
      </aside>
      
      <!-- Contenu principal -->
      <main :class="['w-full min-w-0 min-h-0 overflow-auto bg-[var(--bg-primary)] transition-all duration-500 ease-in-out', isSidebarCollapsed ? 'ml-14' : 'ml-72']" :style="{ height: 'calc(100vh - 77px)' }" role="main" aria-label="Contenu principal des vérifications">
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
import { useCategoriesStore } from '~/stores/categories'
import AppHeader from '~/components/dashboard/AppHeader.vue'
import ProjectSelector from '~/components/dashboard/ProjectSelector.vue'
import BackToTop from '~/components/common/BackToTop.vue'

const categoriesStore = useCategoriesStore()
const { categories, activeCategory, loadCategoriesForProject, setActiveCategory } = categoriesStore
const isClient = ref(false)
const projectsStore = useProjectsStore()
const hasProjects = computed(() => projectsStore.hasProjects)
const currentProjectId = computed(() => projectsStore.currentProjectId)
const currentProject = computed(() => projectsStore.currentProject)

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
  // Utiliser directement le store au lieu du computed
  projectsStore.setCurrentProject(projectId)
  
  // Charger les catégories quand le projet change
  if (projectId && currentProject.value?.checklistType) {
    loadCategoriesForProject(currentProject.value.checklistType)
  }
}



const isScrollingProgrammatically = ref(false)
const isSidebarCollapsed = ref(false)
const toggleSidebar = () => { isSidebarCollapsed.value = !isSidebarCollapsed.value }

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
      setActiveCategory(closestCategory)
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
        setActiveCategory(categoryId)
        setTimeout(() => {
          isScrollingProgrammatically.value = false
        }, 1000)
      }, 300)
    }
  }
}

const getSommaireIcon = (categoryId) => {
  // Utiliser l'icône définie dans la catégorie si elle existe
  const category = categories.value.find(cat => cat.id === categoryId)
  if (category && category.icon) {
    return category.icon
  }
  
  // Fallback sur les icônes par défaut
  const defaultIcons = {
    'seo': 'heroicons:magnifying-glass',
    'accessibilite': 'heroicons:heart',
    'performance': 'heroicons:bolt',
    'eco-conception': 'heroicons:sparkles',
    'responsive-ux': 'heroicons:device-phone-mobile',
    'securite': 'heroicons:shield-check',
    'analytics': 'heroicons:chart-bar',
    'conformite': 'heroicons:check-circle',
    'preparation': 'heroicons:clipboard-document-list',
    'configuration': 'heroicons:cog',
    'maintenance': 'heroicons:wrench-screwdriver'
  }
  return defaultIcons[categoryId] || 'heroicons:clipboard-document-list'
}

onMounted(() => {
  if (process.client) {
    isClient.value = true
    window.addEventListener('scroll', checkScroll)
    // window.addEventListener('categories-loaded', handleCategoriesLoaded) // This event is no longer emitted
    
    // Charger les catégories si un projet est déjà sélectionné
    if (currentProject.value?.checklistType) {
      loadCategoriesForProject(currentProject.value.checklistType)
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', checkScroll)
    // window.removeEventListener('categories-loaded', handleCategoriesLoaded) // This event is no longer emitted
  }
})
</script>
