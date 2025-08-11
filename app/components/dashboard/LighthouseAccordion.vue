<template>
  <div class="card" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
    <!-- Header -->
    <button 
      @click="toggleExpanded" 
      :disabled="projectType === 'appstore-preflight'"
      class="w-full p-4 flex items-center justify-between rounded-xl transition-all duration-300" 
      :class="[
        projectType === 'appstore-preflight' 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-opacity-80'
      ]"
      :aria-expanded="expanded" 
      :aria-controls="'lh-content'" 
      style="background-color: var(--bg-surface);"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: var(--bg-primary); border: 1px solid var(--bg-border);">
          <Icon name="heroicons:bolt" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" />
        </div>
        <div class="text-left">
          <div class="text-base font-semibold" style="color: var(--text-primary);">Audit Lighthouse</div>
          <div class="text-xs" style="color: var(--text-secondary);">
            {{ 
              projectType === 'appstore-preflight' ? 'Non disponible pour les projets mobiles' :
              projectType === 'security-checker' ? 'Non disponible pour les projets de sécurité' :
              'Analyse rapide d\'une URL (mobile/desktop)' 
            }}
          </div>
        </div>
      </div>
      <Icon :name="expanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
    </button>

    <!-- Content -->
    <div :id="'lh-content'" class="border-t transition-all duration-500 ease-out overflow-hidden" style="border-color: var(--bg-border); background-color: var(--bg-primary);" :class="{ 'max-h-0 opacity-0 -translate-y-1': !expanded, 'max-h-[5000px] opacity-100 translate-y-0': expanded }">
      <div class="p-4">
        <LighthousePanel ref="lighthousePanel" @items-autochecked="onItemsAutoChecked" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import LighthousePanel from '~/components/dashboard/LighthousePanel.vue'
import { useProjectsStore } from '~/stores/projects'

// Props pour contrôler l'état depuis l'extérieur
const props = defineProps<{
  defaultExpanded?: boolean
  projectType?: string
}>()

const { currentUser } = useAuth()
const projectsStore = useProjectsStore()

const expanded = ref(props.defaultExpanded ?? true)
const lighthousePanel = ref()

// Écouter les changements de type de projet
watch(() => props.projectType, (newType) => {
  if (newType === 'appstore-preflight' || newType === 'security-checker') {
    // Fermer le Lighthouse pour les projets mobiles et de sécurité
    expanded.value = false
  } else if (props.defaultExpanded) {
    // Rouvrir pour les autres types
    expanded.value = true
  }
}, { immediate: true })

// Méthode pour fermer depuis l'extérieur
const close = () => {
  expanded.value = false
}

// Méthode pour réinitialiser depuis l'extérieur
const reset = async () => {
  expanded.value = false
  await nextTick()
  if (lighthousePanel.value) {
    lighthousePanel.value.reset()
  }
}

const toggleExpanded = () => {
  if (props.projectType === 'appstore-preflight' || props.projectType === 'security-checker') {
    return // Ne rien faire pour les projets mobiles et de sécurité
  }
  expanded.value = !expanded.value
}

const onItemsAutoChecked = async (itemIds: string[]) => {
  try {
    const projectId = projectsStore.currentProjectId
    if (!projectId || !currentUser?.value) return
    const set = projectsStore.getCheckedSet(projectId)
    itemIds.forEach(id => set.add(id))
    projectsStore.setCheckedForProject(projectId, set)
      await projectsStore.saveProjectChecked(currentUser.value.uid, projectId)
      if (process.client) {
        window.dispatchEvent(new CustomEvent('checked-items-updated', { detail: { projectId, itemIds } }))
      }
  } catch (e) {
    // noop
  }
}

// Exposer les méthodes pour l'utilisation externe
defineExpose({
  close,
  reset,
  expanded: computed(() => expanded.value)
})
</script>

