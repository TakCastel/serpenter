<template>
  <div class="relative">
    <!-- Bouton principal du dropdown -->
    <button
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      class="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 hover:opacity-80"
      :style="{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--bg-border)',
        color: 'var(--text-primary)'
      }"
      :aria-label="$t('projects.selectProject')"
      :aria-expanded="isDropdownOpen"
      :aria-haspopup="true"
      role="combobox"
      tabindex="0"
    >
      <div class="flex items-center space-x-2">
        <Icon name="heroicons:folder" class="w-4 h-4" style="color: var(--accent-primary);" aria-hidden="true" />
        <span class="text-sm font-medium truncate">
          {{ currentProject?.name || $t('projects.noProject') }}
        </span>
      </div>
      <Icon 
        name="heroicons:chevron-down" 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isDropdownOpen }"
        style="color: var(--text-secondary);"
        aria-hidden="true"
      />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50"
      :style="{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--bg-border)'
      }"
      role="listbox"
      :aria-label="$t('projects.projectList')"
    >
      <!-- Liste des projets -->
      <div v-if="projects.length > 0" class="py-1">
        <button
          v-for="project in projects"
          :key="project.id"
          @click="selectProject(project.id)"
          @keydown.enter="selectProject(project.id)"
          @keydown.space.prevent="selectProject(project.id)"
          class="w-full text-left px-3 py-2 text-sm transition-colors duration-200 hover:opacity-80 flex items-center justify-between"
          :style="{
            color: project.id === currentProjectId ? 'var(--accent-primary)' : 'var(--text-primary)',
            backgroundColor: project.id === currentProjectId ? 'var(--bg-border)' : 'transparent'
          }"
          :aria-selected="project.id === currentProjectId"
          role="option"
          tabindex="0"
        >
                     <div class="flex items-center space-x-2">
             <Icon name="heroicons:folder" class="w-4 h-4" aria-hidden="true" />
             <div class="flex-1 min-w-0">
               <div class="font-medium truncate">{{ project.name }}</div>
               <div class="text-xs opacity-70 truncate">{{ project.description }}</div>
             </div>
           </div>
                       <div class="flex items-center space-x-2 ml-2">
              <div class="text-xs text-right">
                <div class="font-medium" style="color: var(--accent-primary);">
                  {{ projectsStore.getProjectScores(project.id).percentage }}%
                </div>
              </div>
            </div>
          <div v-if="project.id === currentProjectId" class="flex items-center space-x-1">
            <Icon name="heroicons:check" class="w-4 h-4" style="color: var(--accent-primary);" aria-hidden="true" />
          </div>
        </button>
      </div>

      <!-- Séparateur -->
      <div v-if="projects.length > 0" class="border-t my-1" style="border-color: var(--bg-border);"></div>

      <!-- Actions -->
      <div class="py-1">
        <button
          @click="openCreateProjectModal"
          @keydown.enter="openCreateProjectModal"
          @keydown.space.prevent="openCreateProjectModal"
          class="w-full text-left px-3 py-2 text-sm transition-colors duration-200 hover:opacity-80 flex items-center space-x-2"
          style="color: var(--text-primary);"
          role="menuitem"
          tabindex="0"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" style="color: var(--accent-primary);" aria-hidden="true" />
          <span>{{ $t('projects.createNew') }}</span>
        </button>
        
        <button
          v-if="projects.length > 1"
          @click="openDeleteProjectModal"
          @keydown.enter="openDeleteProjectModal"
          @keydown.space.prevent="openDeleteProjectModal"
          class="w-full text-left px-3 py-2 text-sm transition-colors duration-200 hover:opacity-80 flex items-center space-x-2"
          style="color: var(--text-danger);"
          role="menuitem"
          tabindex="0"
        >
          <Icon name="heroicons:trash" class="w-4 h-4" style="color: var(--text-danger);" aria-hidden="true" />
          <span>{{ $t('projects.deleteCurrent') }}</span>
        </button>
      </div>
    </div>

    <!-- Modal de création de projet -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeCreateProjectModal"
    >
      <div
        @click.stop
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        style="background-color: var(--bg-surface);"
      >
        <h3 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">
          {{ $t('projects.createTitle') }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
              {{ $t('projects.name') }}
            </label>
            <input
              v-model="newProject.name"
              type="text"
              class="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
              :style="{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--bg-border)',
                color: 'var(--text-primary)'
              }"
              :placeholder="$t('projects.namePlaceholder')"
              @keydown.enter="createProject"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
              {{ $t('projects.description') }}
            </label>
            <textarea
              v-model="newProject.description"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border transition-colors duration-200"
              :style="{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--bg-border)',
                color: 'var(--text-primary)'
              }"
              :placeholder="$t('projects.descriptionPlaceholder')"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="closeCreateProjectModal"
            class="px-4 py-2 rounded-lg transition-colors duration-200"
            style="background-color: var(--bg-border); color: var(--text-primary);"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="createProject"
            class="px-4 py-2 rounded-lg transition-colors duration-200"
            style="background-color: var(--accent-primary); color: var(--bg-primary);"
            :disabled="!newProject.name.trim()"
          >
            {{ $t('projects.create') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de suppression de projet -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeDeleteProjectModal"
    >
      <div
        @click.stop
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        style="background-color: var(--bg-surface);"
      >
        <h3 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">
          {{ $t('projects.deleteTitle') }}
        </h3>
        
        <p class="mb-6" style="color: var(--text-secondary);">
          {{ $t('projects.deleteConfirm', { name: currentProject?.name }) }}
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteProjectModal"
            class="px-4 py-2 rounded-lg transition-colors duration-200"
            style="background-color: var(--bg-border); color: var(--text-primary);"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="deleteCurrentProject"
            class="px-4 py-2 rounded-lg transition-colors duration-200"
            style="background-color: var(--text-danger); color: white;"
          >
            {{ $t('projects.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'

const emit = defineEmits(['project-changed'])
const projectsStore = useProjectsStore()

const isDropdownOpen = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const newProject = ref({
  name: '',
  description: ''
})

const currentProject = computed(() => projectsStore.currentProject)
const projects = computed(() => projectsStore.projects)
const currentProjectId = computed(() => projectsStore.currentProjectId)

// Les projets sont maintenant gérés par le store Pinia
// Pas besoin de charger/sauvegarder manuellement

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectProject = (projectId) => {
  projectsStore.setCurrentProject(projectId)
  isDropdownOpen.value = false
  emit('project-changed', projectId)
}

const openCreateProjectModal = () => {
  showCreateModal.value = true
  isDropdownOpen.value = false
  newProject.value = { name: '', description: '' }
}

const closeCreateProjectModal = () => {
  showCreateModal.value = false
}

const createProject = () => {
  if (!newProject.value.name.trim()) return
  
  const project = projectsStore.createProject(
    newProject.value.name.trim(),
    newProject.value.description.trim()
  )
  
  emit('project-changed', project.id)
  closeCreateProjectModal()
}

const openDeleteProjectModal = () => {
  showDeleteModal.value = true
  isDropdownOpen.value = false
}

const closeDeleteProjectModal = () => {
  showDeleteModal.value = false
}

const deleteCurrentProject = () => {
  projectsStore.deleteProject(currentProjectId.value)
  emit('project-changed', projectsStore.currentProjectId)
  closeDeleteProjectModal()
}

const handleOutsideClick = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleOutsideClick)
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleOutsideClick)
  }
})
</script>
