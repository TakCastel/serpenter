<template>
  <div v-if="showDebug" class="fixed bottom-20 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-xs max-w-md">
    <h3 class="font-bold mb-2">🔍 Debug i18n</h3>
    
    <div class="space-y-2">
      <div><strong>Locale actuelle:</strong> {{ currentLocale }}</div>
      <div><strong>i18n status:</strong> {{ i18nStatus }}</div>
      
      <div class="mt-3">
        <strong>Test des traductions:</strong>
        <div class="mt-1 space-y-1">
          <div>welcome: "{{ testTranslation('welcome') }}"</div>
          <div>categories.seo.name: "{{ testTranslation('categories.seo.name') }}"</div>
          <div>categories.performance.name: "{{ testTranslation('categories.performance.name') }}"</div>
          <div>app.title: "{{ testTranslation('app.title') }}"</div>
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
    </div>
    
    <button @click="showDebug = false" class="mt-3 text-xs text-gray-400 hover:text-white">
      Fermer
    </button>
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const showDebug = ref(false)
const { locale, t, te } = useI18n()

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

// Afficher automatiquement en mode développement
onMounted(() => {
  if (process.env.NODE_ENV === 'development') {
    showDebug.value = true
  }
})
</script>
