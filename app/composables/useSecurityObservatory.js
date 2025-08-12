/**
 * Composable pour l'observatoire de sécurité Mozilla côté client
 * Remplace l'API serveur en mode SPA
 */

export const useSecurityObservatory = () => {
  const MOZ_API = 'https://http-observatory.security.mozilla.org/api/v1';

  const checkSecurityObservatory = async (url) => {
    try {
      let hostname;
      try {
        const u = new URL(url);
        hostname = u.hostname;
        if (!hostname || !u.protocol.startsWith('http')) throw new Error('URL invalide');
      } catch {
        throw new Error('URL invalide');
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
      };

    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la vérification Observatory');
    }
  };

  return {
    checkSecurityObservatory
  };
};
