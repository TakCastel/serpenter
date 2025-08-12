import { ref, computed } from 'vue'

export const useProjectScores = () => {
  const projectScores = ref({})

  // Charger les scores depuis localStorage
  const loadScores = (projectId) => {
    if (process.client) {
      try {
        const saved = localStorage.getItem(`project-scores-${projectId}`)
        if (saved) {
          projectScores.value[projectId] = JSON.parse(saved)
        }
      } catch (error) {
        // Erreur lors du chargement des scores
      }
    }
  }

  // Sauvegarder les scores dans localStorage
  const saveScores = (projectId, scores) => {
    if (process.client) {
      try {
        projectScores.value[projectId] = scores
        localStorage.setItem(`project-scores-${projectId}`, JSON.stringify(scores))
      } catch (error) {
        // Erreur lors de la sauvegarde des scores
      }
    }
  }

  // Obtenir les scores d'un projet
  const getProjectScores = (projectId) => {
    if (!projectScores.value[projectId]) {
      loadScores(projectId)
    }
    return projectScores.value[projectId] || {
      totalItems: 0,
      completedItems: 0,
      percentage: 0
    }
  }

  // Mettre à jour les scores d'un projet
  const updateProjectScores = (projectId, totalItems, completedItems) => {
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    const scores = {
      totalItems,
      completedItems,
      percentage
    }
    saveScores(projectId, scores)
    return scores
  }

  // Réinitialiser les scores d'un projet
  const resetProjectScores = (projectId) => {
    const scores = {
      totalItems: 0,
      completedItems: 0,
      percentage: 0
    }
    saveScores(projectId, scores)
    return scores
  }

  // Calculer les scores à partir des items cochés
  const calculateScoresFromItems = (projectId, allItems, checkedItems) => {
    const totalItems = allItems.length
    const completedItems = checkedItems.size
    return updateProjectScores(projectId, totalItems, completedItems)
  }

  return {
    getProjectScores,
    updateProjectScores,
    resetProjectScores,
    calculateScoresFromItems
  }
}
