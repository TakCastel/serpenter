<template>
  <details class="rounded-xl border" style="border-color: var(--bg-border);" :open="isOpen">
    <summary 
      class="cursor-pointer px-4 py-3 text-sm flex items-center justify-between hover:bg-opacity-50" 
      style="background-color: var(--bg-surface);"
      @click.prevent="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <Icon name="heroicons:shield-check" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }" />
        <span class="font-semibold" style="color: var(--text-primary);">Security Headers</span>
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
      <!-- Formulaire de scan -->
      <div class="space-y-4">
        <div class="flex gap-3">
          <input
            v-model="url"
            type="url"
            placeholder="https://exemple.com"
            class="flex-1 px-3 py-2 rounded-lg border text-sm"
            :class="{ 'border-red-500': url && !isValidUrl, 'border-green-500': url && isValidUrl }"
            style="background-color: var(--bg-primary); border-color: var(--bg-border); color: var(--text-primary);"
            @input="validateUrl"
          />
          <button
            @click="scanSecurityHeaders"
            :disabled="loading || !isValidUrl || !url"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            :class="{ 'opacity-50 cursor-not-allowed': loading || !isValidUrl || !url }"
            style="background-color: var(--accent-primary); color: white;"
          >
            <Icon v-if="!loading" name="heroicons:play" class="w-4 h-4" />
            <Icon v-else name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
            <span>{{ loading ? 'Scan en cours...' : 'Scanner' }}</span>
          </button>
        </div>
        
        <!-- Message d'erreur URL -->
        <div v-if="url && !isValidUrl" class="text-sm text-red-500">
          Veuillez entrer une URL valide (ex: https://exemple.com)
        </div>
      </div>

      <!-- Résultats organisés et clairs -->
      <div v-if="results" class="space-y-4 mt-6">
        <!-- Score global avec indicateur visuel -->
        <div class="p-4 rounded-lg border-2" :style="{ borderColor: getScoreColor(score) }">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-lg font-bold" style="color: var(--text-primary);">Score de sécurité</h3>
              <p class="text-sm" style="color: var(--text-secondary);">{{ getScoreDescription(score) }}</p>
            </div>
            <div class="w-16 h-16 rounded-full grid place-items-center" :style="{ backgroundColor: getScoreColor(score) }">
              <span class="text-lg font-bold text-white">{{ score }}</span>
            </div>
          </div>
          
          <!-- Indicateur de source -->
          <div class="flex items-center gap-2 text-xs" style="color: var(--text-secondary);">
            <Icon :name="getSourceIcon()" class="w-3 h-3" />
            <span>Source : {{ getSourceLabel() }}</span>
          </div>
        </div>

        <!-- Résumé des headers par statut -->
        <div class="p-4 rounded-lg border" style="border-color: var(--bg-border);">
          <h4 class="text-sm font-semibold mb-3" style="color: var(--text-primary);">Résumé des headers de sécurité</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="text-center p-3 rounded-lg" style="background-color: #10b981; color: white;">
              <div class="text-lg font-bold">{{ getHeaderCount('present') }}</div>
              <div class="text-xs">Présents</div>
            </div>
            <div class="text-center p-3 rounded-lg" style="background-color: #f59e0b; color: white;">
              <div class="text-lg font-bold">{{ getHeaderCount('missing') }}</div>
              <div class="text-xs">Manquants</div>
            </div>
            <div class="text-center p-3 rounded-lg" style="background-color: #ef4444; color: white;">
              <div class="text-lg font-bold">{{ getHeaderCount('weak') }}</div>
              <div class="text-xs">Faibles</div>
            </div>
            <div class="text-center p-3 rounded-lg" style="background-color: #6b7280; color: white;">
              <div class="text-lg font-bold">{{ getHeaderCount('unknown') }}</div>
              <div class="text-xs">Inconnus</div>
            </div>
          </div>
        </div>

        <!-- Headers principaux -->
        <div v-if="topHeaders.length > 0" class="p-4 rounded-lg border" style="border-color: var(--bg-border);">
          <h4 class="text-sm font-semibold mb-3" style="color: var(--text-primary);">Headers de sécurité principaux</h4>
          <div class="space-y-3">
            <div 
              v-for="(header, index) in topHeaders" 
              :key="index"
              class="p-3 rounded-lg border-l-4"
              :style="{ borderLeftColor: getHeaderStatusColor(header.status) }"
              style="border-color: var(--bg-border); background-color: var(--bg-surface);"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium" style="color: var(--text-primary);">{{ header.name }}</span>
                    <span 
                      class="px-2 py-1 rounded text-xs font-medium text-white"
                      :style="{ backgroundColor: getHeaderStatusColor(header.status) }"
                    >
                      {{ getHeaderStatusLabel(header.status) }}
                    </span>
                  </div>
                  <p class="text-xs" style="color: var(--text-secondary);">{{ header.description }}</p>
                  <div v-if="header.value" class="mt-2 p-2 rounded text-xs font-mono" style="background-color: var(--bg-surface); color: var(--text-secondary);">
                    {{ header.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommandations principales -->
        <div v-if="topRecommendations.length > 0" class="p-4 rounded-lg border" style="border-color: var(--bg-border);">
          <h4 class="text-sm font-semibold mb-3" style="color: var(--text-primary);">Recommandations principales</h4>
          <ul class="space-y-2">
            <li 
              v-for="(rec, index) in topRecommendations" 
              :key="index"
              class="flex items-start gap-2 text-sm"
              style="color: var(--text-secondary);"
            >
              <Icon name="heroicons:light-bulb" class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: var(--accent-primary);" />
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'


interface Props {
  url: string
  isValidUrl: boolean
  isOpen: boolean
}

interface SecurityHeader {
  name: string
  status: 'present' | 'missing' | 'weak' | 'unknown'
  description: string
  value?: string
  recommendation?: string
}

interface SecurityHeadersResults {
  score: number
  headers: SecurityHeader[]
  recommendations: string[]
  source: string
  summary: {
    present: number
    missing: number
    weak: number
    unknown: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

// État local
const loading = ref(false)
const results = ref<SecurityHeadersResults | null>(null)
const url = ref(props.url)
const isValidUrl = ref(props.isValidUrl)

// Computed
const score = computed(() => results.value?.score || 0)
const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const topHeaders = computed(() => {
  if (!results.value?.headers) return []
  return results.value.headers.slice(0, 5)
})

const topRecommendations = computed(() => {
  if (!results.value?.recommendations) return []
  return results.value.recommendations.slice(0, 3)
})

// Méthodes
const validateUrl = () => {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  isValidUrl.value = urlPattern.test(url.value)
}

const scanSecurityHeaders = async () => {
  if (!isValidUrl.value || !url.value) return

  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/scan-headers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: SecurityHeadersResults = await response.json()
    results.value = data
  } catch (error) {
    console.error('Error scanning security headers:', error)
    results.value = null
  } finally {
    loading.value = false
  }
}

const ringStyle = (score: number) => {
  const color = getScoreColor(score)
  return {
    background: `conic-gradient(${color} ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)`
  }
}

const getScoreDescription = (score: number): string => {
  if (score >= 90) return 'Excellent - Tous les headers de sécurité essentiels sont présents'
  if (score >= 70) return 'Bon - La plupart des headers de sécurité sont configurés'
  if (score >= 50) return 'Moyen - Certains headers de sécurité sont manquants'
  return 'Faible - Beaucoup de headers de sécurité sont manquants ou mal configurés'
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

const getSourceIcon = (): string => {
  if (!results.value) return 'heroicons:question-mark-circle'
  
  switch (results.value.source) {
    case 'manual-scan': return 'heroicons:server'
    case 'mozilla-observatory': return 'heroicons:globe-alt'
    default: return 'heroicons:question-mark-circle'
  }
}

const getSourceLabel = (): string => {
  if (!results.value) return 'Inconnu'
  
  switch (results.value.source) {
    case 'manual-scan': return 'Scanner local (analyse des headers HTTP)'
    case 'mozilla-observatory': return 'Mozilla Observatory (analyse approfondie)'
    default: return 'Source inconnue'
  }
}

const getHeaderCount = (status: string): number => {
  if (!results.value?.summary) return 0
  return results.value.summary[status as keyof typeof results.value.summary] || 0
}

const getHeaderStatusColor = (status: string): string => {
  switch (status) {
    case 'present': return '#10b981'
    case 'missing': return '#f59e0b'
    case 'weak': return '#ef4444'
    case 'unknown': return '#6b7280'
    default: return '#6b7280'
  }
}

const getHeaderStatusLabel = (status: string): string => {
  switch (status) {
    case 'present': return 'PRÉSENT'
    case 'missing': return 'MANQUANT'
    case 'weak': return 'FAIBLE'
    case 'unknown': return 'INCONNU'
    default: return 'INCONNU'
  }
}
</script>

