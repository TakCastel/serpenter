/**
 * Composable pour gérer les appels aux Netlify Functions
 * Utilisé en mode SPA pour les fonctionnalités qui nécessitent un serveur
 */

export const useNetlifyFunctions = () => {
  // URL de base des Netlify Functions (à configurer selon votre déploiement)
  const getFunctionUrl = (functionName) => {
    // En développement, utiliser localhost
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:8888/.netlify/functions/${functionName}`;
    }
    
    // En production, utiliser l'URL Netlify
    const netlifyUrl = process.env.NUXT_PUBLIC_NETLIFY_URL || 'https://your-site.netlify.app';
    return `${netlifyUrl}/.netlify/functions/${functionName}`;
  };

  const callFunction = async (functionName, data = {}, options = {}) => {
    try {
      const url = getFunctionUrl(functionName);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de l'appel à ${functionName}:`, error);
      throw error;
    }
  };

  // Fonctions spécifiques
  const callLighthouse = async (url, options = {}) => {
    return callFunction('lh', {
      url,
      formFactor: options.formFactor || 'mobile',
      basicUser: options.basicUser,
      basicPass: options.basicPass
    });
  };

  const callSecurityHeaders = async (url) => {
    return callFunction('security-headers', { url });
  };

  const callSecurityObservatory = async (url) => {
    return callFunction('security-observatory', { url });
  };

  return {
    callFunction,
    callLighthouse,
    callSecurityHeaders,
    callSecurityObservatory,
    getFunctionUrl
  };
};
