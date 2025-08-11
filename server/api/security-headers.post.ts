export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url } = body || {}

    if (!url) {
      throw createError({ statusCode: 400, statusMessage: 'URL requise' })
    }

    // Validation URL
    let targetUrl: string
    try {
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Protocole non supporté')
      }
      targetUrl = urlObj.toString()
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'URL invalide' })
    }

    // Récupération des en-têtes via requête HEAD, fallback GET
    let response: Response | null = null
    try {
      response = await fetch(targetUrl, { method: 'HEAD' })
      if (!response.ok) {
        // Certaines origines refusent HEAD, essayer GET
        response = await fetch(targetUrl, { method: 'GET' })
      }
    } catch (e) {
      // Essayer GET si HEAD échoue
      response = await fetch(targetUrl, { method: 'GET' }).catch(() => null)
    }

    if (!response) {
      throw createError({ statusCode: 502, statusMessage: "Impossible d'accéder à l'URL fournie" })
    }

    // Normaliser les en-têtes d'intérêt (lowercase)
    const wantedHeaders = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security',
      'referrer-policy',
      'permissions-policy',
      'cross-origin-embedder-policy',
      'cross-origin-opener-policy',
      'cross-origin-resource-policy'
    ]

    const headers: Record<string, string | null> = {}
    for (const h of wantedHeaders) {
      headers[h] = response.headers.get(h)
    }

    // Score simple: pourcentage d'en-têtes présents parmi un sous-ensemble clé
    const scoringKeys = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security',
      'referrer-policy'
    ]
    const present = scoringKeys.filter((k) => !!headers[k]).length
    const score = Math.round((present / scoringKeys.length) * 100)

    // Recommandations basées sur les absences
    const recommendations: string[] = []
    if (!headers['content-security-policy']) {
      recommendations.push("Ajouter un Content-Security-Policy pour se protéger des attaques XSS et injections")
    }
    if (!headers['x-frame-options']) {
      recommendations.push('Configurer X-Frame-Options pour prévenir le clickjacking')
    }
    if (!headers['x-content-type-options']) {
      recommendations.push("Activer X-Content-Type-Options pour empêcher le MIME sniffing")
    }
    if (!headers['strict-transport-security']) {
      recommendations.push("Activer HSTS (Strict-Transport-Security) pour forcer HTTPS")
    }
    if (!headers['referrer-policy']) {
      recommendations.push('Définir une Referrer-Policy restrictive (no-referrer ou strict-origin-when-cross-origin)')
    }

    const analysis = {
      presentCount: present,
      totalConsidered: scoringKeys.length,
      missing: scoringKeys.filter((k) => !headers[k])
    }

    return {
      success: true,
      data: {
        score,
        headers,
        analysis,
        recommendations,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    console.error('Erreur /api/security-headers:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Erreur interne du serveur'
    })
  }
})


