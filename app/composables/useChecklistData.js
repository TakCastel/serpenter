import checklistData from '~/data/checklist-items.json'

export const useChecklistData = () => {
  const { t } = useI18n()

  const getCategoryItems = (category) => {
    if (!checklistData[category] || !checklistData[category].items) {
      return []
    }

    return checklistData[category].items.map(item => {
      // Récupérer les traductions
      const label = t(item.labelKey)
      const description = t(item.descriptionKey)
      const explication = t(item.details.explicationKey)
      
      // Récupérer les listes en utilisant une approche sans warnings
      let commentFaire = []
      let bonnesPratiques = []
      
      // Récupérer commentFaire - on sait qu'il y a 4 éléments max
      for (let i = 1; i <= 4; i++) {
        try {
          const key = `${item.details.commentFaireKey}.item${i}`
          const value = t(key, [], { fallback: `__MISSING_${key}__` })
          if (value && !value.startsWith('__MISSING_')) {
            commentFaire.push(value)
          }
        } catch {
          // Ignore silencieusement
        }
      }
      
      // Récupérer bonnesPratiques - on sait qu'il y a 5 éléments max
      for (let i = 1; i <= 5; i++) {
        try {
          const key = `${item.details.bonnesPratiquesKey}.item${i}`
          const value = t(key, [], { fallback: `__MISSING_${key}__` })
          if (value && !value.startsWith('__MISSING_')) {
            bonnesPratiques.push(value)
          }
        } catch {
          // Ignore silencieusement
        }
      }
      
      // Le code reste en anglais (pas de traduction)
      const exemple = item.details.exemple || {}

      return {
        id: item.id,
        label,
        description,
        details: {
          explication,
          commentFaire,
          bonnesPratiques,
          exemple
        }
      }
    })
  }

  const getAllCategories = () => {
    return Object.keys(checklistData)
  }

  const getCategoryData = (category) => {
    return {
      items: getCategoryItems(category)
    }
  }

  return {
    getCategoryItems,
    getAllCategories,
    getCategoryData
  }
}
