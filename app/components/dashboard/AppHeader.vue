<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-in-out px-6 lg:px-8"
    :class="{ 'py-3': isScrolled, 'py-6': !isScrolled }"
    style="background-color: var(--bg-surface); border-color: var(--bg-border); backdrop-filter: blur(16px);"
    role="banner"
    aria-label="En-tête de l'application"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-3">
        <Icon name="fluent-emoji:snake" class="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
        <div class="flex flex-col transition-all duration-300">
          <h1 
            class="font-bold transition-all duration-300 tracking-tight"
            :class="{ 'text-xl': isScrolled, 'text-2xl': !isScrolled }"
            style="color: var(--accent-primary);"
          >
            {{ $t('app.title') }}
          </h1>
          <span 
            class="transition-all duration-300"
            :class="{ 'text-xs': isScrolled, 'text-sm': !isScrolled }"
            style="color: var(--text-secondary);"
          >
            {{ $t('app.subtitle') }}
          </span>
        </div>
      </div>
      
      <div class="flex items-center space-x-4" role="toolbar" aria-label="Actions de l'application">
        <!-- Progress Indicator (visible only when scrolled and project selected) -->
        <div 
          v-if="isScrolled && progressPercentage !== null && currentProjectId"
          class="flex items-center space-x-4 mr-2"
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
        
        <button
          @click="toggleTheme"
          class="w-8 h-8 rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-opacity-80"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
          :title="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
          :aria-label="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
          role="button"
          tabindex="0"
        >
          <Icon 
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
            class="w-4 h-4 transition-colors duration-200"
            style="color: var(--accent-primary);"
            aria-hidden="true"
          />
        </button>
        
        <!-- Language Selector -->
        <div class="relative">
          <button
            @click="toggleLanguageMenu"
            class="px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center space-x-2 hover:bg-opacity-80"
            style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
            :title="$t('app.language.select')"
            :aria-label="$t('app.language.select')"
            role="button"
            tabindex="0"
          >
            <Icon 
              name="heroicons:language" 
              class="w-4 h-4 transition-colors duration-200"
              style="color: var(--text-muted);"
              aria-hidden="true"
            />
            <span class="text-sm font-medium transition-colors duration-200" style="color: var(--text-muted);">
              {{ locale === 'fr' ? 'FR' : 'EN' }}
            </span>
          </button>
          
          <!-- Language Menu -->
          <div 
            v-if="showLanguageMenu"
            :key="locale"
            class="absolute top-full right-0 mt-3 w-36 rounded-xl border transition-all duration-200 z-50"
            style="background-color: var(--bg-surface); border-color: var(--bg-border);"
            role="menu"
            :aria-label="$t('app.language.select')"
          >
            <button
              @click="switchLanguage('fr')"
              class="w-full px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-opacity-50 rounded-t-xl"
              style="color: var(--text-primary); background-color: var(--bg-primary);"
              :class="{ 'font-semibold': locale === 'fr' }"
              role="menuitem"
              tabindex="0"
            >
              {{ $t('app.language.french') }}
            </button>
            <button
              @click="switchLanguage('en')"
              class="w-full px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-opacity-50 rounded-b-xl"
              style="color: var(--text-primary); background-color: var(--bg-primary);"
              :class="{ 'font-semibold': locale === 'en' }"
              role="menuitem"
              tabindex="0"
            >
              {{ $t('app.language.english') }}
            </button>
          </div>
        </div>
        
        <button
          v-if="currentProjectId && isClient"
          @click="resetProgress"
          class="px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center space-x-2 hover:bg-opacity-80"
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Modal from '../common/Modal.vue'

const props = defineProps({
  currentProjectId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['reset-progress'])

const { locale, setLocale } = useI18n()

const isDark = ref(true)
const isScrolled = ref(false)
const progressPercentage = ref(null)
const showLanguageMenu = ref(false)
const showResetModal = ref(false)
const isClient = ref(false)

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
    // Petit délai pour s'assurer que le changement est pris en compte
    setTimeout(() => {
      showLanguageMenu.value = false
    }, 100)
  }
}

const handleClickOutside = (event) => {
  const languageMenu = document.querySelector('[role="menu"]')
  const languageButton = event.target.closest('button[aria-label*="langue"]')
  const languageButton2 = event.target.closest('button[aria-label*="language"]')
  
  if (languageMenu && !languageMenu.contains(event.target) && !languageButton && !languageButton2) {
    showLanguageMenu.value = false
  }
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
    handleScroll() // Check initial scroll position
    
    // Réinitialiser le pourcentage au montage si pas de projet
    resetProgressWhenNoProject()
  }
})

// Surveiller les changements de currentProjectId
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