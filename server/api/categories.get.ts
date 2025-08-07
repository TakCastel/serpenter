export default defineEventHandler(async (event) => {
  try {
    const { readFile } = await import('fs/promises')
    const { join } = await import('path')

    const filePath = join(process.cwd(), 'server', 'data', 'seo-checklist.json')
    const categories = await readFile(filePath, 'utf-8')
    return JSON.parse(categories)
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des catégories'
    })
  }
})
