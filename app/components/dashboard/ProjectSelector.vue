<template>
  <div class="relative">
    <!-- Skeleton pendant le chargement -->
    <SkeletonProjectSelector v-if="isLoading" />
    
    <!-- Bouton principal du dropdown -->
    <button
      v-else
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      class="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 hover:bg-opacity-80"
      style="background-color: var(--bg-primary); border-color: var(--bg-border); color: var(--text-primary);"
      :aria-label="$t('projects.selectProject')"
      :aria-expanded="isDropdownOpen"
      :aria-haspopup="true"
      role="combobox"
      tabindex="0"
    >
      <div class="flex items-center space-x-3 min-w-0 flex-1">
        <Icon name="heroicons:folder" class="w-4 h-4 flex-shrink-0" style="color: var(--accent-primary);" aria-hidden="true" />
        <span class="text-sm font-medium truncate">
          {{ displayText }}
        </span>
      </div>
      <Icon 
        name="heroicons:chevron-down" 
        class="w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2"
        :class="{ 'rotate-180': isDropdownOpen }"
        style="color: var(--text-secondary);"
        aria-hidden="true"
      />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute top-full left-0 right-0 mt-3 rounded-xl border z-50"
      style="background-color: var(--bg-surface); border-color: var(--bg-border);"
      role="listbox"
      :aria-label="$t('projects.projectList')"
    >
      <!-- Liste des projets -->
      <div v-if="projects.length > 0" class="py-2">
        <button
          v-for="project in projects"
          :key="project.id"
          @click="selectProject(project.id)"
          @keydown.enter="selectProject(project.id)"
          @keydown.space.prevent="selectProject(project.id)"
          class="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
          :style="{
            color: project.id === currentProjectId ? 'var(--accent-primary)' : 'var(--text-primary)',
            backgroundColor: project.id === currentProjectId ? 'var(--bg-border)' : 'transparent'
          }"
          :aria-selected="project.id === currentProjectId"
          role="option"
          tabindex="0"
          @mouseenter="$event.target.style.backgroundColor = 'var(--bg-border)'"
          @mouseleave="$event.target.style.backgroundColor = project.id === currentProjectId ? 'var(--bg-border)' : 'transparent'"
        >
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <Icon name="heroicons:folder" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ project.name }}</div>
              <div class="text-xs opacity-70 truncate">{{ project.description }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-3 ml-3 flex-shrink-0">
            <div class="text-xs text-right">
              <div class="font-medium" style="color: var(--accent-primary);">
                {{ projectsStore.getProjectScores(project.id).percentage }}%
              </div>
            </div>
            <div v-if="project.id === currentProjectId" class="flex items-center">
              <Icon name="heroicons:check" class="w-4 h-4" style="color: var(--accent-primary);" aria-hidden="true" />
            </div>
          </div>
        </button>
      </div>

      <!-- Séparateur -->
      <div v-if="projects.length > 0" class="border-t my-2" style="border-color: var(--bg-border);"></div>

      <!-- Actions -->
      <div class="py-2">
        <button
          @click="openCreateProjectModal"
          @keydown.enter="openCreateProjectModal"
          @keydown.space.prevent="openCreateProjectModal"
          class="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center space-x-3"
          style="color: var(--text-primary);"
          role="menuitem"
          tabindex="0"
          @mouseenter="$event.target.style.backgroundColor = 'var(--bg-border)'"
          @mouseleave="$event.target.style.backgroundColor = 'transparent'"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 flex-shrink-0" style="color: var(--accent-primary);" aria-hidden="true" />
          <span class="truncate">{{ $t('projects.createNew') }}</span>
        </button>
        
        <button
          v-if="projects.length > 0"
          @click="openDeleteProjectModal"
          @keydown.enter="openDeleteProjectModal"
          @keydown.space.prevent="openDeleteProjectModal"
          class="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center space-x-3"
          style="color: var(--text-danger);"
          role="menuitem"
          tabindex="0"
          @mouseenter="$event.target.style.backgroundColor = 'var(--bg-border)'"
          @mouseleave="$event.target.style.backgroundColor = 'transparent'"
        >
          <Icon name="heroicons:trash" class="w-4 h-4 flex-shrink-0" style="color: var(--text-danger);" aria-hidden="true" />
          <span class="truncate">{{ $t('projects.deleteCurrent') }}</span>
        </button>
      </div>
    </div>

    <!-- Modal de création de projet -->
    <Modal
      v-model:is-open="showCreateModal"
      :title="$t('projects.createTitle')"
      @close="closeCreateProjectModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary);">
            {{ $t('projects.name') }}
          </label>
          <input
            v-model="newProject.name"
            type="text"
            class="input w-full"
            :placeholder="$t('projects.namePlaceholder')"
            @keydown.enter="createProject"
          />
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary);">
            {{ $t('projects.description') }}
          </label>
          <textarea
            v-model="newProject.description"
            rows="3"
            class="input w-full resize-none"
            :placeholder="$t('projects.descriptionPlaceholder')"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button
          @click="closeCreateProjectModal"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border); color: var(--text-primary);"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="createProject"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style="background-color: var(--accent-primary); color: white;"
          :disabled="!newProject.name.trim()"
        >
          {{ $t('projects.create') }}
        </button>
      </template>
    </Modal>

    <!-- Modal de suppression de projet -->
    <Modal
      v-model:is-open="showDeleteModal"
      :title="$t('projects.deleteTitle')"
      @close="closeDeleteProjectModal"
    >
      <p class="text-sm" style="color: var(--text-secondary);">
        {{ $t('projects.deleteConfirm', { name: currentProject?.name }) }}
      </p>

      <template #footer>
        <button
          @click="closeDeleteProjectModal"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style="background-color: var(--bg-primary); border: 1px solid var(--bg-border); color: var(--text-primary);"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="deleteCurrentProject"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style="background-color: #dc2626; border-color: #dc2626; color: white;"
        >
          {{ $t('projects.delete') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import SkeletonProjectSelector from '../common/SkeletonProjectSelector.vue'
import Modal from '../common/Modal.vue'
import { useProjectsStore } from '~/stores/projects'

const emit = defineEmits(['project-changed'])
const projectsStore = useProjectsStore()
const { currentUser } = useAuth()

const isDropdownOpen = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isLoading = ref(false)
const isClient = ref(false)
const newProject = ref({ name: '', description: '' })

const currentProject = computed(() => projectsStore.currentProject)
const projects = computed(() => projectsStore.projects)
const currentProjectId = computed(() => projectsStore.currentProjectId)

const displayText = computed(() => {
  if (!isClient.value) return $t('projects.selectProject')
  return currentProject.value?.name || $t('projects.selectProject')
})

const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value }

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

const closeCreateProjectModal = () => { showCreateModal.value = false }

const createProject = async () => {
  if (!newProject.value.name.trim() || !currentUser.value) return
  const p = await projectsStore.addProjectRemote(currentUser.value.uid, {
    name: newProject.value.name.trim(),
    description: newProject.value.description.trim()
  })
  emit('project-changed', p.id)
  closeCreateProjectModal()
}

const openDeleteProjectModal = () => { showDeleteModal.value = true; isDropdownOpen.value = false }
const closeDeleteProjectModal = () => { showDeleteModal.value = false }

const deleteCurrentProject = async () => {
  if (!currentUser.value || !currentProjectId.value) return
  await projectsStore.deleteProjectRemote(currentUser.value.uid, currentProjectId.value)
  if (projects.value.length === 0) emit('project-changed', null)
  else emit('project-changed', projectsStore.currentProjectId)
  closeDeleteProjectModal()
}

const handleOutsideClick = (event) => {
  if (!event.target.closest('.relative')) isDropdownOpen.value = false
}

watch(projects, (newProjects) => {
  if (newProjects.length > 0 && isLoading.value) isLoading.value = false
}, { immediate: true })

onMounted(async () => {
  if (process.client) {
    isClient.value = true
    document.addEventListener('click', handleOutsideClick)
    if (currentUser.value && !projectsStore.isSynced) {
      await projectsStore.subscribeUserProjects(currentUser.value.uid)
    }
  }
})

onUnmounted(() => {
  if (process.client) document.removeEventListener('click', handleOutsideClick)
})
</script>
