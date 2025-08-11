import defaultChecklistData from '~/data/checklist-items-web.json'
import appChecklist from '~/data/checklist-items-app.json'
import securityChecklist from '~/data/checklist-items-security.json'

export const useChecklistData = (initialChecklistType = 'web-prelaunch') => {
  const { t } = useI18n()

  // Pour l'instant, tous les types pointent vers le dataset par défaut.
  // Plus tard, on pourra importer des datasets spécifiques ici.
  const datasetMap = {
    'web-prelaunch': defaultChecklistData,
    'appstore-preflight': appChecklist,
    'security-checker': securityChecklist
  }

  const selectedType = ref(initialChecklistType)
  const dataRef = computed(() => datasetMap[selectedType.value] || defaultChecklistData)
  const setChecklistType = (type) => { selectedType.value = type }

  const getCategoryItems = (category) => {
    if (!dataRef.value[category] || !dataRef.value[category].items) {
      return []
    }

    return dataRef.value[category].items.map(item => {
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
        console.warn(`Erreur lors de la récupération de commentFaire pour ${item.id}:`, error)
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
        console.warn(`Erreur lors de la récupération de bonnesPratiques pour ${item.id}:`, error)
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

  const getAllCategories = () => {
    return Object.keys(dataRef.value)
  }

  const getCategoryData = (category) => {
    return {
      items: getCategoryItems(category)
    }
  }

  return {
    getCategoryItems,
    getAllCategories,
    getCategoryData,
    setChecklistType
  }
}
