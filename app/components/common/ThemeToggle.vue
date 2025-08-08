<template>
  <button
    @click="toggleTheme"
    class="w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-opacity-80 backdrop-blur-sm border shadow-lg"
    style="background-color: var(--bg-surface); border-color: var(--bg-border);"
    :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
    :aria-label="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
    role="button"
    tabindex="0"
  >
    <Icon 
      :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
      class="w-5 h-5 transition-colors duration-200"
      style="color: var(--text-primary);"
      aria-hidden="true"
    />
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('light-theme')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.add('light-theme')
    } else {
      isDark.value = true
      document.documentElement.classList.remove('light-theme')
    }
  }
})
</script>
