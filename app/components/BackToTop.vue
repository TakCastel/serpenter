<template>
  <button
    v-show="isVisible"
    @click="scrollToTop"
    class="fixed bottom-8 right-8 w-14 h-14 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center hover:bg-opacity-80 z-50"
    style="background-color: var(--accent-primary); border-color: var(--accent-primary);"
    :title="$t('app.backToTop')"
    :aria-label="$t('app.backToTop')"
  >
    <Icon 
      name="heroicons:arrow-up" 
      class="w-6 h-6 transition-colors duration-200"
      style="color: white;"
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