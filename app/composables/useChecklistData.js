// Chargement paresseux des datasets depuis /public pour éviter de gonfler le bundle serveur

export const useChecklistData = (initialChecklistType = 'web-prelaunch') => {
  const { t } = useI18n()

  const datasetCache = reactive({})
  const resolveUrl = (type) => {
    switch (type) {
      case 'appstore-preflight':
        return '/data/checklist-items-app.json'
      case 'security-checker':
        return '/data/checklist-items-security.json'
      case 'web-prelaunch':
      default:
        return '/data/checklist-items-web.json'
    }
  }
  const loadDataset = async (type) => {
    if (datasetCache[type]) return datasetCache[type]
    if (process.server) return {}
    const url = resolveUrl(type)
    const data = await $fetch(url)
    datasetCache[type] = data
    return data
  }

  const selectedType = ref(initialChecklistType)
  const dataRef = ref({})
  const isLoading = ref(true)
  const loadingPromise = ref(null)

  if (process.client) {
    // charger initialement
    loadingPromise.value = loadDataset(selectedType.value).then((data) => {
      dataRef.value = data || {}
      isLoading.value = false
    })
    watch(selectedType, async (type) => {
      isLoading.value = true
      const data = await loadDataset(type)
      dataRef.value = data || {}
      isLoading.value = false
    })
  } else {
    isLoading.value = false
  }

  const setChecklistType = (type) => { selectedType.value = type }

  // Fonction pour attendre que les données soient chargées
  const waitForData = async () => {
    if (process.client && loadingPromise.value) {
      await loadingPromise.value
    }
  }

  const getCategoryItems = (category) => {
    const data = dataRef.value || {}
    if (!data[category] || !data[category].items) {
      return []
    }

    return data[category].items.map(item => {
      // Récupérer les traductions
      const label = t(item.labelKey)
      const description = t(item.descriptionKey)
      const explication = t(item.details.explicationKey)
      
      // Récupérer les listes commentFaire et bonnesPratiques
      let commentFaire = []
      let bonnesPratiques = []
      
      // Récupérer commentFaire
      try {
        const commentFaireKey = item.details.commentFaireKey
        if (commentFaireKey) {
          for (let i = 1; i <= 4; i++) {
            const key = `${commentFaireKey}.item${i}`
            const value = t(key, [], { fallback: null })
            if (value && value !== key && !value.startsWith('__MISSING_')) {
              commentFaire.push(value)
            }
          }
        }
      } catch (error) {
        // Erreur lors de la récupération de commentFaire
      }
      
      // Récupérer bonnesPratiques
      try {
        const bonnesPratiquesKey = item.details.bonnesPratiquesKey
        if (bonnesPratiquesKey) {
          for (let i = 1; i <= 5; i++) {
            const key = `${bonnesPratiquesKey}.item${i}`
            const value = t(key, [], { fallback: null })
            if (value && value !== key && !value.startsWith('__MISSING_')) {
              bonnesPratiques.push(value)
            }
          }
        }
      } catch (error) {
        // Erreur lors de la récupération de bonnesPratiques
      }
      
      // Gérer les exemples (ordre de priorité: exempleKey -> exemple -> html)
      let exemple = null
      try {
        // 1) Clé de traduction directe si fournie
        const exempleKey = item.details.exempleKey
        if (exempleKey) {
          const val = t(exempleKey, [], { fallback: null })
          if (val && val !== exempleKey && !String(val).startsWith('__MISSING_')) {
            exemple = val
          }
        }
      } catch (e) {}

      // 2) Valeur directe dans le dataset
      if (!exemple && item.details.exemple) {
        exemple = item.details.exemple
      }

      // 3) Ancien champ HTML dédié
      if (!exemple && item.details.html) {
        exemple = { html: item.details.html }
      }



      return {
        id: item.id,
        label,
        description,
        details: {
          explication,
          commentFaire,
          bonnesPratiques,
          ...(exemple ? { exemple } : {})
        }
      }
    })
  }

  const getAllCategories = () => Object.keys(dataRef.value || {})

  const getCategoryData = (category) => ({ items: getCategoryItems(category) })

  return {
    getCategoryItems,
    getAllCategories,
    getCategoryData,
    setChecklistType,
    isLoading,
    waitForData
  }
}
