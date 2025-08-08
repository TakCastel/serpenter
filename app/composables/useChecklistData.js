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
      
      // Récupérer les listes commentFaire et bonnesPratiques
      let commentFaire = []
      let bonnesPratiques = []
      
      // Récupérer commentFaire
      try {
        const commentFaireKey = item.details.commentFaireKey
        for (let i = 1; i <= 4; i++) {
          const key = `${commentFaireKey}.item${i}`
          const value = t(key, [], { fallback: null })
          if (value && value !== key && !value.startsWith('__MISSING_')) {
            commentFaire.push(value)
          }
        }
      } catch (error) {
        console.warn(`Erreur lors de la récupération de commentFaire pour ${item.id}:`, error)
      }
      
      // Récupérer bonnesPratiques
      try {
        const bonnesPratiquesKey = item.details.bonnesPratiquesKey
        for (let i = 1; i <= 5; i++) {
          const key = `${bonnesPratiquesKey}.item${i}`
          const value = t(key, [], { fallback: null })
          if (value && value !== key && !value.startsWith('__MISSING_')) {
            bonnesPratiques.push(value)
          }
        }
      } catch (error) {
        console.warn(`Erreur lors de la récupération de bonnesPratiques pour ${item.id}:`, error)
      }
      
      // Gérer l'exemple HTML
      const exemple = item.details.html ? {
        html: item.details.html
      } : {}

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
