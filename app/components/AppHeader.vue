<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <h1>Serpenter</h1>
        <span class="tagline">Checklist SEO Pro</span>
      </div>
      <div class="header-actions">
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
        >
          <Icon 
            :name="isDark ? 'fluent-emoji:sun' : 'fluent-emoji:new-moon'" 
            size="1.1rem" 
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light-theme')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light-theme')
  }
})
</script> 