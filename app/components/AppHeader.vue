<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8"
    :class="{ 'py-2': isScrolled, 'py-4': !isScrolled }"
    style="background-color: var(--bg-surface); border-color: var(--bg-border); backdrop-filter: blur(8px);"
    role="banner"
    aria-label="En-tête de l'application"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col transition-all duration-300">
        <h1 
          class="font-bold transition-all duration-300"
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
      
      <div class="flex items-center space-x-3" role="toolbar" aria-label="Actions de l'application">
        <!-- Progress Indicator (visible only when scrolled) -->
        <div 
          v-if="isScrolled && progressPercentage !== null"
          class="flex items-center space-x-3 mr-2"
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
              <span class="text-xs font-bold transition-colors duration-200" style="color: var(--text-primary);">
                {{ Math.round(progressPercentage) }}%
              </span>
            </div>
          </div>
        </div>
        
        <button
          @click="toggleTheme"
          class="w-10 h-10 rounded-lg transition-colors duration-200 flex items-center justify-center hover:opacity-80"
          style="background-color: var(--bg-surface);"
          :title="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
          :aria-label="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
          role="button"
          tabindex="0"
        >
          <Icon 
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
            class="w-5 h-5 transition-colors duration-200"
            style="color: var(--accent-primary);"
            aria-hidden="true"
          />
        </button>
        <!-- Language Selector -->
        <div class="relative">
          <button
            @click="toggleLanguageMenu"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 hover:opacity-80"
            style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
                      :title="$t('app.language.select')"
          :aria-label="$t('app.language.select')"
            role="button"
            tabindex="0"
          >
            <Icon 
              name="heroicons:language" 
              class="w-3.5 h-3.5 transition-colors duration-200"
              style="color: var(--text-muted);"
              aria-hidden="true"
            />
            <span class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">
              {{ locale === 'fr' ? 'FR' : 'EN' }}
            </span>
          </button>
          
          <!-- Language Menu -->
          <div 
            v-if="showLanguageMenu"
            :key="locale"
            class="absolute top-full right-0 mt-2 w-32 rounded-lg border transition-all duration-200 z-50"
            style="background-color: var(--bg-surface); border-color: var(--bg-border);"
            role="menu"
            :aria-label="$t('app.language.select')"
          >
            <button
              @click="switchLanguage('fr')"
              class="w-full px-3 py-2 text-left text-xs transition-colors duration-200 hover:opacity-80"
              style="color: var(--text-primary);"
              :class="{ 'font-semibold': locale === 'fr' }"
              role="menuitem"
              tabindex="0"
            >
              {{ $t('app.language.french') }}
            </button>
            <button
              @click="switchLanguage('en')"
              class="w-full px-3 py-2 text-left text-xs transition-colors duration-200 hover:opacity-80"
              style="color: var(--text-primary);"
              :class="{ 'font-semibold': locale === 'en' }"
              role="menuitem"
              tabindex="0"
            >
              {{ $t('app.language.english') }}
            </button>
          </div>
        </div>
        
        <button
          @click="resetProgress"
          class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 hover:opacity-80"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
          :title="$t('app.progress.resetTitle')"
          :aria-label="$t('app.progress.resetDescription')"
          role="button"
          tabindex="0"
        >
          <Icon 
            name="heroicons:arrow-path" 
            class="w-3.5 h-3.5 transition-colors duration-200"
            style="color: var(--text-muted);"
            aria-hidden="true"
          />
          <span class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">
            {{ $t('app.progress.reset') }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['reset-progress'])

const { locale, setLocale } = useI18n()

const isDark = ref(true)
const isScrolled = ref(false)
const progressPercentage = ref(null)
const showLanguageMenu = ref(false)

const handleScroll = () => {
  if (process.client) {
    isScrolled.value = window.scrollY > 20
  }
}

const handleProgressUpdate = (event) => {
  progressPercentage.value = event.detail.percentage
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('light-theme')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

const resetProgress = () => {
  if (process.client && confirm($t('app.progress.resetConfirm'))) {
    emit('reset-progress')
  }
}

const toggleLanguageMenu = () => {
  console.log('Toggle language menu, current state:', showLanguageMenu.value)
  showLanguageMenu.value = !showLanguageMenu.value
  console.log('New state:', showLanguageMenu.value)
}

const switchLanguage = (locale) => {
  if (process.client) {
    console.log('Switching to locale:', locale)
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