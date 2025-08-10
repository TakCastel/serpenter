<template>
  <button
    @click="goBack"
    class="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100 mb-4"
    aria-label="Retour"
  >
    <Icon name="heroicons:arrow-left" class="w-4 h-4" />
    <span>Retour</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}
</script>

