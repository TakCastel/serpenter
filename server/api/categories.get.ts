export default defineEventHandler(async (event) => {
  try {
    // En production, utiliser les données statiques
    if (process.env.NODE_ENV === 'production') {
      const response = await $fetch('/data/seo-checklist.json')
      return response
    }
    
    // En développement, utiliser les données du serveur
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
