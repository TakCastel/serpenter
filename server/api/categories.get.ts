export default defineEventHandler(async (event) => {
  try {
    // Utiliser les données statiques
    const response = await $fetch('/data/seo-checklist.json')
    return response
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des catégories'
    })
  }
})
