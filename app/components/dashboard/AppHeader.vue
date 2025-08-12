<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 border-b px-4 lg:px-4 p-4 backdrop-blur-sm transition-colors duration-300"
    style="background-color: var(--header-bg); border-color: var(--header-border);"
    role="banner"
    aria-label="En-tête de l'application"
  >
    <div class="flex items-center justify-between w-full">
      <!-- Section gauche : Logo et navigation -->
      <HeaderLeftSection 
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="$emit('toggle-sidebar')"
      />
      
      <!-- Section centrale : Indicateur de progression -->
      <HeaderCenterSection 
        :progress-percentage="progressPercentage"
        :current-project-id="currentProjectId"
      />
      
      <!-- Section droite : Actions et profil -->
      <HeaderRightSection 
        ref="userMenuRef"
        :is-client="isClient"
        :show-mobile-menu="showMobileMenu"
        :show-user-menu="showUserMenu"
        :user-logged-in="userLoggedIn"
        :current-user="currentUser"
        @toggle-mobile-menu="toggleMobileMenu"
        @toggle-user-menu="toggleUserMenu"
        @logout="logoutUser"
      />
    </div>

    <!-- Menu mobile -->
    <HeaderMobileMenu 
      :show-mobile-menu="showMobileMenu"
      :progress-percentage="progressPercentage"
      :current-project-id="currentProjectId"
      :current-project-has-checklist-type="currentProjectHasChecklistType"
      @switch-language="switchLanguage"
      @mobile-reset="handleMobileReset"
      @logout="logoutUser"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import HeaderLeftSection from './HeaderLeftSection.vue'
import HeaderCenterSection from './HeaderCenterSection.vue'
import HeaderRightSection from './HeaderRightSection.vue'
import HeaderMobileMenu from './HeaderMobileMenu.vue'
import { useTheme } from '~/composables/useTheme'

const props = defineProps({
  currentProjectId: {
    type: String,
    default: null
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const projectsStore = useProjectsStore?.() || null
const currentProjectHasChecklistType = computed(() => {
  try {
    return !!projectsStore?.currentProject?.checklistType
  } catch (e) {
    return false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const { setLocale } = useI18n()
const { currentUser, signOut } = useAuth()

const { isDark, toggleTheme } = useTheme()
const isScrolled = ref(false)
const progressPercentage = ref(null)
const isClient = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

const userLoggedIn = computed(() => !!currentUser.value)

const handleScroll = () => {
  if (process.client) {
    isScrolled.value = window.scrollY > 20
  }
}

const handleProgressUpdate = (event) => {
  progressPercentage.value = event.detail.percentage
}

// Réinitialiser le pourcentage quand il n'y a pas de projet sélectionné
const resetProgressWhenNoProject = () => {
  if (!props.currentProjectId) {
    progressPercentage.value = 0
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const switchLanguage = (locale) => {
  if (process.client) {
    setLocale(locale)
    setTimeout(() => {
      showMobileMenu.value = false
    }, 100)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleClickOutside = (event) => {
  // Vérifier que le menu est ouvert et que la référence existe
  if (showUserMenu.value && userMenuRef.value) {
    // Vérifier si le clic est en dehors du menu
    if (!userMenuRef.value.$el && !userMenuRef.value.contains(event.target)) {
      showUserMenu.value = false
    } else if (userMenuRef.value.$el && !userMenuRef.value.$el.contains(event.target)) {
      showUserMenu.value = false
    }
  }
}

const logoutUser = async () => {
  try {
    await signOut()
    showUserMenu.value = false
    await navigateTo('/login')
  } catch (e) {
    // Erreur lors de la déconnexion
    // En cas d'erreur, fermer le menu et rediriger quand même
    showUserMenu.value = false
    await navigateTo('/login')
  }
}

const handleMobileReset = () => {
  showMobileMenu.value = false
}

const router = useRouter()

const goToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

const goToSettings = () => {
  showUserMenu.value = false
  router.push('/settings')
}

const goToHelp = () => {
  showUserMenu.value = false
  router.push('/help')
}

onMounted(() => {
  isClient.value = true
  // Plus besoin d'appeler themeOnMounted() car useTheme gère déjà onMounted
  
  if (process.client) {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('progress-updated', handleProgressUpdate)
    
    // Attendre que le composant soit complètement monté avant d'ajouter l'event listener
    nextTick().then(() => {
      document.addEventListener('click', handleClickOutside)
      handleScroll()
      resetProgressWhenNoProject()
    })
  }
})

watch(() => props.currentProjectId, (newValue) => {
  if (!newValue) {
    progressPercentage.value = 0
  }
})

onUnmounted(() => {
  // Plus besoin d'appeler themeOnUnmounted() car useTheme gère déjà onUnmounted
  
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('progress-updated', handleProgressUpdate)
    document.removeEventListener('click', handleClickOutside)
  }
})
</script> 