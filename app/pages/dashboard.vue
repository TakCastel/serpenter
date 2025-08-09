<template>
  <div class="px-4 lg:px-6 py-6">
    <!-- Header global avec titre, description et statistiques (visible seulement si projet sélectionné) -->
    <div v-if="isClient && currentProjectId" class="card p-6 mb-6" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
      <div class="text-center mb-2">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Checklist Pré-Déploiement</h1>
        <p class="text-sm" style="color: var(--text-secondary);">Vérifiez tous les aspects essentiels avant de mettre votre site en ligne</p>
      </div>
      <div class="flex items-center justify-center gap-6 text-sm">
        <div class="text-center">
          <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ projectsStore.currentProjectScores?.completedItems || 0 }}</div>
          <div class="text-xs" style="color: var(--text-secondary);">sur {{ projectsStore.currentProjectScores?.totalItems || 44 }} complétés</div>
        </div>
        <div class="w-px h-8" style="background-color: var(--bg-border);"></div>
        <div class="text-center">
          <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ Math.round(projectsStore.currentProjectScores?.percentage || 0) }}%</div>
          <div class="text-xs" style="color: var(--text-secondary);">terminé</div>
        </div>
      </div>
    </div>

    <div v-if="isClient && currentProjectId" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div class="lg:col-span-2">
        <SeoChecklist ref="seoChecklist" :current-project-id="currentProjectId" @categories-loaded="handleCategoriesLoaded" />
      </div>
      <div class="lg:col-span-1">
        <!-- Desktop: accordéon visible par défaut -->
        <div class="hidden lg:block">
          <LighthouseAccordion :default-expanded="true" />
        </div>
        <!-- Mobile: accordéon replié, placé en dessous -->
        <div class="block lg:hidden">
          <LighthouseAccordion :default-expanded="false" />
        </div>
      </div>
    </div>

    <div v-else>
      <EmptyState @create-project="handleCreateFirstProject" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import EmptyState from '~/components/dashboard/EmptyState.vue'
import SeoChecklist from '~/components/checklist/SeoChecklist.vue'
import LighthouseAccordion from '~/components/dashboard/LighthouseAccordion.vue'

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
