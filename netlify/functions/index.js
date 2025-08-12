/**
 * Index des Netlify Functions pour Serpenter
 * Mode SPA - Architecture hybride client/serveur
 */

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Serpenter Netlify Functions API',
      version: '1.0.0',
      mode: 'SPA',
      functions: {
        'lh': {
          description: 'Audit Lighthouse - Nécessite Chrome/Chromium',
          method: 'POST',
          body: {
            url: 'string (required)',
            formFactor: 'mobile|desktop (optional)',
            basicUser: 'string (optional)',
            basicPass: 'string (optional)'
          }
        },
        'security-headers': {
          description: 'Vérification des en-têtes de sécurité',
          method: 'POST',
          body: {
            url: 'string (required)'
          }
        },
        'security-observatory': {
          description: 'Appel à Mozilla Security Observatory',
          method: 'POST',
          body: {
            url: 'string (required)'
          }
        }
      },
      clientComposables: [
        'useSecurityHeaders - Vérification côté client',
        'useSecurityObservatory - Appel direct à Mozilla',
        'useNetlifyFunctions - Gestion des appels serveur'
      ],
      note: 'Certaines fonctionnalités sont disponibles côté client, d\'autres nécessitent les Netlify Functions'
    })
  };
};
