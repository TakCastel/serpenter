// Chargement paresseux des datasets depuis /public pour éviter de gonfler le bundle serveur

export const useChecklistData = (initialChecklistType = 'web-prelaunch') => {
  // Suppression de l'import useI18n car on n'en a plus besoin ici
  // const { t } = useI18n()

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
      // ✅ SOLUTION : Retourner les clés de traduction au lieu des traductions
      // Plus d'appels à t() avec des clés dynamiques = plus de 40k clés au build
      return {
        id: item.id,
        labelKey: item.labelKey,
        descriptionKey: item.descriptionKey,
        details: {
          explicationKey: item.details.explicationKey,
          commentFaireKey: item.details.commentFaireKey,
          bonnesPratiquesKey: item.details.bonnesPratiquesKey,
          exempleKey: item.details.exempleKey,
          exemple: item.details.exemple,
          html: item.details.html
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
