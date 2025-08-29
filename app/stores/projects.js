import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useProjectsStore = defineStore("projects", () => {
  // État des projets
  const projects = ref([]);
  const currentProjectId = ref(null);
  const projectScores = ref({});
  const projectCheckedItems = ref({});
  const isSynced = ref(false);
  const isLoading = ref(false); // Un seul état de chargement simple

  // Computed properties
  const hasProjects = computed(() => projects.value.length > 0);
  const currentProject = computed(() => {
    if (!currentProjectId.value) return null;
    return projects.value.find((p) => p.id === currentProjectId.value);
  });
  const currentProjectScores = computed(() => {
    if (!currentProjectId.value) return null;
    return (
      projectScores.value[currentProjectId.value] || {
        completedItems: 0,
        totalItems: 0,
        percentage: 0,
      }
    );
  });

  // Méthodes de gestion des projets
  const setCurrentProject = async (projectId) => {
    // Éviter de changer de projet pendant la synchronisation
    if (isSynced.value === false) {
      return;
    }

    // Si c'est le même projet, ne rien faire
    if (currentProjectId.value === projectId) {
      return;
    }

    // Vérifier si les données sont déjà chargées pour ce projet
    const hasDataForProject =
      projectCheckedItems.value[projectId] &&
      projectScores.value[projectId] &&
      projectScores.value[projectId].totalItems > 0;

    // Activer l'état de chargement seulement si on n'a pas les données
    if (!hasDataForProject) {
      isLoading.value = true;
    }

    // Switch instantané du projet
    currentProjectId.value = projectId;

    // Sauvegarder en localStorage
    if (process.client) {
      localStorage.setItem("currentProjectId", projectId);
    }

    // Charger les données seulement si on ne les a pas déjà
    if (!hasDataForProject && process.client && window._currentUserId) {
      try {
        await loadProjectChecked(window._currentUserId, projectId);
        // Désactiver le chargement une fois les données chargées
        isLoading.value = false;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du projet:",
          error
        );
        // Désactiver le chargement même en cas d'erreur
        isLoading.value = false;
      }
    } else if (hasDataForProject) {
      // Si on a déjà les données, pas de chargement nécessaire
      isLoading.value = false;
    } else {
      // Si pas d'utilisateur connecté, désactiver immédiatement le chargement
      isLoading.value = false;
    }
  };

  const addProject = (project) => {
    projects.value.push(project);
    // Initialiser les scores et éléments cochés
    projectScores.value[project.id] = {
      completedItems: 0,
      totalItems: 0,
      percentage: 0,
    };
    projectCheckedItems.value[project.id] = new Set();
  };

  // Méthode pour désactiver le chargement une fois la checklist chargée
  const finishLoading = () => {
    isLoading.value = false;
  };

  // Méthode pour réinitialiser l'état de chargement
  const resetLoading = () => {
    isLoading.value = false;
  };

  // Méthode pour vérifier si un projet a des données chargées
  const hasProjectData = (projectId) => {
    return (
      projectCheckedItems.value[projectId] &&
      projectScores.value[projectId] &&
      projectScores.value[projectId].totalItems > 0
    );
  };

  const updateProject = (projectId, updates) => {
    const projectIndex = projects.value.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects.value[projectIndex] = {
        ...projects.value[projectIndex],
        ...updates,
      };
    }
  };

  const removeProject = (projectId) => {
    projects.value = projects.value.filter((p) => p.id !== projectId);
    delete projectScores.value[projectId];
    delete projectCheckedItems.value[projectId];

    // Si c'était le projet courant, le réinitialiser
    if (currentProjectId.value === projectId) {
      currentProjectId.value =
        projects.value.length > 0 ? projects.value[0].id : null;
    }
  };

  // Méthodes de gestion des scores
  const calculateScoresFromItems = (projectId, allItems, checkedItems) => {
    const totalItems = allItems.length;
    const completedItems = checkedItems.size;
    const percentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    projectScores.value[projectId] = {
      completedItems,
      totalItems,
      percentage,
    };

    // Sauvegarder automatiquement dans Firebase si l'utilisateur est connecté
    if (process.client && window._currentUserId) {
      saveProjectChecked(window._currentUserId, projectId);
    }
  };

  const getProjectScores = (projectId) => {
    return (
      projectScores.value[projectId] || {
        completedItems: 0,
        totalItems: 0,
        percentage: 0,
      }
    );
  };

  const resetProjectScores = (projectId) => {
    projectScores.value[projectId] = {
      completedItems: 0,
      totalItems: 0,
      percentage: 0,
    };
  };

  // Méthodes de gestion des éléments cochés
  const getCheckedSet = (projectId) => {
    if (!projectCheckedItems.value[projectId]) {
      projectCheckedItems.value[projectId] = new Set();
    }
    return projectCheckedItems.value[projectId];
  };

  const setCheckedForProject = (projectId, checkedSet) => {
    projectCheckedItems.value[projectId] = checkedSet;

    // Sauvegarder automatiquement dans Firebase si l'utilisateur est connecté
    if (process.client && window._currentUserId) {
      saveProjectChecked(window._currentUserId, projectId);
    }
  };

  // Méthodes de synchronisation Firebase
  const subscribeUserProjects = async (userId) => {
    try {
      if (!userId) return;

      const { $db } = useNuxtApp();
      if (!$db) {
        console.warn("Firebase non initialisé");
        return;
      }

      const { collection, query, where, onSnapshot, getDocs } = await import(
        "firebase/firestore"
      );
      const projectsRef = collection($db, "projects");
      const userProjectsQuery = query(
        projectsRef,
        where("userId", "==", userId)
      );

      const unsubscribe = onSnapshot(
        userProjectsQuery,
        async (snapshot) => {
          const firebaseProjects = [];
          snapshot.forEach((doc) => {
            firebaseProjects.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          // Sauvegarder l'ID du projet actuellement sélectionné
          const previouslySelectedProjectId = currentProjectId.value;

          // Mettre à jour le store local
          projects.value = firebaseProjects;
          isSynced.value = true;

          // Restaurer la sélection du projet si elle existe toujours
          if (
            previouslySelectedProjectId &&
            firebaseProjects.find((p) => p.id === previouslySelectedProjectId)
          ) {
            currentProjectId.value = previouslySelectedProjectId;
          } else if (firebaseProjects.length > 0 && !currentProjectId.value) {
            // Si aucun projet n'était sélectionné, sélectionner le premier
            currentProjectId.value = firebaseProjects[0].id;
          }

          // Charger les données de progression pour chaque projet
          for (const project of firebaseProjects) {
            await loadProjectChecked(userId, project.id);
          }
        },
        (error) => {
          console.error("Erreur de synchronisation Firebase:", error);
          if (error.code === "permission-denied") {
            console.error(
              "Problème de permissions Firestore. Vérifiez que les règles sont déployées."
            );
          } else if (error.code === "unavailable") {
            console.error(
              "Firestore temporairement indisponible, réessayez plus tard."
            );
          } else {
            console.error("Erreur Firestore:", error.code, error.message);
          }
          isSynced.value = false;
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Erreur lors de la synchronisation des projets:", error);
      if (error.code === "permission-denied") {
        console.error(
          "Problème de permissions Firestore. Vérifiez que les règles sont déployées."
        );
      } else if (error.code === "unavailable") {
        console.error(
          "Firestore temporairement indisponible, réessayez plus tard."
        );
      } else {
        console.error("Erreur lors de la synchronisation:", error.message);
      }
      isSynced.value = false;
    }
  };

  const addProjectRemote = async (userId, projectData) => {
    try {
      if (!userId) throw new Error("userId requis");

      const { $db } = useNuxtApp();
      if (!$db) {
        throw new Error("Firebase non initialisé");
      }

      const { collection, addDoc } = await import("firebase/firestore");
      const projectsRef = collection($db, "projects");

      const projectToAdd = {
        ...projectData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(projectsRef, projectToAdd);

      // Le projet sera automatiquement ajouté au store via onSnapshot
      // Pas besoin d'ajouter localement car Firebase s'en charge
      const newProject = {
        id: docRef.id,
        ...projectToAdd,
      };

      return newProject;
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet:", error);
      throw error;
    }
  };

  const updateProjectRemote = async (userId, projectId, updates) => {
    try {
      if (!userId || !projectId) throw new Error("userId et projectId requis");

      const { $db } = useNuxtApp();
      if (!$db) {
        throw new Error("Firebase non initialisé");
      }

      const { doc, updateDoc } = await import("firebase/firestore");
      const projectRef = doc($db, "projects", projectId);

      const updatesToApply = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(projectRef, updatesToApply);

      // La mise à jour sera automatiquement reflétée dans le store via onSnapshot
      // Pas besoin de mettre à jour localement
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet:", error);
      throw error;
    }
  };

  const removeProjectRemote = async (userId, projectId) => {
    try {
      if (!userId || !projectId) throw new Error("userId et projectId requis");

      const { $db } = useNuxtApp();
      if (!$db) {
        throw new Error("Firebase non initialisé");
      }

      const { doc, deleteDoc } = await import("firebase/firestore");
      const projectRef = doc($db, "projects", projectId);

      await deleteDoc(projectRef);

      // La suppression sera automatiquement reflétée dans le store via onSnapshot
      // Pas besoin de supprimer localement car c'est déjà fait
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      throw error;
    }
  };

  const loadProjectChecked = async (userId, projectId) => {
    try {
      if (!userId || !projectId) return;

      const { $db } = useNuxtApp();
      if (!$db) {
        console.warn("Firebase non initialisé");
        return;
      }

      const { doc, getDoc } = await import("firebase/firestore");
      const projectRef = doc($db, "projects", projectId);

      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const data = projectDoc.data();

        // Ne charger les données de progression que si le projet a un type de checklist
        if (data.checklistType) {
          // Charger les éléments cochés
          if (data.checkedItems && Array.isArray(data.checkedItems)) {
            const checkedSet = new Set(data.checkedItems);
            projectCheckedItems.value[projectId] = checkedSet;
          } else {
            // Initialiser un set vide si pas d'éléments cochés
            projectCheckedItems.value[projectId] = new Set();
          }

          // Charger les scores
          if (data.scores) {
            projectScores.value[projectId] = data.scores;
          } else {
            // Initialiser des scores vides si pas de scores
            projectScores.value[projectId] = {
              completedItems: 0,
              totalItems: 0,
              percentage: 0,
            };
          }
        } else {
        }
      } else {
        console.warn("Projet non trouvé:", projectId);
      }
    } catch (error) {
      // Ignorer les erreurs de permissions pour les nouveaux projets sans checklist
      if (error.code !== "permission-denied") {
        console.error("Erreur lors du chargement des éléments cochés:", error);
      } else {
      }
    }
  };

  const saveProjectChecked = async (userId, projectId) => {
    try {
      if (!userId || !projectId) return;

      const { $db } = useNuxtApp();
      if (!$db) {
        console.warn("Firebase non initialisé");
        return;
      }

      // Vérifier que le projet existe et a un type de checklist
      const project = projects.value.find((p) => p.id === projectId);
      if (!project || !projectId) {
        return; // Ne pas sauvegarder si le projet n'a pas de type de checklist
      }

      // Protection contre les boucles infinies : vérifier si les données ont vraiment changé
      const currentCheckedSet = getCheckedSet(projectId);
      const currentScores = getProjectScores(projectId);

      // Debounce : éviter les sauvegardes trop fréquentes
      if (window._saveProjectTimeout) {
        clearTimeout(window._saveProjectTimeout);
      }

      window._saveProjectTimeout = setTimeout(async () => {
        try {
          const { updateDoc } = await import("firebase/firestore");
          const { doc } = await import("firebase/firestore");
          const projectRef = doc($db, "projects", projectId);

          // Récupérer les éléments cochés actuels
          const checkedItems = Array.from(currentCheckedSet);

          // Sauvegarder dans Firebase
          await updateDoc(projectRef, {
            checkedItems,
            scores: currentScores,
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error(
            "Erreur lors de la sauvegarde des éléments cochés:",
            error
          );
        }
      }, 500); // Délai de 500ms
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des éléments cochés:", error);
    }
  };

  // Initialisation depuis localStorage
  const initializeFromStorage = () => {
    if (process.client) {
      const savedProjectId = localStorage.getItem("currentProjectId");
      if (savedProjectId) {
        currentProjectId.value = savedProjectId;
      }
    }
  };

  // Initialiser la synchronisation Firebase
  const initializeFirebaseSync = async (userId) => {
    if (!userId) return;

    try {
      // Stocker l'ID de l'utilisateur globalement pour la sauvegarde automatique
      if (process.client) {
        window._currentUserId = userId;
      }

      // Se désabonner de l'ancienne synchronisation si elle existe
      if (window._projectUnsubscribe) {
        window._projectUnsubscribe();
      }

      // Démarrer la nouvelle synchronisation
      const unsubscribe = await subscribeUserProjects(userId);
      if (unsubscribe) {
        window._projectUnsubscribe = unsubscribe;
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la synchronisation Firebase:",
        error
      );
    }
  };

  // Initialiser au chargement
  if (process.client) {
    initializeFromStorage();

    // Nettoyer le timeout au démontage
    window.addEventListener("beforeunload", () => {
      if (window._saveProjectTimeout) {
        clearTimeout(window._saveProjectTimeout);
      }
    });
  }

  return {
    // État
    projects: computed(() => projects.value),
    currentProjectId: computed(() => currentProjectId.value),
    currentProject,
    hasProjects,
    currentProjectScores,
    isSynced: computed(() => isSynced.value),
    isLoading: computed(() => isLoading.value),

    // Méthodes de gestion des projets
    setCurrentProject,
    addProject,
    updateProject,
    removeProject,
    finishLoading,
    resetLoading,
    hasProjectData,

    // Méthodes de gestion des scores
    calculateScoresFromItems,
    getProjectScores,
    resetProjectScores,

    // Méthodes de gestion des éléments cochés
    getCheckedSet,
    setCheckedForProject,

    // Méthodes de synchronisation
    subscribeUserProjects,
    addProjectRemote,
    updateProjectRemote,
    removeProjectRemote,
    loadProjectChecked,
    saveProjectChecked,

    // Initialisation
    initializeFirebaseSync,
  };
});
