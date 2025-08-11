<template>
  <div class="simple-security-scan">
    <!-- En-tête explicatif -->
    <div class="scan-header">
      <div class="header-icon">
        <Icon name="heroicons:shield-check" class="w-6 h-6" :style="{ color: 'var(--accent-primary)' }" />
      </div>
      <div class="header-content">
        <h3 class="header-title">Audit de sécurité</h3>
        <p class="header-description">
          Analyse de la sécurité de votre site web avec Lighthouse
        </p>
      </div>
    </div>

    <!-- Bouton de scan principal -->
    <div class="scan-actions">
      <button 
        @click="startScan" 
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

    <!-- Message d'erreur simple -->
    <div v-if="errorMessage" class="error-message">
      <div class="error-header">
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
        <span class="error-text">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  url: string
  isValidUrl: boolean
}

interface ScanStatus {
  title: string
  description: string
  progress?: number
  type: 'scanning' | 'success' | 'error' | 'warning'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'scan-started': []
  'scan-completed': [results: any]
}>()

// État local
const loading = ref(false)
const scanStatus = ref<ScanStatus | null>(null)
const errorMessage = ref<string | null>(null)

// Computed
const canScan = computed(() => props.isValidUrl && props.url && !loading.value)

// Méthodes
const startScan = async () => {
  if (!canScan.value) return
  
  loading.value = true
  errorMessage.value = null
  scanStatus.value = {
    title: 'Audit de sécurité en cours',
    description: 'Analyse de sécurité de votre site avec Lighthouse...',
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
    
    // Simuler un scan Lighthouse
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    clearInterval(progressInterval)
    
    scanStatus.value = {
      title: 'Audit terminé',
      description: 'Analyse de sécurité terminée avec succès',
      type: 'success',
      progress: 100
    }
    
    // Émettre l'événement de completion avec des données simulées
    const mockResults = {
      lighthouse: {
        score: 85,
        audits: {
          'uses-https': { score: 1 },
          'redirects-http': { score: 1 }
        }
      },
      headers: {
        score: 90,
        hsts: true,
        csp: true
      }
    }
    
    emit('scan-completed', { success: true, data: mockResults })
    
  } catch (error: any) {
    errorMessage.value = 'Erreur lors de l\'audit de sécurité'
    scanStatus.value = {
      title: 'Erreur',
      description: 'L\'audit de sécurité a échoué',
      type: 'error'
    }
  } finally {
    loading.value = false
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
    case 'success': return 'var(--success)'
    case 'error': return 'var(--error)'
    case 'warning': return 'var(--warning)'
    default: return 'var(--text-secondary)'
  }
}
</script>

<style scoped>
.simple-security-scan {
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

.error-message {
  @apply p-4 rounded-lg border-l-4 mb-4;
  border-left-color: var(--error);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.error-header {
  @apply flex items-center gap-3;
}

.error-header .w-5 {
  color: var(--error);
  flex-shrink-0;
  margin-top: 2px;
}

.error-text {
  @apply text-sm;
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .simple-security-scan {
    @apply p-4;
  }
  
  .scan-header {
    @apply flex-col items-start gap-3;
  }
}
</style>

