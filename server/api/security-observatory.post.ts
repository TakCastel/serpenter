const MOZ_API = 'https://http-observatory.security.mozilla.org/api/v1'

type AnalyzeResponse = {
  scan_id?: number
  score?: number
  grade?: string
  state?: string
  tests_failed?: number
  tests_passed?: number
  tests_quantity?: number
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
      hostname = u.hostname
      if (!hostname || !u.protocol.startsWith('http')) throw new Error('URL invalide')
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'URL invalide' })
    }

    // Utiliser le cache d'Observatory si dispo (hidden pour éviter l'indexation)
    const analyzeUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=false`
    let analyze = await $fetch(analyzeUrl).catch((e:any) => {
      throw createError({ statusCode: 502, statusMessage: e?.message || 'Erreur Observatory' })
    }) as AnalyzeResponse

    // Si le scan n'est pas prêt, déclencher un rescan et poller rapidement
    const transientStates = new Set(['STARTING', 'PENDING', 'RUNNING', 'QUEUED'])
    if (analyze?.state && transientStates.has(analyze.state)) {
      // Déclencher un rescan (non bloquant) puis reconsulter
      const rescanUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=true`
      try { await $fetch(rescanUrl) } catch {}

      // Poll jusqu'à 5 fois
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1200))
        analyze = await $fetch(analyzeUrl).catch(() => analyze)
        if (analyze && !analyze.state) break
        if (analyze && !transientStates.has(analyze.state || '')) break
      }
    }

    const score = typeof analyze?.score === 'number' ? analyze.score : 0
    const grade = analyze?.grade || null

    // Résultat simplifié
    return {
      success: true,
      data: {
        host: hostname,
        score,
        grade,
        state: analyze?.state || 'FINISHED',
        testsFailed: analyze?.tests_failed ?? null,
        testsPassed: analyze?.tests_passed ?? null,
        testsQuantity: analyze?.tests_quantity ?? null,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    console.error('Erreur /api/security-observatory:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Erreur interne du serveur'
    })
  }
})


