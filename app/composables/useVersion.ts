import packageJson from '~/package.json'

export const useVersion = () => {
  const version = packageJson.version
  const name = packageJson.name
  
  // Parse semantic version
  const [major, minor, patch] = version.split('.').map(Number)
  
  // Build info (sera injecté au build time)
  const buildDate = process.env.BUILD_DATE || new Date().toISOString()
  const buildHash = process.env.BUILD_HASH || 'dev'
  const buildEnv = process.env.NODE_ENV || 'development'
  
  // Version complète avec build info
  const fullVersion = `${version}+${buildHash.slice(0, 7)}`
  
  // Flags de version pour features
  const versionFlags = {
    // Features disponibles selon la version
    hasLighthouse: major >= 1,
    hasSecurityScan: major >= 1,
    hasAdvancedAnalytics: major >= 1 && minor >= 1,
    hasBetaFeatures: major >= 1 && minor >= 2,
    
    // Flags de compatibilité
    isStable: major >= 1,
    isBeta: major === 0 && minor >= 9,
    isAlpha: major === 0 && minor < 9,
    
    // Flags d'environnement
    isDevelopment: buildEnv === 'development',
    isProduction: buildEnv === 'production',
    isPreview: buildEnv === 'preview'
  }
  
  // Informations de version formatées
  const versionInfo = {
    version,
    fullVersion,
    major,
    minor,
    patch,
    name,
    buildDate,
    buildHash,
    buildEnv,
    flags: versionFlags
  }
  
  // Méthodes utilitaires
  const isVersionAtLeast = (targetVersion: string): boolean => {
    const [targetMajor, targetMinor, targetPatch] = targetVersion.split('.').map(Number)
    
    if (major > targetMajor) return true
    if (major < targetMajor) return false
    
    if (minor > targetMinor) return true
    if (minor < targetMinor) return false
    
    return patch >= targetPatch
  }
  
  const getVersionString = (includeHash = false): string => {
    return includeHash ? fullVersion : version
  }
  
  const getVersionBadge = (): string => {
    if (versionFlags.isAlpha) return 'Alpha'
    if (versionFlags.isBeta) return 'Beta'
    if (versionFlags.isStable) return 'Stable'
    return 'Dev'
  }
  
  const getVersionColor = (): string => {
    if (versionFlags.isAlpha) return 'text-red-500'
    if (versionFlags.isBeta) return 'text-yellow-500'
    if (versionFlags.isStable) return 'text-green-500'
    return 'text-gray-500'
  }
  
  return {
    ...versionInfo,
    isVersionAtLeast,
    getVersionString,
    getVersionBadge,
    getVersionColor
  }
}
