export default defineEventHandler(async (event) => {
  try {
    const category = getRouterParam(event, 'category')
    const query = getQuery(event)
    const locale = query.locale || 'fr'

    // En production, utiliser les données statiques
    if (process.env.NODE_ENV === 'production') {
      const response = await $fetch(`/data/i18n/${category}-items-${locale}.json`)
      return response
    }
    
    // En développement, utiliser les données du serveur
    const { readFile } = await import('fs/promises')
    const { join } = await import('path')

    const filePath = join(process.cwd(), 'server', 'data', 'i18n', `${category}-items-${locale}.json`)
    const items = await readFile(filePath, 'utf-8')

    return JSON.parse(items)
  } catch (error) {
    console.error('Erreur lors du chargement des items:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des items'
    })
  }
})
