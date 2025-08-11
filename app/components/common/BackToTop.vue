<template>
  <button
    v-show="isVisible"
    @click="scrollToTop"
    class="fixed bottom-8 right-8 w-16 h-16 rounded-3xl transition-all duration-300 flex items-center justify-center z-50"
    style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: 1px solid var(--bg-border);"
    :title="backToTopLabel"
    :aria-label="backToTopLabel"
  >
    <Icon 
      name="heroicons:arrow-up" 
      class="w-7 h-7 transition-colors duration-200"
      style="color: white;"
    />
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const isVisible = ref(false)

const { t, te, locale } = useI18n({ useScope: 'global' })
const backToTopLabel = computed(() => (te && te('app.backToTop') ? t('app.backToTop') : (locale?.value === 'fr' ? 'Retour en haut' : 'Back to top')))

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