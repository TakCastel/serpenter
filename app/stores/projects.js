import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProjectId: null,
    projectScores: {}
  }),

  getters: {
    currentProject: (state) => {
      return state.projects.find(p => p.id === state.currentProjectId)
    },
    
    hasProjects: (state) => {
      return state.projects.length > 0
    },
    
    getProjectScores: (state) => (projectId) => {
      if (!projectId) return { totalItems: 0, completedItems: 0, percentage: 0 }
      return state.projectScores[projectId] || {
        totalItems: 0,
        completedItems: 0,
        percentage: 0
      }
    },
    
    currentProjectScores: (state) => {
      if (!state.currentProjectId) return { totalItems: 0, completedItems: 0, percentage: 0 }
      return state.projectScores[state.currentProjectId] || {
        totalItems: 0,
        completedItems: 0,
        percentage: 0
      }
    }
  },

  actions: {
    // Gestion des projets
    addProject(project) {
      this.projects.push(project)
      this.currentProjectId = project.id
    },

    updateProject(projectId, updates) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        Object.assign(project, updates, {
          lastModified: new Date().toISOString()
        })
      }
    },

    deleteProject(projectId) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index > -1) {
        this.projects.splice(index, 1)
        
        // Supprimer les scores du projet
        delete this.projectScores[projectId]
        
        // Si c'était le projet actuel, sélectionner le premier disponible ou null
        if (this.currentProjectId === projectId) {
          this.currentProjectId = this.projects.length > 0 ? this.projects[0].id : null
        }
      }
    },

    setCurrentProject(projectId) {
      if (this.projects.find(p => p.id === projectId)) {
        this.currentProjectId = projectId
      }
    },

    // Gestion des scores
    updateProjectScores(projectId, totalItems, completedItems) {
      const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
      this.projectScores[projectId] = {
        totalItems,
        completedItems,
        percentage
      }
    },

    resetProjectScores(projectId) {
      this.projectScores[projectId] = {
        totalItems: 0,
        completedItems: 0,
        percentage: 0
      }
    },

    calculateScoresFromItems(projectId, allItems, checkedItems) {
      const totalItems = allItems.length
      const completedItems = checkedItems.size
      this.updateProjectScores(projectId, totalItems, completedItems)
    },

    // Actions utilitaires
    createProject(name, description = '') {
      const project = {
        id: `project-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      
      this.addProject(project)
      
      // Initialiser les scores du nouveau projet à 0
      this.resetProjectScores(project.id)
      
      return project
    },

    // Réinitialiser tous les scores
    resetAllScores() {
      this.projectScores = {}
    }
  },

  persist: {
    key: 'serpenter-projects',
    paths: ['projects', 'currentProjectId', 'projectScores']
  }
})
