const MOZ_API = 'https://http-observatory.security.mozilla.org/api/v1';

exports.handler = async (event, context) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { url } = body || {};

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL requise' })
      };
    }

    let hostname;
    try {
      const u = new URL(url);
      hostname = u.hostname;
      if (!hostname || !u.protocol.startsWith('http')) throw new Error('URL invalide');
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL invalide' })
      };
    }

    // Utiliser le cache d'Observatory si dispo (hidden pour éviter l'indexation)
    const analyzeUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=false`;
    let analyze = await fetch(analyzeUrl).then(res => res.json()).catch((e) => {
      throw new Error(e?.message || 'Erreur Observatory');
    });

    // Si le scan n'est pas prêt, déclencher un rescan et poller rapidement
    const transientStates = new Set(['STARTING', 'PENDING', 'RUNNING', 'QUEUED']);
    if (analyze?.state && transientStates.has(analyze.state)) {
      // Déclencher un rescan (non bloquant) puis reconsulter
      const rescanUrl = `${MOZ_API}/analyze?host=${encodeURIComponent(hostname)}&hidden=true&rescan=true`;
      try { await fetch(rescanUrl); } catch {}

      // Poll jusqu'à 5 fois
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1200));
        analyze = await fetch(analyzeUrl).then(res => res.json()).catch(() => analyze);
        if (analyze && !analyze.state) break;
        if (analyze && !transientStates.has(analyze.state || '')) break;
      }
    }

    const score = typeof analyze?.score === 'number' ? analyze.score : 0;
    const grade = analyze?.grade || null;

    // Résultat simplifié
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
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
      })
    };

  } catch (error) {
    console.error('Security observatory error:', error);
    return {
      statusCode: error?.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error?.statusMessage || 'Erreur interne du serveur',
        message: error.message
      })
    };
  }
};
