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
          Serpenter
        </h1>
        <span 
          class="transition-all duration-300"
          :class="{ 'text-xs': isScrolled, 'text-sm': !isScrolled }"
          style="color: var(--text-secondary);"
        >
          Checklist Pré-Déploiement
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
          :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
          :aria-label="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
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
        <button
          @click="resetProgress"
          class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 hover:opacity-80"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);"
          title="Réinitialiser tout le progrès"
          aria-label="Réinitialiser tout le progrès de la checklist"
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
            Réinitialiser
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['reset-progress'])

const isDark = ref(true)
const isScrolled = ref(false)
const progressPercentage = ref(null)

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
  if (process.client && confirm('Êtes-vous sûr de vouloir réinitialiser tout le progrès ? Cette action ne peut pas être annulée.')) {
    emit('reset-progress')
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
    handleScroll() // Check initial scroll position
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('progress-updated', handleProgressUpdate)
  }
})
</script> 