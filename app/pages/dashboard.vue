<template>
  <div class="px-4 lg:px-6 py-6 w-full bg-[var(--bg-primary)]" :style="{ height: 'calc(100vh - 77px)' }">
    <!-- Header global avec titre, description et statistiques (visible seulement si projet sélectionné) -->
    <div v-if="isClient && currentProjectId && currentProject?.checklistType" class="card p-6 mb-6" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
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

    <div v-if="isClient && currentProjectId && currentProject?.checklistType" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div class="lg:col-span-2">
        <SeoChecklist
          ref="seoChecklist"
          :current-project-id="currentProjectId"
          :checklist-type="projectsStore.currentProject?.checklistType || 'web-prelaunch'"
          :categories="categories"
        />
      </div>
      <div class="lg:col-span-1">
        <!-- Desktop: accordéon visible par défaut -->
        <div class="hidden lg:block">
          <LighthouseAccordion 
            ref="lighthouseAccordion"
            :default-expanded="currentProject?.checklistType !== 'appstore-preflight'"
            :project-type="currentProject?.checklistType"
          />
        </div>
        <!-- Mobile: accordéon replié, placé en dessous -->
        <div class="block lg:hidden">
          <LighthouseAccordion 
            ref="lighthouseAccordionMobile"
            :default-expanded="false"
            :project-type="currentProject?.checklistType"
          />
        </div>
      </div>
    </div>

    <div v-else class="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <EmptyState @create-project="handleCreateFirstProject" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import { useCategoriesStore } from '~/stores/categories'
import EmptyState from '~/components/dashboard/EmptyState.vue'
import SeoChecklist from '~/components/checklist/SeoChecklist.vue'
import LighthouseAccordion from '~/components/dashboard/LighthouseAccordion.vue'

definePageMeta({
  layout: 'dashboard'
})

const seoChecklist = ref(null)
const lighthouseAccordion = ref(null)
const lighthouseAccordionMobile = ref(null)
const isClient = ref(false)
const projectsStore = useProjectsStore()
const categoriesStore = useCategoriesStore()
const hasProjects = computed(() => projectsStore.hasProjects)
const currentProjectId = computed(() => projectsStore.currentProjectId)
const currentProject = computed(() => projectsStore.currentProject)
const categories = computed(() => categoriesStore.categories)

// Redirection si le type de checklist n'est pas défini, uniquement s'il existe au moins un projet
watch([currentProject, hasProjects], ([p, has]) => {
  if (process.client && has && p && !p.checklistType) {
    navigateTo('/select-checklist')
  }
}, { immediate: true })

// Réinitialiser le Lighthouse et charger les catégories quand le projet change
watch(currentProjectId, async (newProjectId, oldProjectId) => {
  if (process.client && newProjectId && newProjectId !== oldProjectId) {
    // Charger les catégories pour le nouveau projet
    if (currentProject.value?.checklistType) {
      categoriesStore.loadCategoriesForProject(currentProject.value.checklistType)
    }
    
    // Réinitialiser le Lighthouse desktop
    if (lighthouseAccordion.value) {
      await lighthouseAccordion.value.reset()
    }
    
    // Réinitialiser le Lighthouse mobile
    if (lighthouseAccordionMobile.value) {
      await lighthouseAccordionMobile.value.reset()
    }
  }
})



const handleCreateFirstProject = (project) => {
  // Projet créé avec succès
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
