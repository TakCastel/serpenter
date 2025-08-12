function mapGradeToScore(grade?: string): number {
  if (!grade) return 0
  const map: Record<string, number> = {
    'A+': 100,
    'A': 95,
    'A-': 90,
    'B': 80,
    'C': 70,
    'D': 60,
    'E': 50,
    'F': 40,
    'T': 0,
    'M': 0
  }
  return map[grade] ?? 0
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url } = body || {}

    if (!url) {
      throw createError({ statusCode: 400, statusMessage: 'URL requise' })
    }

    let hostname: string
    try {
      const u = new URL(url)
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Protocole non supporté')
      hostname = u.hostname
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'URL invalide' })
    }

    // Interroger SSL Labs (fromCache pour éviter des scans trop longs)
    const base = 'https://api.ssllabs.com/api/v3/analyze'
    const query = `host=${encodeURIComponent(hostname)}&fromCache=on&all=done`
    const res = await $fetch(`${base}?${query}`).catch((e:any) => {
      throw createError({ statusCode: 502, statusMessage: e?.message || 'Erreur SSL Labs' })
    }) as any

    // Résumé
    const endpoints = Array.isArray(res?.endpoints) ? res.endpoints : []
    const bestGrade = endpoints
      .map((e:any) => e.grade)
      .filter(Boolean)
      .sort((a:string,b:string) => mapGradeToScore(b) - mapGradeToScore(a))[0]

    const score = mapGradeToScore(bestGrade)

    // Détecter support TLS 1.3 / 1.2 si dispo via details (non garanti depuis fromCache)
    const supportsTls13 = !!endpoints.find((e:any) => e.details?.protocols?.some((p:any) => p.name === 'TLS' && p.version === '1.3'))
    const supportsTls12 = supportsTls13 || !!endpoints.find((e:any) => e.details?.protocols?.some((p:any) => p.name === 'TLS' && p.version === '1.2'))

    // Recommandations basiques
    const recommendations: string[] = []
    if (!bestGrade) recommendations.push('Lancer/attendre un scan SSL Labs complet pour obtenir une note')
    if (!supportsTls12) recommendations.push('Désactiver TLS 1.0/1.1 et activer au minimum TLS 1.2')
    if (!supportsTls13) recommendations.push('Activer TLS 1.3 pour de meilleures performances et sécurité')

    return {
      success: true,
      data: {
        host: hostname,
        status: res?.status,
        grade: bestGrade || null,
        score,
        endpoints,
        supportsTls12,
        supportsTls13,
        recommendations,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Erreur interne du serveur'
    })
  }
})


