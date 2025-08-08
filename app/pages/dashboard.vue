<template>
  <div>
    <EmptyState v-if="isClient && !hasProjects" @create-project="handleCreateFirstProject" />
    <SeoChecklist v-else-if="isClient && currentProjectId" ref="seoChecklist" :current-project-id="currentProjectId" @categories-loaded="handleCategoriesLoaded" />
    <EmptyState v-else-if="isClient" @create-project="handleCreateFirstProject" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import EmptyState from '~/components/dashboard/EmptyState.vue'
import SeoChecklist from '~/components/checklist/SeoChecklist.vue'

definePageMeta({
  layout: 'dashboard'
})

const seoChecklist = ref(null)
const isClient = ref(false)
const projectsStore = useProjectsStore()
const hasProjects = computed(() => projectsStore.hasProjects)
const currentProjectId = computed(() => projectsStore.currentProjectId)

const handleCategoriesLoaded = (loadedCategories) => {
  // Émettre l'événement vers le layout parent
  if (process.client) {
    window.dispatchEvent(new CustomEvent('categories-loaded', { 
      detail: { categories: loadedCategories } 
    }))
  }
}

const handleCreateFirstProject = (project) => {
  console.log('Projet créé:', project)
}

const handleResetProgress = () => {
  if (seoChecklist.value && seoChecklist.value.resetProgress) {
    seoChecklist.value.resetProgress()
  }
}

onMounted(() => {
  if (process.client) {
    isClient.value = true
    // Écouter l'événement de réinitialisation
    window.addEventListener('reset-checklist-progress', handleResetProgress)
  }
})

onUnmounted(() => {
  if (process.client) {
    // Nettoyer l'écouteur d'événement
    window.removeEventListener('reset-checklist-progress', handleResetProgress)
  }
})

// Exposer la méthode pour le layout
defineExpose({
  handleResetProgress
})
</script>
