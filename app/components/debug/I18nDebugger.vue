<template>
  <div v-if="showDebug" class="fixed bottom-20 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-xs max-w-md">
    <h3 class="font-bold mb-2">🔍 Debug i18n</h3>
    
    <div class="space-y-2">
      <div><strong>Locale actuelle:</strong> {{ currentLocale }}</div>
      <div><strong>i18n status:</strong> {{ i18nStatus }}</div>
      
      <div class="mt-3">
        <strong>État i18n:</strong>
        <div class="mt-1 space-y-1">
          <div><strong>Initialisé:</strong> {{ debugInfo.isInitialized ? '✅ Oui' : '❌ Non' }}</div>
          <div><strong>Locale:</strong> {{ debugInfo.currentLocale }}</div>
          <div><strong>Locales disponibles:</strong> {{ debugInfo.availableLocales?.length || 0 }}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <strong>Test des traductions:</strong>
        <div class="mt-1 space-y-1">
          <div v-for="test in debugInfo.testKeys" :key="test.key" :class="test.isTranslated ? 'text-green-400' : 'text-red-400'">
            {{ test.status }} {{ test.key }}: "{{ test.value }}"
          </div>
        </div>
      </div>
      
      <div class="mt-3">
        <strong>Traductions manquantes:</strong>
        <div class="mt-1 space-y-1">
          <div v-for="missing in missingTranslations" :key="missing" class="text-red-400">
            ❌ {{ missing }}
          </div>
        </div>
      </div>
      
      <div class="mt-3">
        <strong>Erreurs:</strong>
        <div class="mt-1 space-y-1">
          <div v-for="error in debugInfo.errors" :key="error" class="text-red-400">
            ❌ {{ error }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-3 flex space-x-2">
      <button @click="refreshDebug" class="text-xs text-blue-400 hover:text-blue-300">
        🔄 Rafraîchir
      </button>
      <button @click="showDebug = false" class="text-xs text-gray-400 hover:text-white">
        Fermer
      </button>
    </div>
  </div>
  
  <button 
    v-else
    @click="showDebug = true" 
    class="fixed bottom-20 left-4 z-50 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white text-xs"
    title="Debug i18n"
  >
    🔍
  </button>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nDebug } from '~/composables/useI18nDebug'

const showDebug = ref(false)
const { locale, t, te } = useI18n()
const { debugInfo, checkI18nStatus, logDebugInfo } = useI18nDebug()

const currentLocale = computed(() => locale?.value || 'undefined')

const i18nStatus = computed(() => {
  try {
    const testResult = t('welcome')
    return testResult !== 'welcome' ? '✅ OK' : '❌ KO'
  } catch (error) {
    return '❌ Error'
  }
})

const testTranslation = (key) => {
  try {
    const result = t(key)
    return result !== key ? result : '❌ MANQUANT'
  } catch (error) {
    return '❌ ERROR'
  }
}

const missingTranslations = computed(() => {
  const keys = ['welcome', 'categories.seo.name', 'categories.performance.name', 'app.title']
  return keys.filter(key => {
    try {
      return t(key) === key
    } catch {
      return true
    }
  })
})

// Fonction pour rafraîchir le debug
const refreshDebug = () => {
  checkI18nStatus()
  logDebugInfo()
}

// Afficher automatiquement en mode développement
onMounted(() => {
  if (process.env.NODE_ENV === 'development') {
    showDebug.value = true
    // Initialiser le debug au montage
    nextTick(() => {
      refreshDebug()
    })
  }
})
</script>
