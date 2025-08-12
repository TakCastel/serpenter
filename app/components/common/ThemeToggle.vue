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
import { onMounted, onUnmounted } from 'vue'

const { isDark, toggleTheme } = useTheme()

onMounted(() => {
  // Plus besoin d'appeler themeOnMounted() car useTheme gère déjà onMounted
})

onUnmounted(() => {
  // Plus besoin d'appeler themeOnUnmounted() car useTheme gère déjà onUnmounted
})
</script>
