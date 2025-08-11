<template>
  <div class="unified-security-scan">
    <!-- En-tête explicatif -->
    <div class="scan-header">
      <div class="header-icon">
        <Icon name="heroicons:shield-check" class="w-6 h-6" :style="{ color: 'var(--accent-primary)' }" />
      </div>
      <div class="header-content">
        <h3 class="header-title">Audit de sécurité complet</h3>
        <p class="header-description">
          Analyse automatique de la sécurité de votre site web en une seule action
        </p>
      </div>
    </div>

    <!-- Bouton de scan principal -->
    <div class="scan-actions">
      <button 
        @click="startFullScan" 
        :disabled="loading || !isValidUrl || !url"
        class="scan-button primary"
        :class="{ 'loading': loading, 'disabled': !isValidUrl || !url }"
      >
        <span v-if="!loading" class="button-content">
          <Icon name="heroicons:play" class="w-5 h-5" />
          <span>Lancer l'audit de sécurité</span>
        </span>
        <span v-else class="button-content loading">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Audit en cours...</span>
        </span>
      </button>

      <!-- Bouton de scan rapide (optionnel) -->
      <button 
        v-if="showQuickScan"
        @click="startQuickScan" 
        :disabled="loading || !isValidUrl || !url"
        class="scan-button secondary"
        :class="{ 'disabled': !isValidUrl || !url }"
      >
        <Icon name="heroicons:bolt" class="w-4 h-4" />
        <span>Scan rapide (headers uniquement)</span>
      </button>
    </div>

    <!-- Description des services -->
    <div class="services-info">
      <div class="service-item">
        <Icon name="heroicons:globe-alt" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" />
        <div>
          <strong>Lighthouse</strong>
          <span>Analyse complète des performances et de la sécurité</span>
        </div>
      </div>
      <div class="service-item">
        <Icon name="heroicons:server" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" />
        <div>
          <strong>Headers de sécurité</strong>
          <span>Vérification des en-têtes HTTP de sécurité</span>
        </div>
      </div>
      <div class="service-item">
        <Icon name="heroicons:shield-check" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" />
        <div>
          <strong>Vulnérabilités</strong>
          <span>Détection des vulnérabilités web courantes</span>
        </div>
      </div>
    </div>

    <!-- Statut du scan -->
    <div v-if="scanStatus" class="scan-status">
      <div class="status-header">
        <Icon :name="getStatusIcon()" class="w-4 h-4" :style="{ color: getStatusColor() }" />
        <span class="status-title">{{ scanStatus.title }}</span>
      </div>
      <p class="status-description">{{ scanStatus.description }}</p>
      
      <!-- Progression si disponible -->
      <div v-if="scanStatus.progress" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${scanStatus.progress}%` }"></div>
      </div>
    </div>



    <!-- Résultats rapides -->
    <div v-if="quickResults" class="quick-results">
      <h4 class="results-title">Résultats du scan rapide</h4>
      <div class="results-grid">
        <div class="result-item">
          <span class="result-label">Headers de sécurité</span>
          <span class="result-value" :class="getScoreClass(quickResults.headersScore)">
            {{ quickResults.headersScore }}/100
          </span>
        </div>
        <div class="result-item">
          <span class="result-label">Configuration SSL</span>
          <span class="result-value" :class="getScoreClass(quickResults.sslScore)">
            {{ quickResults.sslScore }}/100
          </span>
        </div>
      </div>
      <button @click="startFullScan" class="upgrade-button">
        <Icon name="heroicons:arrow-up" class="w-4 h-4" />
        <span>Lancer l'audit complet pour plus de détails</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'


interface Props {
  url: string
  isValidUrl: boolean
  showQuickScan?: boolean
}

interface ScanStatus {
  title: string
  description: string
  progress?: number
  type: 'scanning' | 'success' | 'error' | 'warning'
}

interface QuickResults {
  headersScore: number
  sslScore: number
  timestamp: string
}

const props = withDefaults(defineProps<Props>(), {
  showQuickScan: true
})

const emit = defineEmits<{
  'scan-started': []
  'scan-completed': [results: any]
  'quick-scan-completed': [results: QuickResults]
}>()

// État local
const loading = ref(false)
const scanStatus = ref<ScanStatus | null>(null)

const quickResults = ref<QuickResults | null>(null)

// Computed
const canScan = computed(() => props.isValidUrl && props.url && !loading.value)

// Méthodes
const startFullScan = async () => {
  if (!canScan.value) return
  
  loading.value = true
  scanStatus.value = {
    title: 'Audit de sécurité en cours',
    description: 'Analyse complète de la sécurité de votre site...',
    type: 'scanning',
    progress: 0
  }
  
  emit('scan-started')
  
  try {
    // Simuler la progression
    const progressInterval = setInterval(() => {
      if (scanStatus.value && scanStatus.value.progress !== undefined) {
        scanStatus.value.progress = Math.min(90, scanStatus.value.progress + 10)
      }
    }, 1000)
    
    // Lancer le scan complet (sera géré par le composant parent)
    // Ici on simule juste le processus
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    clearInterval(progressInterval)
    
    scanStatus.value = {
      title: 'Audit terminé',
      description: 'Analyse de sécurité complète terminée avec succès',
      type: 'success',
      progress: 100
    }
    
    // Émettre l'événement de completion
    emit('scan-completed', { success: true })
    
  } catch (error) {
    scanStatus.value = {
      title: 'Erreur lors de l\'audit',
      description: 'Une erreur est survenue lors de l\'analyse de sécurité',
      type: 'error'
    }
    
    console.error('Erreur lors du scan complet:', error)
  } finally {
    loading.value = false
    
    // Effacer le statut après 5 secondes
    setTimeout(() => {
      scanStatus.value = null
    }, 5000)
  }
}

const startQuickScan = async () => {
  if (!canScan.value) return
  
  loading.value = true
  scanStatus.value = {
    title: 'Scan rapide en cours',
    description: 'Vérification des headers de sécurité et configuration SSL...',
    type: 'scanning',
    progress: 0
  }
  
  try {
    // Simuler la progression
    const progressInterval = setInterval(() => {
      if (scanStatus.value && scanStatus.value.progress !== undefined) {
        scanStatus.value.progress = Math.min(90, scanStatus.value.progress + 20)
      }
    }, 500)
    
    // Lancer le scan rapide
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    clearInterval(progressInterval)
    
    // Résultats simulés
    const results: QuickResults = {
      headersScore: Math.floor(Math.random() * 40) + 60, // 60-100
      sslScore: Math.floor(Math.random() * 30) + 70, // 70-100
      timestamp: new Date().toISOString()
    }
    
    quickResults.value = results
    
    scanStatus.value = {
      title: 'Scan rapide terminé',
      description: 'Vérification rapide terminée avec succès',
      type: 'success',
      progress: 100
    }
    
    emit('quick-scan-completed', results)
    
  } catch (error) {
    scanStatus.value = {
      title: 'Erreur lors du scan rapide',
      description: 'Une erreur est survenue lors de la vérification rapide',
      type: 'error'
    }
    
    console.error('Erreur lors du scan rapide:', error)
  } finally {
    loading.value = false
    
    // Effacer le statut après 3 secondes
    setTimeout(() => {
      scanStatus.value = null
    }, 3000)
  }
}

const getStatusIcon = () => {
  if (!scanStatus.value) return 'heroicons:information-circle'
  
  switch (scanStatus.value.type) {
    case 'scanning': return 'heroicons:arrow-path'
    case 'success': return 'heroicons:check-circle'
    case 'error': return 'heroicons:x-circle'
    case 'warning': return 'heroicons:exclamation-triangle'
    default: return 'heroicons:information-circle'
  }
}

const getStatusColor = () => {
  if (!scanStatus.value) return 'var(--text-secondary)'
  
  switch (scanStatus.value.type) {
    case 'scanning': return 'var(--accent-primary)'
    case 'success': return '#10b981'
    case 'error': return '#ef4444'
    case 'warning': return '#f59e0b'
    default: return 'var(--text-secondary)'
  }
}

const getScoreClass = (score: number) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 50) return 'score-average'
  return 'score-poor'
}
</script>

<style scoped>
.unified-security-scan {
  @apply space-y-6 p-6 rounded-xl border-2;
  border-color: var(--bg-border);
  background: var(--bg-surface);
}

.scan-header {
  @apply flex items-start gap-4;
}

.header-icon {
  @apply flex-shrink-0 mt-1;
}

.header-content {
  @apply flex-1;
}

.header-title {
  @apply text-lg font-bold mb-2;
  color: var(--text-primary);
}

.header-description {
  @apply text-sm;
  color: var(--text-secondary);
}

.scan-actions {
  @apply space-y-3;
}

.scan-button {
  @apply w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all duration-200;
}

.scan-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800;
}

.scan-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-300;
}

.scan-button.loading {
  @apply opacity-80 cursor-wait;
}

.scan-button.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.button-content {
  @apply flex items-center gap-3;
}

.button-content.loading {
  @apply animate-pulse;
}

.services-info {
  @apply space-y-3 p-4 rounded-lg;
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
}

.service-item {
  @apply flex items-start gap-3 text-sm;
}

.service-item > div {
  @apply flex-1;
}

.service-item strong {
  @apply block font-medium mb-1;
  color: var(--text-primary);
}

.service-item span {
  @apply text-xs;
  color: var(--text-secondary);
}

.scan-status {
  @apply p-4 rounded-lg border-l-4;
  border-left-color: var(--accent-primary);
  background: var(--bg-surface);
}

.status-header {
  @apply flex items-center gap-2 mb-2;
}

.status-title {
  @apply font-medium;
  color: var(--text-primary);
}

.status-description {
  @apply text-sm;
  color: var(--text-secondary);
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden;
}

.progress-fill {
  @apply bg-blue-600 h-2 rounded-full transition-all duration-300;
}

.quick-results {
  @apply p-4 rounded-lg border;
  border-color: var(--bg-border);
  background: var(--bg-surface);
}

.results-title {
  @apply text-sm font-semibold mb-3;
  color: var(--text-primary);
}

.results-grid {
  @apply grid grid-cols-2 gap-4 mb-4;
}

.result-item {
  @apply flex flex-col items-center text-center p-3 rounded-lg;
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
}

.result-label {
  @apply text-xs font-medium mb-2;
  color: var(--text-secondary);
}

.result-value {
  @apply text-lg font-bold;
}

.score-excellent { color: #10b981; }
.score-good { color: #3b82f6; }
.score-average { color: #f59e0b; }
.score-poor { color: #ef4444; }

.upgrade-button {
  @apply w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200;
  background: var(--accent-primary);
  color: white;
}

.upgrade-button:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 640px) {
  .unified-security-scan {
    @apply p-4;
  }
  
  .scan-header {
    @apply flex-col items-start gap-3;
  }
  
  .results-grid {
    @apply grid-cols-1;
  }
}
</style>

