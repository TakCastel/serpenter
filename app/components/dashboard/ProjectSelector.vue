<template>
  <div class="project-selector">
    <!-- Dropdown simple pour switcher de projet -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
        :style="{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--bg-border)',
          color: 'var(--text-primary)',
          focusRingColor: 'var(--accent-color)'
        }"
        data-cy="project-selector"
      >
        <span class="font-medium truncate">
          {{ currentProject ? currentProject.name : 'Sélectionner un projet' }}
        </span>
        <Icon
          name="heroicons:chevron-down"
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          :style="{ color: 'var(--text-secondary)' }"
          aria-hidden="true"
        />
      </button>

      <!-- Dropdown des projets -->
      <div
        v-if="isDropdownOpen"
        class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border"
        :style="{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--bg-border)'
        }"
        data-cy="project-dropdown"
      >
        <!-- Liste des projets -->
        <div class="py-1">
          <button
            v-for="project in projects"
            :key="project.id"
            @click="selectProject(project.id)"
            class="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors duration-200"
            :class="{
              'border-l-2 opacity-80': project.id === currentProject?.id,
              'hover:opacity-80': project.id !== currentProject?.id
            }"
            :style="{
              color: 'var(--text-primary)',
              backgroundColor: project.id === currentProject?.id ? 'var(--accent-color)' : 'transparent',
              borderLeftColor: project.id === currentProject?.id ? 'var(--accent-color)' : 'transparent'
            }"
            data-cy="project-option"
          >
            <span class="truncate font-medium">{{ project.name }}</span>
            <span v-if="getProjectScores(project.id)" class="text-xs ml-2 px-2 py-1 rounded-full transition-colors duration-200" :style="{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }">
              {{ Math.round(getProjectScores(project.id).percentage) }}%
            </span>
          </button>
        </div>

        <!-- Actions dans le dropdown -->
        <div class="border-t py-1" :style="{ borderColor: 'var(--bg-border)' }">
          <!-- Bouton ajouter -->
          <button
            @click="createProject"
            class="w-full flex items-center px-3 py-2 text-sm transition-colors duration-200 hover:opacity-80 group"
            :style="{
              color: 'var(--text-primary)'
            }"
            data-cy="add-project-button"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" :style="{ color: 'var(--accent-color)' }" aria-hidden="true" />
            <span>Ajouter un projet</span>
          </button>

          <!-- Bouton supprimer le projet courant -->
          <button
            v-if="currentProject"
            @click="deleteCurrentProject"
            class="w-full flex items-center px-3 py-2 text-sm transition-colors duration-200 hover:opacity-80 group"
            :style="{
              color: 'var(--text-secondary)'
            }"
            data-cy="delete-project-button"
          >
            <Icon name="heroicons:trash" class="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" :style="{ color: 'var(--danger-color)' }" aria-hidden="true" />
            <span>Supprimer {{ currentProject.name }}</span>
          </button>
        </div>
      </div>
    </div>

     <!-- Modal commune pour créer un projet -->
     <Modal
       v-model:is-open="showCreateModal"
       title="Créer un projet"
       :close-on-backdrop="!isCreatingProject"
       :close-on-escape="!isCreatingProject"
       @close="!isCreatingProject && (showCreateModal = false)"
     >
       <div class="space-y-4">
         <div>
           <label for="project-name" class="block text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
             Nom du projet
           </label>
           <input
             v-model="newProjectName"
             type="text"
             class="w-full px-3 py-2 text-sm rounded-lg border transition-colors duration-200"
             :style="{
               backgroundColor: 'var(--bg-surface)',
               borderColor: 'var(--bg-border)',
               color: 'var(--text-primary)'
             }"
             placeholder="Nom du projet"
             data-cy="project-name-input"
           />
         </div>

         <div>
           <label for="project-description" class="block text-sm font-semibold mb-2 transition-colors duration-200" style="color: var(--text-primary);">
             Description
           </label>
           <textarea
             v-model="newProjectDescription"
             rows="3"
             class="w-full px-3 py-2 text-sm rounded-lg border resize-none transition-colors duration-200"
             :style="{
               backgroundColor: 'var(--bg-surface)',
               borderColor: 'var(--bg-border)',
               color: 'var(--text-primary)'
             }"
             placeholder="Description du projet (optionnel)"
             data-cy="project-description-input"
           />
         </div>
       </div>

       <template #footer>
         <button
           @click="showCreateModal = false"
           :disabled="isCreatingProject"
           class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           Annuler
         </button>
         <button
           @click="handleCreateProject"
           :disabled="!newProjectName.trim() || isCreatingProject"
           class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
           data-cy="create-project-button"
         >
           <Icon v-if="isCreatingProject" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
           <Icon v-else name="heroicons:plus" class="w-4 h-4" />
           <span>{{ isCreatingProject ? 'Création...' : 'Créer' }}</span>
         </button>
       </template>
     </Modal>

     <!-- Modal de confirmation pour suppression/réinitialisation -->
     <Modal
       v-model:is-open="showDeleteModal"
       title="Êtes-vous sûr ?"
       @close="showDeleteModal = false"
     >
       <div>
         <p class="text-gray-700 dark:text-gray-300">
           Attention, cette action va supprimer définitivement le projet <strong>{{ currentProject?.name }}</strong>.
         </p>
       </div>

       <template #footer>
         <button
           @click="showDeleteModal = false"
           class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
         >
           Annuler
         </button>
         <button
           @click="handleDeleteProject"
           class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-red-500 text-white hover:bg-red-600"
         >
           Confirmer
         </button>
       </template>
     </Modal>
   </div>
 </template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Modal from '~/components/common/Modal.vue'

const props = defineProps({
  currentProjectId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['project-changed', 'create-project'])

// État local
const isDropdownOpen = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const newProjectName = ref('')
const newProjectDescription = ref('')
const isProcessing = ref(false)
const isCreatingProject = ref(false)

// Store des projets
const projectsStore = useProjectsStore()

// Auth
const { user } = useAuth()

// Computed properties
const projects = computed(() => projectsStore.projects)
const currentProject = computed(() => projectsStore.currentProject)

// Initialiser la sélection
watch(() => props.currentProjectId, (newId) => {
  if (newId && newId !== projectsStore.currentProjectId) {
    projectsStore.setCurrentProject(newId)
  }
}, { immediate: true })

// Synchroniser avec le store
watch(() => projectsStore.currentProjectId, (newId) => {
  if (newId && newId !== props.currentProjectId) {
    emit('project-changed', newId)
  }
}, { immediate: true })

// Gestion du dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Sélectionner un projet
const selectProject = async (projectId) => {
  if (!projectId) return
  
  try {
    // Mettre à jour le store immédiatement
    projectsStore.setCurrentProject(projectId)
    
    // Émettre l'événement de changement
    emit('project-changed', projectId)
    
    // Fermer le dropdown
    isDropdownOpen.value = false
    
    // Attendre un peu pour laisser Firebase se synchroniser
    await new Promise(resolve => setTimeout(resolve, 100))
    
  } catch (error) {
    console.error('Erreur lors de la sélection du projet:', error)
  }
}

// Créer un projet
const createProject = () => {
  showCreateModal.value = true
}

// Créer le projet
const handleCreateProject = async () => {
  if (!newProjectName.value.trim()) return
  if (!user.value?.uid) {
    console.error('Utilisateur non connecté')
    return
  }
  
  try {
    isCreatingProject.value = true
    const project = await projectsStore.addProjectRemote(user.value.uid, {
      name: newProjectName.value.trim(),
      description: newProjectDescription.value.trim()
    })
    
    // Réinitialiser et fermer
    newProjectName.value = ''
    newProjectDescription.value = ''
    showCreateModal.value = false
    
    // Sélectionner le nouveau projet
    await selectProject(project.id)
    emit('create-project', project)
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
  } finally {
    isCreatingProject.value = false
  }
}

// Supprimer le projet courant
const deleteCurrentProject = () => {
  if (!currentProject.value) return
  showDeleteModal.value = true
}

// Supprimer définitivement le projet
const handleDeleteProject = async () => {
  if (!currentProject.value || !user.value?.uid) return
  
  try {
    isProcessing.value = true
    
    const projectId = currentProject.value.id
    
    // Fermer la modal d'abord
    showDeleteModal.value = false
    
    // Supprimer localement d'abord pour éviter les sauvegardes automatiques
    projectsStore.removeProject(projectId)
    
    // Supprimer de Firebase ensuite
    await projectsStore.removeProjectRemote(user.value.uid, projectId)
    
    // Sélectionner le premier projet disponible après un court délai
    if (projects.value.length > 0) {
      setTimeout(() => {
        selectProject(projects.value[0].id)
      }, 100)
    }
    
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
    // En cas d'erreur, rouvrir la modal
    showDeleteModal.value = true
  } finally {
    isProcessing.value = false
  }
}

// Obtenir les scores d'un projet
const getProjectScores = (projectId) => {
  return projectsStore.getProjectScores(projectId)
}

// Gestion des clics à l'extérieur
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest('.project-selector')) {
    isDropdownOpen.value = false
  }
}

// Initialisation
onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleClickOutside)
    
    // Initialiser la synchronisation Firebase si l'utilisateur est connecté
    if (user.value?.uid) {
      projectsStore.initializeFirebaseSync(user.value.uid)
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.project-selector {
  @apply w-full;
}

/* Animation des icônes au hover */
.project-selector button:hover .icon {
  transform: scale(1.1);
}
</style>
