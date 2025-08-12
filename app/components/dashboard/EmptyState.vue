<template>
  <div class="flex flex-col items-center justify-center w-full px-4 py-12">
    <div class="text-center w-full max-w-md">
      <!-- Icône -->
      <div class="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style="background-color: var(--bg-border);">
        <Icon name="fluent-emoji:snake" class="w-8 h-8" style="color: var(--accent-primary);" aria-hidden="true" />
      </div>
      
      <!-- Titre -->
      <h1 class="text-2xl font-bold mb-3 transition-colors duration-200 tracking-tight" style="color: var(--text-primary);">
        {{ $t('emptyState.title') }}
      </h1>
      
      <!-- Description -->
      <p class="text-sm mb-6 transition-colors duration-200 leading-relaxed max-w-sm mx-auto" style="color: var(--text-secondary);">
        {{ $t('emptyState.description') }}
      </p>

      
      
      <!-- Formulaire de création de projet -->
      <div class="w-full mx-auto space-y-4">
        <div>
          <label for="project-name" class="block text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
            {{ $t('projects.name') }}
          </label>
          <input
            id="project-name"
            v-model="projectName"
            type="text"
            :placeholder="$t('projects.namePlaceholder')"
            class="input w-full h-10"
            @keydown.enter="createProject"
          />
        </div>
        
        <div>
          <label for="project-description" class="block text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
            {{ $t('projects.description') }}
          </label>
          <textarea
            id="project-description"
            v-model="projectDescription"
            :placeholder="$t('projects.descriptionPlaceholder')"
            rows="3"
            class="input w-full h-20 resize-none"
          ></textarea>
        </div>
        
        <!-- Bouton d'action -->
        <button
          @click="createProject"
          @keydown.enter="createProject"
          @keydown.space.prevent="createProject"
          :disabled="!projectName.trim()"
          class="btn btn-primary w-full h-10 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          :aria-label="$t('emptyState.createButton')"
          role="button"
          tabindex="0"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 inline mr-2" aria-hidden="true" />
          {{ $t('emptyState.createButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '~/stores/projects'

const emit = defineEmits(['create-project'])
const projectsStore = useProjectsStore()
const { currentUser } = useAuth()

const projectName = ref('')
const projectDescription = ref('')
const checklistType = ref(null)

const createProject = async () => {
  if (!projectName.value.trim() || !currentUser.value) return

  try {
    const project = await projectsStore.addProjectRemote(currentUser.value.uid, {
      name: projectName.value.trim(),
      description: projectDescription.value.trim(),
      checklistType: checklistType.value
    })

    // Forcer la mise à jour du projet courant dans le store
    projectsStore.setCurrentProject(project.id)

    // Émettre l'événement vers le parent
    emit('create-project', project)

    // Naviguer vers la sélection de checklist si nécessaire
    if (!project.checklistType) {
      await navigateTo('/select-checklist')
    }
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
  }
}
</script>
