import { defineStore } from 'pinia'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProjectId: null,
    projectScores: {},
    checkedByProject: {}, // { [projectId]: Set<string> }
    isSynced: false
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
    },

    getCheckedSet: (state) => (projectId) => {
      const set = state.checkedByProject[projectId]
      return set ? new Set(set) : new Set()
    }
  },

  actions: {
    // Connexion Firestore (via plugin)
    _db() {
      const { $db } = useNuxtApp()
      return $db
    },

    // Charger tous les projets de l'utilisateur et s'abonner aux changements
    async subscribeUserProjects(userId) {
      if (!userId) return
      const db = this._db()
      const colRef = collection(db, 'users', userId, 'projects')
      // Snapshot en temps réel avec gestion d'erreur (permissions, etc.)
      onSnapshot(
        colRef,
        {
          next: (snap) => {
            const list = []
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }))
            this.projects = list.sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''))
            if (!this.currentProjectId && this.projects.length > 0) {
              this.currentProjectId = this.projects[0].id
            }
            this.isSynced = true
          },
          error: (error) => {
            console.error('Erreur abonnement projets (Firestore):', error)
            this.projects = []
            this.isSynced = false
          }
        }
      )
    },

    // Charger les checked items d'un projet
    async loadProjectChecked(userId, projectId) {
      const db = this._db()
      const docRef = doc(db, 'users', userId, 'projects', projectId, 'state', 'checked')
      const snap = await getDoc(docRef)
      const data = snap.exists() ? snap.data() : { items: [] }
      this.checkedByProject[projectId] = new Set(data.items || [])
    },

    // Sauvegarder les checked items d'un projet
    async saveProjectChecked(userId, projectId) {
      const db = this._db()
      const docRef = doc(db, 'users', userId, 'projects', projectId, 'state', 'checked')
      const items = Array.from(this.getCheckedSet(projectId))
      await setDoc(docRef, { items }, { merge: true })
    },

    // Gestion des projets
    async addProjectRemote(userId, project) {
      const db = this._db()
      const colRef = collection(db, 'users', userId, 'projects')
      const now = new Date().toISOString()
      const payload = {
        name: project.name,
        description: project.description || '',
        checklistType: project.checklistType || null,
        createdAt: now,
        lastModified: now
      }
      const created = await addDoc(colRef, payload)
      this.currentProjectId = created.id
      return { id: created.id, ...payload }
    },

    async updateProjectRemote(userId, projectId, updates) {
      const db = this._db()
      const docRef = doc(db, 'users', userId, 'projects', projectId)
      await updateDoc(docRef, { ...updates, lastModified: new Date().toISOString() })
    },

    async deleteProjectRemote(userId, projectId) {
      const db = this._db()
      const docRef = doc(db, 'users', userId, 'projects', projectId)
      await deleteDoc(docRef)
      // État local ajusté par le snapshot
      delete this.projectScores[projectId]
      delete this.checkedByProject[projectId]
      if (this.currentProjectId === projectId) {
        this.currentProjectId = this.projects.length > 0 ? this.projects[0].id : null
      }
    },

    // Actions locales (optionnelles)
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

    // Checked items helpers (local state)
    setCheckedForProject(projectId, set) {
      this.checkedByProject[projectId] = new Set(set)
    },
    addCheckedItem(projectId, itemId) {
      const set = this.getCheckedSet(projectId)
      set.add(itemId)
      this.checkedByProject[projectId] = set
    },
    removeCheckedItem(projectId, itemId) {
      const set = this.getCheckedSet(projectId)
      set.delete(itemId)
      this.checkedByProject[projectId] = set
    }
  }
})
