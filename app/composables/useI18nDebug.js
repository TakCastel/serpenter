// Composable de debug pour l'i18n
// Aide à diagnostiquer les problèmes de traduction en production

export const useI18nDebug = () => {
  const { t, te, locale, locales } = useI18n()
  
  // État de debug
  const debugInfo = ref({
    isInitialized: false,
    currentLocale: null,
    availableLocales: [],
    testKeys: {},
    errors: []
  })

  // Tester une clé de traduction
  const testKey = (key, expectedFallback = null) => {
    try {
      const exists = te(key)
      const value = t(key)
      const isTranslated = value !== key
      
      const result = {
        key,
        exists,
        value,
        isTranslated,
        fallback: expectedFallback,
        status: isTranslated ? '✅ OK' : '❌ MANQUANT'
      }
      
      if (!isTranslated && expectedFallback) {
        result.status = '⚠️ FALLBACK'
      }
      
      return result
    } catch (error) {
      return {
        key,
        exists: false,
        value: null,
        isTranslated: false,
        error: error.message,
        status: '💥 ERROR'
      }
    }
  }

  // Vérifier l'état de l'i18n
  const checkI18nStatus = () => {
    const testKeys = [
      'welcome',
      'categories.seo.name',
      'categories.performance.name',
      'app.title'
    ]
    
    debugInfo.value = {
      isInitialized: te && typeof te === 'function',
      currentLocale: locale.value,
      availableLocales: locales.value,
      testKeys: testKeys.map(key => testKey(key)),
      errors: []
    }
    
    // Vérifier si l'i18n est fonctionnel
    const welcomeTest = testKey('welcome')
    if (!welcomeTest.isTranslated) {
      debugInfo.value.errors.push(`Clé 'welcome' non traduite: ${welcomeTest.value}`)
    }
    
    return debugInfo.value
  }

  // Attendre que l'i18n soit prêt
  const waitForI18nReady = async (timeout = 10000) => {
    return new Promise((resolve) => {
      const startTime = Date.now()
      
      const check = () => {
        const status = checkI18nStatus()
        
        if (status.isInitialized && status.testKeys.some(k => k.isTranslated)) {
          resolve(status)
          return
        }
        
        if (Date.now() - startTime > timeout) {
          console.warn('Timeout lors de l\'attente i18n')
          resolve(status)
          return
        }
        
        setTimeout(check, 100)
      }
      
      check()
    })
  }

  // Log des informations de debug
  const logDebugInfo = () => {
    const status = checkI18nStatus()
    
    console.group('🔍 Debug i18n')
    console.log('État:', status.isInitialized ? '✅ Initialisé' : '❌ Non initialisé')
    console.log('Locale actuelle:', status.currentLocale)
    console.log('Locales disponibles:', status.availableLocales)
    
    console.group('Tests des clés:')
    status.testKeys.forEach(test => {
      console.log(`${test.status} ${test.key}: ${test.value}`)
    })
    console.groupEnd()
    
    if (status.errors.length > 0) {
      console.group('❌ Erreurs:')
      status.errors.forEach(error => console.error(error))
      console.groupEnd()
    }
    
    console.groupEnd()
    
    return status
  }

  return {
    debugInfo: readonly(debugInfo),
    testKey,
    checkI18nStatus,
    waitForI18nReady,
    logDebugInfo
  }
}
