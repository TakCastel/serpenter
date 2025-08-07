<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 py-12">
    <div class="text-center max-w-2xl">
      <!-- Icône -->
      <div class="w-40 h-40 mx-auto mb-12 rounded-3xl flex items-center justify-center" style="background-color: var(--bg-border);">
        <Icon name="fluent-emoji:snake" class="w-20 h-20" style="color: var(--accent-primary);" aria-hidden="true" />
      </div>
      
      <!-- Titre -->
      <h1 class="text-5xl font-bold mb-8 transition-colors duration-200 tracking-tight" style="color: var(--text-primary);">
        {{ $t('emptyState.title') }}
      </h1>
      
      <!-- Description -->
      <p class="text-xl mb-16 transition-colors duration-200 leading-relaxed max-w-xl mx-auto" style="color: var(--text-secondary);">
        {{ $t('emptyState.description') }}
      </p>
      
      <!-- Formulaire de création de projet -->
      <div class="max-w-lg mx-auto space-y-8">
        <div>
          <label for="project-name" class="block text-base font-semibold mb-3 transition-colors duration-200" style="color: var(--text-primary);">
            {{ $t('projects.name') }}
          </label>
          <input
            id="project-name"
            v-model="projectName"
            type="text"
            :placeholder="$t('projects.namePlaceholder')"
            class="input w-full"
            @keydown.enter="createProject"
          />
        </div>
        
        <div>
          <label for="project-description" class="block text-base font-semibold mb-3 transition-colors duration-200" style="color: var(--text-primary);">
            {{ $t('projects.description') }}
          </label>
          <textarea
            id="project-description"
            v-model="projectDescription"
            :placeholder="$t('projects.descriptionPlaceholder')"
            rows="4"
            class="input w-full resize-none"
          ></textarea>
        </div>
        
        <!-- Bouton d'action -->
        <button
          @click="createProject"
          @keydown.enter="createProject"
          @keydown.space.prevent="createProject"
          :disabled="!projectName.trim()"
          class="btn btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          :aria-label="$t('emptyState.createButton')"
          role="button"
          tabindex="0"
        >
          <Icon name="heroicons:plus" class="w-6 h-6 inline mr-3" aria-hidden="true" />
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

const projectName = ref('')
const projectDescription = ref('')

const createProject = () => {
  if (projectName.value.trim()) {
    const project = projectsStore.createProject(projectName.value.trim(), projectDescription.value.trim())
    console.log('Projet créé:', project)
    emit('create-project', project)
  }
}
</script>
