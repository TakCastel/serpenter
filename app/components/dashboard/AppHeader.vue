<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 border-b px-6 lg:px-8 py-4"
    style="background-color: var(--bg-surface); border-color: var(--bg-border); backdrop-filter: blur(16px);"
    role="banner"
    aria-label="En-tête de l'application"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-3">
        <!-- Bouton toggle sidebar (style YouTube) -->
        <button
          @click="toggleSidebar"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-opacity-80 mr-2"
          :title="isSidebarCollapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'"
          :aria-label="isSidebarCollapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'"
          :style="{
            backgroundColor: isSidebarCollapsed ? 'var(--bg-primary)' : 'var(--accent-primary)',
            color: isSidebarCollapsed ? 'var(--text-primary)' : 'white'
          }"
        >
          <Icon 
            :name="isSidebarCollapsed ? 'heroicons:bars-3' : 'heroicons:x-mark'" 
            class="w-5 h-5 transition-transform duration-300"
            :class="{ 'rotate-180': !isSidebarCollapsed }"
          />
        </button>
        
        <Icon name="fluent-emoji:snake" class="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
        <div class="flex flex-col transition-all duration-300">
          <h1 
            class="font-bold tracking-tight text-xl"
            style="color: var(--accent-primary);"
          >
            {{ $t('app.title') }}
          </h1>
          <span 
            class="text-xs"
            style="color: var(--text-secondary);"
          >
            {{ $t('app.subtitle') }}
          </span>
        </div>
      </div>
      
      <div class="flex items-center space-x-3 sm:space-x-4" role="toolbar" aria-label="Actions de l'application">
        <!-- Progress Indicator (visible only when scrolled and project selected) -->
        <div 
          v-if="isScrolled && progressPercentage !== null && currentProjectId"
          class="hidden sm:flex items-center space-x-4 mr-2"
        >
          <!-- Progress Circle -->
          <div class="relative w-12 h-12">
            <!-- Background Circle -->
            <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--bg-border)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <!-- Progress Circle -->
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--accent-primary)"
                stroke-width="2"
                stroke-linecap="round"
                :stroke-dasharray="`${progressPercentage * 1.131}, 100`"
                class="transition-all duration-500 ease-out"
              />
            </svg>
            <!-- Percentage Text -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-semibold transition-colors duration-200" style="color: var(--text-primary);">
                {{ Math.round(progressPercentage) }}%
              </span>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu trigger (small screens) -->
        <button
          @click="toggleMobileMenu"
          class="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
          :aria-expanded="showMobileMenu"
          aria-label="Ouvrir le menu"
        >
          <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" :style="{ color: 'var(--text-primary)' }" />
        </button>

        <!-- Switchers mutualisés (desktop only) -->
        <div class="hidden sm:block">
          <LangThemeSwitcher size="sm" />
        </div>
        
        <!-- Reset (desktop only) -->
        <button
          v-if="currentProjectId && isClient && currentProjectHasChecklistType"
          @click="resetProgress"
          class="hidden sm:flex px-3 py-1.5 rounded-xl transition-all duration-200 items-center space-x-2 hover:bg-opacity-80"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
          :title="$t('app.progress.resetTitle')"
          :aria-label="$t('app.progress.resetDescription')"
          role="button"
          tabindex="0"
        >
          <Icon 
            name="heroicons:arrow-path" 
            class="w-4 h-4 transition-colors duration-200"
            style="color: var(--text-muted);"
            aria-hidden="true"
          />
          <span class="text-sm font-medium transition-colors duration-200" style="color: var(--text-muted);">
            {{ $t('app.progress.reset') }}
          </span>
        </button>

        <!-- User avatar (always shown when logged in) -->
        <div v-if="userLoggedIn" class="relative">
          <button
            @click="toggleUserMenu"
            class="w-9 h-9 rounded-full flex items-center justify-center"
            style="background-color: var(--bg-border);"
            aria-label="Menu utilisateur"
            :aria-expanded="showUserMenu"
          >
            <span class="sr-only">Utilisateur</span>
            <!-- Simple cercle/Avatar neutre -->
            <div class="w-7 h-7 rounded-full" style="background-color: var(--bg-primary);"></div>
          </button>

          <!-- User Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute top-full right-0 mt-3 w-44 rounded-xl border z-50"
            style="background-color: var(--bg-surface); border-color: var(--bg-border);"
            role="menu"
            aria-label="Menu utilisateur"
          >
            <button
              @click="logoutUser"
              class="w-full px-4 py-2 text-left text-sm rounded-xl transition-colors duration-200 hover:bg-opacity-50"
              style="color: var(--text-primary); background-color: var(--bg-primary);"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile dropdown -->
    <div v-if="showMobileMenu" class="sm:hidden mt-3 px-1" role="menu" aria-label="Menu mobile">
      <div class="rounded-xl border" style="background-color: var(--bg-surface); border-color: var(--bg-border);">
        <div class="p-2 space-y-1">
          <button @click="toggleTheme" class="w-full px-3 py-2 rounded-lg flex items-center justify-between" style="background-color: var(--bg-primary); color: var(--text-primary);">
            <span>Thème</span>
            <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }" />
          </button>
          <div class="px-3 pt-2 text-xs" style="color: var(--text-muted);">Langue</div>
          <div class="grid grid-cols-2 gap-2 px-2">
            <button @click="switchLanguage('fr'); closeMobileMenu()" class="px-3 py-2 rounded-lg text-sm" style="background-color: var(--bg-primary); color: var(--text-primary);">FR</button>
            <button @click="switchLanguage('en'); closeMobileMenu()" class="px-3 py-2 rounded-lg text-sm" style="background-color: var(--bg-primary); color: var(--text-primary);">EN</button>
          </div>
          <button v-if="currentProjectId && currentProjectHasChecklistType" @click="handleMobileReset" class="w-full px-3 py-2 rounded-lg flex items-center justify-between" style="background-color: var(--bg-primary); color: var(--text-primary);">
            <span>{{ $t('app.progress.reset') }}</span>
            <Icon name="heroicons:arrow-path" class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Modal de confirmation de réinitialisation -->
  <Modal
    v-model:is-open="showResetModal"
    :title="$t('app.progress.resetTitle')"
    @close="cancelReset"
  >
    <p class="text-base" style="color: var(--text-secondary);">
      {{ $t('app.progress.resetConfirm') }}
    </p>

    <template #footer>
      <button
        @click="cancelReset"
        class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
        style="background-color: var(--bg-primary); border: 1px solid var(--bg-border); color: var(--text-primary);"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="confirmReset"
        class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
        style="background-color: var(--accent-primary); color: white;"
      >
        {{ $t('app.progress.reset') }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Modal from '../common/Modal.vue'
import LangThemeSwitcher from '~/components/common/LangThemeSwitcher.vue'

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

const emit = defineEmits(['reset-progress', 'toggle-sidebar'])

const { locale, setLocale } = useI18n()
const { currentUser, logout } = useAuth()

const isDark = ref(true)
const isScrolled = ref(false)
const progressPercentage = ref(null)
const showLanguageMenu = ref(false)
const showResetModal = ref(false)
const isClient = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

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

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('light-theme')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const resetProgress = () => {
  showResetModal.value = true
}

const confirmReset = () => {
  emit('reset-progress')
  showResetModal.value = false
}

const cancelReset = () => {
  showResetModal.value = false
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const switchLanguage = (locale) => {
  if (process.client) {
    setLocale(locale)
    setTimeout(() => {
      showLanguageMenu.value = false
    }, 100)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const logoutUser = async () => {
  try {
    await logout()
    showUserMenu.value = false
    navigateTo('/login')
  } catch (e) {
    // noop
  }
}

const handleClickOutside = (event) => {
  const languageMenu = document.querySelector('[role="menu"][aria-label*="langue"], [role="menu"][aria-label*="language"]')
  const userMenu = document.querySelector('[aria-label="Menu utilisateur"]')
  if (showLanguageMenu.value && languageMenu && !languageMenu.contains(event.target)) {
    showLanguageMenu.value = false
  }
  if (showUserMenu.value && userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}

const handleMobileReset = () => {
  resetProgress()
  closeMobileMenu()
}

onMounted(() => {
  isClient.value = true
  
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.add('light-theme')
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('progress-updated', handleProgressUpdate)
    window.addEventListener('click', handleClickOutside)
    handleScroll()
    
    resetProgressWhenNoProject()
  }
})

watch(() => props.currentProjectId, (newValue) => {
  if (!newValue) {
    progressPercentage.value = 0
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('progress-updated', handleProgressUpdate)
    window.removeEventListener('click', handleClickOutside)
  }
})
</script> 