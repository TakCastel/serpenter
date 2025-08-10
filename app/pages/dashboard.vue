<template>
  <div class="px-4 lg:px-6 py-6 w-full bg-[var(--bg-primary)]" :style="{ height: 'calc(100vh - 77px)' }">
    <!-- Header global avec titre, description et statistiques (visible seulement si projet sélectionné) -->
    <div v-if="isClient && currentProjectId && currentProject?.checklistType" class="card p-6 mb-6" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="text-center mb-2">
            <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Checklist Pré-Déploiement</h1>
            <p class="text-sm" style="color: var(--text-secondary);">Vérifiez tous les aspects essentiels avant de mettre votre site en ligne</p>
          </div>
        </div>
        
        <!-- Bouton de réinitialisation -->
        <button
          @click="resetChecklistProgress"
          class="flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:bg-opacity-90"
          :style="{
            backgroundColor: 'var(--button-bg)',
            borderColor: 'var(--button-border)',
            color: 'var(--text-primary)'
          }"
          :title="$t('app.progress.resetTitle')"
          :aria-label="$t('app.progress.resetDescription')"
        >
          <Icon name="heroicons:arrow-path" class="w-5 h-5" :style="{ color: 'var(--text-secondary)' }" aria-hidden="true" />
          <span class="text-sm font-semibold">{{ $t('app.progress.reset') }}</span>
        </button>
      </div>
      
      <div class="flex items-center justify-center gap-6 text-sm">
        <div class="text-center">
          <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ projectsStore.currentProjectScores?.completedItems || 0 }}</div>
          <div class="text-xs font-medium" style="color: var(--text-secondary);">sur {{ projectsStore.currentProjectScores?.totalItems || 44 }} complétés</div>
        </div>
        <div class="w-px h-8" style="background-color: var(--bg-border);"></div>
        <div class="text-center">
          <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ Math.round(projectsStore.currentProjectScores?.percentage || 0) }}%</div>
          <div class="text-xs font-medium" style="color: var(--text-secondary);">progression</div>
        </div>
      </div>
    </div>

    <div v-if="isClient && currentProjectId && currentProject?.checklistType" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div class="lg:col-span-2">
        <SeoChecklist
          ref="seoChecklist"
          :current-project-id="currentProjectId"
          :checklist-type="projectsStore.currentProject?.checklistType || 'web-prelaunch'"
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

  <!-- Modal de confirmation de réinitialisation -->
  <Modal
    v-model:is-open="showResetModal"
    :title="$t('app.progress.resetTitle')"
    @close="cancelReset"
  >
    <p class="text-base text-gray-600 dark:text-gray-300">
      {{ $t('app.progress.resetConfirm') }}
    </p>

    <template #footer>
      <button
        @click="cancelReset"
        class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="confirmReset"
        class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-emerald-500 text-white hover:bg-emerald-600"
      >
        {{ $t('app.progress.reset') }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import EmptyState from '~/components/dashboard/EmptyState.vue'
import SeoChecklist from '~/components/checklist/SeoChecklist.vue'
import LighthouseAccordion from '~/components/dashboard/LighthouseAccordion.vue'
import Modal from '~/components/common/Modal.vue'

definePageMeta({
  layout: 'dashboard'
})

const seoChecklist = ref(null)
const lighthouseAccordion = ref(null)
const lighthouseAccordionMobile = ref(null)
const isClient = ref(false)
const showResetModal = ref(false)
const projectsStore = useProjectsStore()
const hasProjects = computed(() => projectsStore.hasProjects)
const currentProjectId = computed(() => projectsStore.currentProjectId)
const currentProject = computed(() => projectsStore.currentProject)

// Redirection si le type de checklist n'est pas défini, uniquement s'il existe au moins un projet
watch([currentProject, hasProjects], ([p, has]) => {
  if (process.client && has && p && !p.checklistType) {
    navigateTo('/select-checklist')
  }
}, { immediate: true })

// Réinitialiser le Lighthouse quand le projet change
watch(currentProjectId, async (newProjectId, oldProjectId) => {
  if (process.client && newProjectId && newProjectId !== oldProjectId) {
    try {
      // Réinitialiser le Lighthouse desktop
      if (lighthouseAccordion.value) {
        await lighthouseAccordion.value.reset()
      }
      
      // Réinitialiser le Lighthouse mobile
      if (lighthouseAccordionMobile.value) {
        await lighthouseAccordionMobile.value.reset()
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du Lighthouse:', error)
    }
  }
})

// Écouter les changements de projet via les événements globaux
onMounted(() => {
  if (process.client) {
    isClient.value = true
    // Écouter l'événement de réinitialisation
    window.addEventListener('reset-checklist-progress', handleResetProgress)
  }
})


const handleCreateFirstProject = (project) => {
  // Projet créé avec succès
  if (project && !project.checklistType) {
    navigateTo('/select-checklist')
  }
}

const handleResetProgress = () => {
  if (seoChecklist.value && seoChecklist.value.resetProgress) {
    seoChecklist.value.resetProgress()
  }
}

const resetChecklistProgress = () => {
  showResetModal.value = true
}

const confirmReset = () => {
  if (seoChecklist.value && seoChecklist.value.resetProgress) {
    seoChecklist.value.resetProgress()
    // Émettre l'événement pour informer le layout de la réinitialisation
    window.dispatchEvent(new CustomEvent('reset-checklist-progress'))
  }
  showResetModal.value = false
}

const cancelReset = () => {
  showResetModal.value = false
}

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
