export default defineEventHandler(async (event) => {
  try {
    const category = getRouterParam(event, 'category')
    const query = getQuery(event)
    const locale = query.locale || 'fr'

    // Utiliser les données statiques
    const response = await $fetch(`/data/i18n/${category}-items-${locale}.json`)
    return response
  } catch (error) {
    console.error('Erreur lors du chargement des items:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des items'
    })
  }
})
