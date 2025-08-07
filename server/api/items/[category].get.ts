export default defineEventHandler(async (event) => {
  try {
    const { readFile } = await import('fs/promises')
    const { join } = await import('path')

    const category = getRouterParam(event, 'category')
    const query = getQuery(event)
    const locale = query.locale || 'fr'

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
