// Composable dédié à la gestion des traductions des checklists
// Centralise la logique de traduction pour éviter les appels dynamiques au build time

export const useChecklistI18n = () => {
  const { t, te } = useI18n()

  // Fonction sécurisée pour la traduction avec fallback et vérification d'initialisation
  const safeT = (key, fallback = null) => {
    if (!key) return fallback
    
    try {
      // ✅ Vérifier que l'i18n est initialisé avant de traduire
      if (!te || typeof te !== 'function') {
        return fallback
      }
      
      // Vérifier si la clé existe
      if (!te(key)) {
        return fallback
      }
      
      const value = t(key)
      return value !== key ? value : fallback
    } catch (error) {
      console.warn(`Erreur de traduction pour la clé "${key}":`, error)
      return fallback
    }
  }

  // Traduire un item de checklist
  const translateItem = (item) => {
    if (!item) return null

    return {
      id: item.id,
      label: safeT(item.labelKey, item.labelKey),
      description: safeT(item.descriptionKey, item.descriptionKey),
      details: {
        explication: safeT(item.details?.explicationKey, item.details?.explicationKey),
        commentFaire: getCommentFaireList(item.details?.commentFaireKey),
        bonnesPratiques: getBonnesPratiquesList(item.details?.bonnesPratiquesKey),
        exemple: getExemple(item.details),
        html: item.details?.html
      }
    }
  }

  // Récupérer la liste commentFaire
  const getCommentFaireList = (commentFaireKey) => {
    if (!commentFaireKey) return []
    
    const list = []
    for (let i = 1; i <= 4; i++) {
      const key = `${commentFaireKey}.item${i}`
      const value = safeT(key, null)
      if (value) {
        list.push(value)
      }
    }
    return list
  }

  // Récupérer la liste bonnesPratiques
  const getBonnesPratiquesList = (bonnesPratiquesKey) => {
    if (!bonnesPratiquesKey) return []
    
    const list = []
    for (let i = 1; i <= 5; i++) {
      const key = `${bonnesPratiquesKey}.item${i}`
      const value = safeT(key, null)
      if (value) {
        list.push(value)
      }
    }
    return list
  }

  // Gérer les exemples (ordre de priorité: exempleKey -> exemple -> html)
  const getExemple = (details) => {
    if (!details) return null

    // 1) Clé de traduction directe si fournie
    if (details.exempleKey) {
      const val = safeT(details.exempleKey, null)
      if (val) return val
    }

    // 2) Valeur directe dans le dataset
    if (details.exemple) {
      return details.exemple
    }

    // 3) Ancien champ HTML dédié
    if (details.html) {
      return { html: details.html }
    }

    return null
  }

  // Traduire une liste d'items
  const translateItems = (items) => {
    if (!Array.isArray(items)) return []
    return items.map(item => translateItem(item))
  }

  // ✅ Fonction pour attendre que l'i18n soit initialisé
  const waitForI18n = async (maxWaitTime = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      
      const checkI18n = () => {
        try {
          // Vérifier que l'i18n est prêt avec une clé de test
          if (te && typeof te === 'function' && te('welcome') && t('welcome') !== 'welcome') {
            resolve()
            return
          }
          
          // Timeout pour éviter les boucles infinies
          if (Date.now() - startTime > maxWaitTime) {
            console.warn('Timeout lors de l\'attente de l\'initialisation i18n')
            resolve() // Résoudre quand même pour ne pas bloquer
            return
          }
          
          // Réessayer dans 50ms
          setTimeout(checkI18n, 50)
        } catch (error) {
          console.warn('Erreur lors de la vérification i18n:', error)
          resolve() // Résoudre en cas d'erreur pour ne pas bloquer
        }
      }
      
      checkI18n()
    })
  }

  return {
    safeT,
    translateItem,
    translateItems,
    getCommentFaireList,
    getBonnesPratiquesList,
    getExemple,
    waitForI18n
  }
}
