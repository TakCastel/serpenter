<template>
  <button
    v-show="isVisible"
    @click="scrollToTop"
    class="fixed bottom-6 right-6 w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center hover:scale-110 z-50"
    style="background-color: var(--accent-primary);"
    title="Retour en haut"
  >
    <Icon 
      name="heroicons:arrow-up" 
      class="w-5 h-5 transition-colors duration-200"
      style="color: var(--bg-primary);"
    />
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const checkScroll = () => {
  if (process.client) {
    isVisible.value = window.scrollY > 300
  }
}

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', checkScroll)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', checkScroll)
  }
})
</script> 