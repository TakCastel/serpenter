<template>
  <details class="rounded-xl border" style="border-color: var(--bg-border);" :open="isOpen">
    <summary 
      class="cursor-pointer px-4 py-3 text-sm flex items-center justify-between hover:bg-opacity-50" 
      style="background-color: var(--bg-surface);"
      @click.prevent="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <Icon name="heroicons:shield-check" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }" />
        <span class="font-semibold" style="color: var(--text-primary);">Headers de Sécurité</span>
        <div v-if="score !== undefined" class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full grid place-items-center" :style="ringStyle(score)">
            <span class="text-xs font-bold text-white">{{ score }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="loading" class="text-xs" style="color: var(--text-secondary);">Scan en cours...</span>
        <Icon :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-4 h-4" :style="{ color: 'var(--text-secondary)' }" />
      </div>
    </summary>
    
    <div class="px-4 pb-4">
      <!-- Contenu de l'accordéon -->
      <div class="space-y-4">
        <!-- Description -->
        <p class="text-sm" style="color: var(--text-secondary);">
          Analyse des en-têtes HTTP de sécurité pour détecter les vulnérabilités et bonnes pratiques.
        </p>

        <!-- Bouton de scan -->
        <div class="flex items-center gap-3">
          <button 
            @click="runScan" 
            :disabled="loading || !isValidUrl || !url"
            class="btn btn-primary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': !isValidUrl || !url }"
          >
            <span v-if="!loading">Scanner les headers</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Scan...
            </span>
          </button>
          
          <span v-if="error" class="text-sm" style="color: #fca5a5;">{{ error }}</span>
        </div>

        <!-- Résultats -->
        <div v-if="results" class="space-y-4">
          <!-- Score global -->
          <div class="p-3 rounded-lg" style="background-color: var(--bg-surface);">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold" style="color: var(--text-primary);">Score global</span>
              <div class="w-12 h-12 rounded-full grid place-items-center" :style="ringStyle(score)">
                <span class="text-sm font-bold text-white">{{ score }}</span>
              </div>
            </div>
            <div class="text-xs" style="color: var(--text-secondary);">
              {{ getScoreDescription(score) }}
            </div>
          </div>

          <!-- Détails des headers -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold" style="color: var(--text-primary);">Détails des headers</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="header in securityHeaders" :key="header.name" 
                   class="p-3 rounded-lg border" 
                   :style="{ borderColor: header.status === 'present' ? 'var(--accent-primary)' : 'var(--bg-border)' }">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium" style="color: var(--text-primary);">{{ header.name }}</span>
                  <div class="flex items-center gap-1">
                    <Icon 
                      :name="header.status === 'present' ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                      class="w-4 h-4" 
                      :style="{ color: header.status === 'present' ? 'var(--accent-primary)' : '#fca5a5' }" 
                    />
                  </div>
                </div>
                <div class="text-xs" style="color: var(--text-secondary);">
                  {{ header.description }}
                </div>
                <div v-if="header.value" class="text-xs mt-1 font-mono" style="color: var(--text-muted);">
                  {{ header.value }}
                </div>
              </div>
            </div>
          </div>

          <!-- Recommandations -->
          <div v-if="recommendations.length > 0" class="p-3 rounded-lg" style="background-color: var(--bg-surface);">
            <h4 class="text-sm font-semibold mb-2" style="color: var(--text-primary);">Recommandations</h4>
            <ul class="space-y-1">
              <li v-for="rec in recommendations" :key="rec" class="text-xs flex items-start gap-2">
                <Icon name="heroicons:information-circle" class="w-3 h-3 mt-0.5 flex-shrink-0" :style="{ color: 'var(--accent-primary)' }" />
                <span style="color: var(--text-secondary);">{{ rec }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props
interface Props {
  url: string
  isValidUrl: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['items-autochecked'])

// État local
const isOpen = ref(false)
const loading = ref(false)
const error = ref('')
const results = ref<any>(null)

// Computed
const score = computed(() => {
  if (!results.value) return undefined
  return Math.round(results.value.score * 100)
})

const hasResults = computed(() => !!results.value)

const securityHeaders = computed(() => {
  if (!results.value?.headers) return []
  
  return [
    {
      name: 'Content-Security-Policy',
      status: results.value.headers['content-security-policy'] ? 'present' : 'missing',
      description: 'Protection contre les attaques XSS et injection',
      value: results.value.headers['content-security-policy']
    },
    {
      name: 'X-Frame-Options',
      status: results.value.headers['x-frame-options'] ? 'present' : 'missing',
      description: 'Protection contre le clickjacking',
      value: results.value.headers['x-frame-options']
    },
    {
      name: 'X-Content-Type-Options',
      status: results.value.headers['x-content-type-options'] ? 'present' : 'missing',
      description: 'Prévention du MIME sniffing',
      value: results.value.headers['x-content-type-options']
    },
    {
      name: 'X-XSS-Protection',
      status: results.value.headers['x-xss-protection'] ? 'present' : 'missing',
      description: 'Protection XSS du navigateur',
      value: results.value.headers['x-xss-protection']
    },
    {
      name: 'Strict-Transport-Security',
      status: results.value.headers['strict-transport-security'] ? 'present' : 'missing',
      description: 'Forcer HTTPS',
      value: results.value.headers['strict-transport-security']
    },
    {
      name: 'Referrer-Policy',
      status: results.value.headers['referrer-policy'] ? 'present' : 'missing',
      description: 'Contrôle des informations de référence',
      value: results.value.headers['referrer-policy']
    }
  ]
})

const recommendations = computed(() => {
  const recs = []
  
  if (!results.value?.headers['content-security-policy']) {
    recs.push('Ajouter un Content-Security-Policy pour protéger contre les attaques XSS')
  }
  
  if (!results.value?.headers['x-frame-options']) {
    recs.push('Configurer X-Frame-Options pour prévenir le clickjacking')
  }
  
  if (!results.value?.headers['strict-transport-security']) {
    recs.push('Implémenter HSTS pour forcer l\'utilisation de HTTPS')
  }
  
  return recs
})

// Méthodes
const runScan = async () => {
  if (!props.url || !props.isValidUrl) return
  
  loading.value = true
  error.value = ''
  results.value = null
  
  try {
    // Appel à l'API backend
    const response = await $fetch('/api/security-headers', {
      method: 'POST',
      body: { url: props.url }
    })
    
    if (response.success) {
      const scanResults = response.data
      
      // Convertir le score de pourcentage (0-100) vers décimal (0-1)
      const scoreDecimal = scanResults.score / 100
      
      results.value = {
        score: scoreDecimal,
        headers: scanResults.headers,
        analysis: scanResults.analysis,
        recommendations: scanResults.recommendations
      }
      
      // Auto-cochage des éléments de checklist
      const autoCheckedItems = getAutoCheckedItems()
      if (autoCheckedItems.length > 0) {
        emit('items-autochecked', autoCheckedItems)
      }
    } else {
      throw new Error('Erreur lors du scan des headers de sécurité')
    }
    
  } catch (err: any) {
    error.value = err?.message || 'Erreur lors du scan des headers de sécurité'
    console.error('Erreur lors du scan des headers:', err)
  } finally {
    loading.value = false
  }
}

const getAutoCheckedItems = (): string[] => {
  if (!results.value) return []
  
  const checkedItems = []
  
  // Mapping des headers vers les éléments de checklist
  if (results.value.headers['content-security-policy']) {
    checkedItems.push('content-security-policy')
  }
  
  if (results.value.headers['x-frame-options']) {
    checkedItems.push('security-headers')
  }
  
  if (results.value.headers['strict-transport-security']) {
    checkedItems.push('hsts-enabled')
  }
  
  return checkedItems
}

const getScoreDescription = (score: number): string => {
  if (score >= 90) return 'Excellent - Tous les headers de sécurité sont configurés'
  if (score >= 70) return 'Bon - La plupart des headers de sécurité sont présents'
  if (score >= 50) return 'Moyen - Certains headers de sécurité manquent'
  return 'Faible - Beaucoup de headers de sécurité sont manquants'
}

// Utilitaires
const ringStyle = (val: number) => ({
  background: `conic-gradient(var(--accent-primary) ${val * 3.6}deg, var(--bg-border) 0)`
})

// Méthode pour réinitialiser l'état
const reset = () => {
  loading.value = false
  error.value = ''
  results.value = null
  isOpen.value = false
}

// Exposer les méthodes
defineExpose({
  runScan,
  reset,
  loading,
  score,
  hasResults
})
</script>
