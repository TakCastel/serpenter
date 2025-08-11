export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url } = body

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL requise'
      })
    }

    // Validation de l'URL
    let targetUrl: string
    try {
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Protocole non supporté')
      }
      targetUrl = urlObj.toString()
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL invalide'
      })
    }

    // Scanner les vulnérabilités avec OWASP ZAP et tests manuels
    const vulnerabilityResults = await scanVulnerabilities(targetUrl)
    
    return {
      success: true,
      data: vulnerabilityResults
    }
  } catch (error: any) {
    console.error('Erreur lors du scan des vulnérabilités:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur interne du serveur'
    })
  }
})

async function scanVulnerabilities(url: string) {
  try {
    // Essayer d'abord OWASP ZAP si disponible
    let vulnerabilities = []
    try {
      vulnerabilities = await scanWithOWASPZAP(url)
    } catch (zapError) {
      // Fallback vers les tests manuels
      vulnerabilities = await detectBasicVulnerabilities(url)
    }
    
    // Analyser les résultats
    const analysis = analyzeVulnerabilities(vulnerabilities)
    
    // Calculer le score
    const score = calculateVulnerabilityScore(vulnerabilities, analysis)
    
    return {
      score,
      vulnerabilities,
      analysis,
      recommendations: generateVulnerabilityRecommendations(vulnerabilities, analysis),
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Erreur lors du scan des vulnérabilités:', error)
    return {
      score: 0,
      vulnerabilities: [],
      analysis: {},
      recommendations: ['Impossible de scanner les vulnérabilités'],
      timestamp: new Date().toISOString(),
      error: 'Erreur lors du scan des vulnérabilités'
    }
  }
}

async function scanWithOWASPZAP(url: string) {
  try {
    // Configuration OWASP ZAP (à adapter selon votre installation)
    const zapApiUrl = process.env.ZAP_API_URL || 'http://localhost:8080'
    const zapApiKey = process.env.ZAP_API_KEY || ''
    
    // Lancer un scan passif
    const startResponse = await $fetch(`${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}&recurse=true&inScopeOnly=false&scanPolicyName=Default Policy&method=&postData=&contextId=`, {
      headers: { 'X-ZAP-API-Key': zapApiKey }
    }) as any
    
    if (startResponse.Result === 'OK') {
      // Attendre que le scan soit terminé
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Récupérer les alertes
      const alertsResponse = await $fetch(`${zapApiUrl}/JSON/core/view/alerts/?baseurl=${encodeURIComponent(url)}&start=1&count=100`, {
        headers: { 'X-ZAP-API-Key': zapApiKey }
      }) as any
      
      return alertsResponse.alerts?.map((alert: any) => ({
        id: alert.id,
        title: alert.name,
        severity: alert.risk,
        description: alert.description,
        recommendation: alert.solution,
        url: alert.url,
        evidence: alert.evidence
      })) || []
    }
    
    throw new Error('Impossible de lancer le scan OWASP ZAP')
  } catch (error) {
    console.error('Erreur OWASP ZAP:', error)
    throw error
  }
}

async function detectBasicVulnerabilities(url: string) {
  const vulnerabilities: any[] = []
  
  try {
    // Test 1: Vérifier la gestion des erreurs
    const errorResponse = await testErrorHandling(url)
    if (errorResponse.hasVulnerabilities) {
      vulnerabilities.push(...errorResponse.vulnerabilities)
    }
    
    // Test 2: Vérifier la validation des entrées
    const inputValidation = await testInputValidation(url)
    if (inputValidation.hasVulnerabilities) {
      vulnerabilities.push(...inputValidation.vulnerabilities)
    }
    
    // Test 3: Vérifier les en-têtes de sécurité
    const securityHeaders = await testSecurityHeaders(url)
    if (securityHeaders.hasVulnerabilities) {
      vulnerabilities.push(...securityHeaders.vulnerabilities)
    }
    
    // Test 4: Vérifier la configuration du serveur
    const serverConfig = await testServerConfiguration(url)
    if (serverConfig.hasVulnerabilities) {
      vulnerabilities.push(...serverConfig.vulnerabilities)
    }
    
         // Test 5: Vérifier les informations sensibles
     const infoDisclosure = await testInformationDisclosure(url)
     if (infoDisclosure.hasVulnerabilities) {
       vulnerabilities.push(...infoDisclosure.vulnerabilities)
     }
     
     // Test 6: Vérifier les fichiers publics (robots.txt, sitemap.xml)
     const publicFiles = await testPublicFiles(url)
     if (publicFiles.hasVulnerabilities) {
       vulnerabilities.push(...publicFiles.vulnerabilities)
     }
    
  } catch (error) {
    console.error('Erreur lors des tests de vulnérabilités:', error)
  }
  
  return vulnerabilities
}

async function testErrorHandling(url: string) {
  const vulnerabilities: any[] = []
  
  try {
    // Tester une URL inexistante pour voir la gestion des erreurs
    const errorUrl = `${url}/nonexistent-page-${Date.now()}`
    const response = await $fetch(errorUrl, { 
      method: 'GET',
      headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
    }).catch(() => null)
    
    if (response) {
      // Si on reçoit une réponse, vérifier qu'elle ne contient pas d'informations sensibles
      const responseText = JSON.stringify(response)
      
      if (responseText.includes('stack trace') || responseText.includes('error details')) {
        vulnerabilities.push({
          id: 'error-info-disclosure',
          title: 'Divulgation d\'informations d\'erreur',
          severity: 'Medium',
          description: 'La page d\'erreur révèle des informations sensibles sur l\'application',
          recommendation: 'Configurer des pages d\'erreur personnalisées sans informations techniques',
          url: errorUrl
        })
      }
    }
  } catch (error) {
    // C'est normal que ça échoue pour une URL inexistante
  }
  
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
}

async function testInputValidation(url: string) {
  const vulnerabilities: any[] = []
  
  try {
    // Tester l'injection XSS basique
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '"><img src=x onerror=alert("XSS")>'
    ]
    
    for (const payload of xssPayloads) {
      try {
        const testUrl = `${url}?q=${encodeURIComponent(payload)}`
        const response = await $fetch(testUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
        }) as any
        
        if (response && typeof response === 'string' && response.includes(payload)) {
          vulnerabilities.push({
            id: 'xss-reflected',
            title: 'Cross-Site Scripting (XSS) Réfléchi',
            severity: 'High',
            description: `L'entrée utilisateur "${payload}" est réfléchie dans la réponse sans échappement`,
            recommendation: 'Valider et échapper toutes les entrées utilisateur',
            url: testUrl,
            evidence: payload
          })
          break
        }
      } catch (error) {
        // Continuer avec le prochain payload
      }
    }
  } catch (error) {
    console.error('Erreur lors du test de validation des entrées:', error)
  }
  
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
}

 async function testSecurityHeaders(url: string) {
   const vulnerabilities: any[] = []
   
   try {
     const response = await $fetch(url, {
       method: 'HEAD',
       headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
     }) as any
     
     // Vérifier que response et headers existent
     if (!response) {
       return { hasVulnerabilities: false, vulnerabilities: [] }
     }
     
     // Extraire les headers de manière sécurisée
     let headers: Record<string, string> = {}
     
     if (response.headers && typeof response.headers === 'object') {
       headers = response.headers
     } else if (response.headers && typeof response.headers.get === 'function') {
       // Headers object avec méthode get()
       headers = {
         'content-security-policy': response.headers.get('content-security-policy'),
         'x-frame-options': response.headers.get('x-frame-options'),
         'strict-transport-security': response.headers.get('strict-transport-security'),
         'x-content-type-options': response.headers.get('x-content-type-options'),
         'x-xss-protection': response.headers.get('x-xss-protection')
       }
     } else {
       return { hasVulnerabilities: false, vulnerabilities: [] }
     }
     
     // Vérifier les headers de sécurité critiques
     if (!headers['content-security-policy']) {
       vulnerabilities.push({
         id: 'missing-csp',
         title: 'Content Security Policy manquante',
         severity: 'Medium',
         description: 'Aucune Content Security Policy n\'est définie',
         recommendation: 'Implémenter une CSP stricte pour prévenir les attaques XSS',
         url: url
       })
     }
     
     if (!headers['x-frame-options']) {
       vulnerabilities.push({
         id: 'missing-xfo',
         title: 'X-Frame-Options manquant',
         severity: 'Medium',
         description: 'Aucune protection contre le clickjacking',
         recommendation: 'Configurer X-Frame-Options: DENY ou SAMEORIGIN',
         url: url
       })
     }
     
     if (!headers['strict-transport-security']) {
       vulnerabilities.push({
         id: 'missing-hsts',
         title: 'HSTS manquant',
         severity: 'Low',
         description: 'Aucune protection HSTS pour forcer HTTPS',
         recommendation: 'Activer HSTS avec max-age approprié',
         url: url
       })
     }
     
   } catch (error) {
     console.error('Erreur lors du test des headers de sécurité:', error)
   }
   
   return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
 }

async function testServerConfiguration(url: string) {
  const vulnerabilities: any[] = []
  
  try {
    // Tester la méthode OPTIONS pour voir les méthodes HTTP supportées
    const optionsResponse = await $fetch(url, {
      method: 'OPTIONS',
      headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
    }).catch(() => null)
    
    if (optionsResponse) {
      // Vérifier si des méthodes dangereuses sont supportées
      const allowHeader = (optionsResponse as any).headers?.['allow'] || ''
      
      if (allowHeader.includes('PUT') || allowHeader.includes('DELETE')) {
        vulnerabilities.push({
          id: 'dangerous-methods',
          title: 'Méthodes HTTP dangereuses activées',
          severity: 'Medium',
          description: 'Les méthodes PUT/DELETE sont activées sur le serveur',
          recommendation: 'Désactiver les méthodes HTTP non nécessaires',
          url: url,
          evidence: allowHeader
        })
      }
    }
    
              // Tester la présence de fichiers sensibles
     const sensitiveFiles = [
       '/.env',
       '/config.php',
       '/wp-config.php',
       '/.git/config',
       '/.htaccess',
       '/web.config',
       '/wp-config.php.bak',
       '/config.php.bak'
     ]
     
     for (const file of sensitiveFiles) {
       try {
         const testUrl = `${url}${file}`
         const response = await $fetch(testUrl, {
           method: 'GET',
           headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
         }).catch(() => null)
         
         if (response) {
           // Vérifier si le contenu est vraiment sensible
           const isSensitive = await analyzeFileContent(file, response)
           
           if (isSensitive) {
             vulnerabilities.push({
               id: 'sensitive-file-exposure',
               title: 'Fichier sensible accessible',
               severity: 'High',
               description: `Le fichier ${file} est accessible publiquement et contient des informations sensibles`,
               recommendation: 'Restreindre l\'accès aux fichiers sensibles ou masquer les informations critiques',
               url: testUrl
             })
           }
         }
       } catch (error) {
         // Continuer avec le prochain fichier
       }
     }
    
  } catch (error) {
    console.error('Erreur lors du test de configuration serveur:', error)
  }
  
     return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
 }
 
 /**
  * Test des fichiers publics (robots.txt, sitemap.xml) pour vérifier qu'ils ne contiennent pas d'informations sensibles
  */
 async function testPublicFiles(url: string) {
   const vulnerabilities: any[] = []
   
   try {
     // Fichiers qui doivent être publics mais peuvent contenir des informations sensibles
     const publicFiles = [
       '/robots.txt',
       '/sitemap.xml',
       '/sitemap_index.xml'
     ]
     
     for (const file of publicFiles) {
       try {
         const testUrl = `${url}${file}`
         const response = await $fetch(testUrl, {
           method: 'GET',
           headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
         }).catch(() => null)
         
         if (response) {
           // Vérifier si le contenu contient des informations sensibles
           const hasSensitiveContent = await analyzePublicFileContent(file, response)
           
           if (hasSensitiveContent) {
             vulnerabilities.push({
               id: 'public-file-sensitive-content',
               title: 'Fichier public avec contenu sensible',
               severity: 'Medium',
               description: `Le fichier ${file} est public mais contient des informations sensibles`,
               recommendation: 'Nettoyer le contenu des fichiers publics ou restreindre l\'accès',
               url: testUrl
             })
           }
         }
       } catch (error) {
         // Continuer avec le prochain fichier
       }
     }
     
   } catch (error) {
     console.error('Erreur lors du test des fichiers publics:', error)
   }
   
   return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
 }
 
 async function testInformationDisclosure(url: string) {
  const vulnerabilities: any[] = []
  
  try {
    // Tester la divulgation d'informations sur le serveur
    const response = await $fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Serpenter Security Scanner/1.0' }
    }) as any
    
    const responseText = JSON.stringify(response)
    
    // Vérifier les informations sensibles
    if (responseText.includes('Server:') && responseText.includes('Apache') || responseText.includes('nginx')) {
      vulnerabilities.push({
        id: 'server-info-disclosure',
        title: 'Divulgation d\'informations serveur',
        severity: 'Low',
        description: 'Le type et la version du serveur sont visibles',
        recommendation: 'Masquer les informations du serveur dans les headers',
        url: url
      })
    }
    
    if (responseText.includes('PHP/') || responseText.includes('ASP.NET')) {
      vulnerabilities.push({
        id: 'technology-disclosure',
        title: 'Divulgation de la technologie',
        severity: 'Low',
        description: 'La technologie utilisée est visible',
        recommendation: 'Masquer les informations de version des technologies',
        url: url
      })
    }
    
  } catch (error) {
    console.error('Erreur lors du test de divulgation d\'informations:', error)
  }
  
     return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities }
 }
 
 /**
  * Analyse le contenu d'un fichier pour déterminer s'il est vraiment sensible
  */
 async function analyzeFileContent(filePath: string, content: any): Promise<boolean> {
   try {
     const contentStr = typeof content === 'string' ? content : JSON.stringify(content)
     
     // Fichiers de configuration qui peuvent être publics mais avec contenu sensible
     if (filePath.includes('.env')) {
       // Vérifier la présence de clés sensibles
       const sensitivePatterns = [
         /DB_PASSWORD/i,
         /API_KEY/i,
         /SECRET_KEY/i,
         /PASSWORD/i,
         /TOKEN/i,
         /PRIVATE_KEY/i
       ]
       
       return sensitivePatterns.some(pattern => pattern.test(contentStr))
     }
     
     if (filePath.includes('config.php') || filePath.includes('wp-config.php')) {
       // Vérifier la présence de configurations sensibles
       const sensitivePatterns = [
         /DB_PASSWORD/i,
         /DB_PASS/i,
         /SECRET_KEY/i,
         /AUTH_KEY/i,
         /NONCE_KEY/i
       ]
       
       return sensitivePatterns.some(pattern => pattern.test(contentStr))
     }
     
     if (filePath.includes('.git/config')) {
       // Vérifier la présence d'informations de déploiement
       return contentStr.includes('[remote "origin"]') && contentStr.includes('url')
     }
     
     if (filePath.includes('.htaccess') || filePath.includes('web.config')) {
       // Ces fichiers peuvent être publics mais vérifier s'ils exposent des informations sensibles
       const sensitivePatterns = [
         /#.*password/i,
         /#.*secret/i,
         /#.*key/i
       ]
       
       return sensitivePatterns.some(pattern => pattern.test(contentStr))
     }
     
     // Par défaut, considérer comme non sensible
     return false
     
   } catch (error) {
     console.error('Erreur lors de l\'analyse du contenu du fichier:', error)
     return false
   }
 }
 
 /**
  * Analyse le contenu des fichiers publics pour détecter les informations sensibles
  */
 async function analyzePublicFileContent(filePath: string, content: any): Promise<boolean> {
   try {
     const contentStr = typeof content === 'string' ? content : JSON.stringify(content)
     
     // Patterns d'informations sensibles dans les fichiers publics
     const sensitivePatterns = [
       // Chemins d'administration ou de développement
       /\/admin\//i,
       /\/wp-admin\//i,
       /\/phpmyadmin\//i,
       /\/cpanel\//i,
       /\/webmail\//i,
       
       // Fichiers de configuration ou de base de données
       /\.env/i,
       /\.sql/i,
       /\.db/i,
       /config\.php/i,
       /wp-config\.php/i,
       
       // Chemins de développement
       /\/\.git\//i,
       /\/\.svn\//i,
       /\/node_modules\//i,
       /\/vendor\//i,
       
       // Informations de serveur
       /server-info/i,
       /phpinfo/i,
       /test\.php/i,
       /debug\.php/i
     ]
     
     // Vérifier si le contenu contient des patterns sensibles
     return sensitivePatterns.some(pattern => pattern.test(contentStr))
     
   } catch (error) {
     console.error('Erreur lors de l\'analyse du contenu du fichier public:', error)
     return false
   }
 }
 
 function analyzeVulnerabilities(vulnerabilities: any[]) {
  const analysis: any = {
    total: vulnerabilities.length,
    bySeverity: {
      High: vulnerabilities.filter(v => v.severity === 'High').length,
      Medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
      Low: vulnerabilities.filter(v => v.severity === 'Low').length,
      Info: vulnerabilities.filter(v => v.severity === 'Info').length
    },
    byType: {}
  }
  
  // Analyser par type de vulnérabilité
  vulnerabilities.forEach(vuln => {
    const type = vuln.id.split('-')[0]
    analysis.byType[type] = (analysis.byType[type] || 0) + 1
  })
  
  return analysis
}

function calculateVulnerabilityScore(vulnerabilities: any[], analysis: any): number {
  let score = 100
  
  // Pénaliser selon la sévérité
  score -= analysis.bySeverity.High * 25
  score -= analysis.bySeverity.Medium * 15
  score -= analysis.bySeverity.Low * 5
  
  // Bonus si aucune vulnérabilité critique
  if (analysis.bySeverity.High === 0) score += 10
  
  return Math.max(0, Math.min(100, score))
}

function generateVulnerabilityRecommendations(vulnerabilities: any[], analysis: any): string[] {
  const recommendations: string[] = []
  
  if (analysis.bySeverity.High > 0) {
    recommendations.push('Corriger immédiatement les vulnérabilités critiques (High)')
  }
  
  if (analysis.bySeverity.Medium > 0) {
    recommendations.push('Traiter les vulnérabilités moyennes (Medium) dans les plus brefs délais')
  }
  
  if (analysis.byType.xss > 0) {
    recommendations.push('Implémenter une validation et un échappement strict des entrées utilisateur')
  }
  
  if (analysis.byType['error-info-disclosure'] > 0) {
    recommendations.push('Configurer des pages d\'erreur personnalisées sans informations techniques')
  }
  
  if (analysis.byType['missing-csp'] > 0) {
    recommendations.push('Implémenter une Content Security Policy stricte')
  }
  
  if (analysis.byType['sensitive-file-exposure'] > 0) {
    recommendations.push('Restreindre l\'accès aux fichiers sensibles et de configuration')
  }
  
  if (vulnerabilities.length === 0) {
    recommendations.push('Aucune vulnérabilité détectée - maintenir ce niveau de sécurité')
  }
  
  return recommendations
}
