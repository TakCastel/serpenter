/**
 * Mapping des résultats de sécurité vers les IDs des éléments de checklist
 * Ce fichier permet d'automatiquement cocher les éléments de checklist
 * basé sur les résultats des scans de sécurité
 */

// Mapping des headers de sécurité vers les IDs de checklist
const securityHeadersMapping: Record<string, string[]> = {
  'content-security-policy': ['content-security-policy'],
  'x-frame-options': ['security-headers'],
  'x-content-type-options': ['security-headers'],
  'x-xss-protection': ['security-headers'],
  'strict-transport-security': ['hsts-enabled'],
  'referrer-policy': ['security-headers'],
  'permissions-policy': ['security-headers'],
  'cross-origin-embedder-policy': ['security-headers'],
  'cross-origin-opener-policy': ['security-headers'],
  'cross-origin-resource-policy': ['security-headers']
}

// Mapping des vulnérabilités vers les IDs de checklist
const vulnerabilityMapping: Record<string, string[]> = {
  'xss': ['xss-protection'],
  'csrf': ['csrf-protection'],
  'injection': ['sql-injection-protection'],
  'error-handling': ['secure-error-handling'],
  'input-validation': ['input-validation'],
  'file-upload': ['secure-file-upload'],
  'authentication': ['secure-authentication'],
  'session-management': ['secure-session-management']
}

/**
 * Collecte les IDs des éléments de checklist basés sur les headers de sécurité
 */
export function collectChecklistItemIdsFromHeaders(headers: Record<string, string | null>): string[] {
  const itemIds: string[] = []
  
  // Vérifier chaque header de sécurité
  Object.entries(headers).forEach(([headerName, headerValue]) => {
    if (headerValue !== null) {
      // Header présent - cocher les éléments correspondants
      const mappedItems = securityHeadersMapping[headerName] || []
      itemIds.push(...mappedItems)
    }
  })
  
  // Ajouter des éléments basés sur des combinaisons spécifiques
  if (headers['content-security-policy'] && headers['x-frame-options']) {
    itemIds.push('basic-security-headers')
  }
  
  if (headers['strict-transport-security']) {
    itemIds.push('https-enforcement')
  }
  
  return [...new Set(itemIds)] // Supprimer les doublons
}

/**
 * Collecte les IDs des éléments de checklist basés sur les vulnérabilités détectées
 */
export function collectChecklistItemIdsFromVulnerabilities(vulnerabilityResults: any): string[] {
  const itemIds: string[] = []
  
  if (!vulnerabilityResults || !vulnerabilityResults.vulnerabilities) {
    return itemIds
  }
  
  // Vérifier chaque vulnérabilité
  vulnerabilityResults.vulnerabilities.forEach((vuln: any) => {
    const vulnType = vuln.type || vuln.name || ''
    const mappedItems = vulnerabilityMapping[vulnType.toLowerCase()] || []
    itemIds.push(...mappedItems)
  })
  
  return [...new Set(itemIds)] // Supprimer les doublons
}

/**
 * Collecte tous les IDs des éléments de checklist basés sur tous les résultats
 */
export function collectAllSecurityChecklistItemIds(
  headersResults?: any, 
  vulnerabilityResults?: any
): string[] {
  const allItemIds: string[] = []
  
  // Headers de sécurité
  if (headersResults && headersResults.headers) {
    allItemIds.push(...collectChecklistItemIdsFromHeaders(headersResults.headers))
  }
  
  // Vulnérabilités
  if (vulnerabilityResults) {
    allItemIds.push(...collectChecklistItemIdsFromVulnerabilities(vulnerabilityResults))
  }
  
  return [...new Set(allItemIds)] // Supprimer les doublons
}

/**
 * Détermine si un élément de checklist doit être automatiquement coché
 */
export function shouldAutoCheckItem(itemId: string, scanResults: any): boolean {
  if (!scanResults) return false
  
  const allItemIds = collectAllSecurityChecklistItemIds(
    scanResults.headers,
    scanResults.vulnerabilities
  )
  
  return allItemIds.includes(itemId)
}

/**
 * Génère un rapport de mapping pour l'interface utilisateur
 */
export function generateMappingReport(
  headersResults?: any, 
  vulnerabilityResults?: any
): any {
  const headersItems = headersResults ? collectChecklistItemIdsFromHeaders(headersResults.headers || {}) : []
  const vulnerabilityItems = vulnerabilityResults ? collectChecklistItemIdsFromVulnerabilities(vulnerabilityResults) : []
  
  return {
    headers: {
      score: headersResults?.score || 0,
      mappedItems: headersItems
    },
    vulnerabilities: {
      score: vulnerabilityResults?.score || 0,
      mappedItems: vulnerabilityItems
    },
    allMappedItems: collectAllSecurityChecklistItemIds(headersResults, vulnerabilityResults)
  }
}
