<template>
  <div v-if="showBanner" class="ssl-labs-error-banner">
    <div class="banner-header">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
      <div class="header-content">
        <h4 class="error-title">{{ error.title || 'SSL Labs indisponible' }}</h4>
        <p class="error-description">{{ error.message }}</p>
      </div>
    </div>
    
    <div class="error-details">
      <div class="detail-item">
        <Icon name="heroicons:information-circle" class="w-4 h-4" />
        <span><strong>Raison :</strong> {{ getErrorDetails() }}</span>
      </div>
      
      <div v-if="error.retryAfter" class="detail-item">
        <Icon name="heroicons:clock" class="w-4 h-4" />
        <span><strong>Réessayer dans :</strong> {{ formatRetryTime() }}</span>
      </div>
      
      <div v-if="error.technicalDetails" class="detail-item">
        <Icon name="heroicons:code-bracket" class="w-4 h-4" />
        <span><strong>Détails techniques :</strong> {{ error.technicalDetails }}</span>
      </div>
    </div>
    
    <div class="banner-actions">
      <button 
        @click="handleRetry" 
        :disabled="isRetryDisabled"
        class="retry-button"
        :class="{ 'disabled': isRetryDisabled }"
      >
        <Icon name="heroicons:arrow-path" class="w-4 h-4" />
        <span v-if="!isRetryDisabled">Réessayer</span>
        <span v-else>Attendre {{ retryCountdown }}s</span>
      </button>
      
      <button @click="dismissBanner" class="dismiss-button">
        <Icon name="heroicons:x-mark" class="w-4 h-4" />
        <span>Fermer</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

interface SSLLabsError {
  type: 'rate-limit' | 'maintenance' | 'scan-in-progress' | 'timeout' | 'network-error' | 'ssl-labs-unavailable'
  message: string
  technicalDetails?: string
  retryAfter?: number
  timestamp: string
  title?: string
}

interface Props {
  error: SSLLabsError
  onRetry?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  retry: []
}>()

// État local
const retryCountdown = ref(0)
const isVisible = ref(true)
let countdownInterval: NodeJS.Timeout | null = null

// Computed
const showBanner = computed(() => isVisible.value && props.error)
const isRetryDisabled = computed(() => retryCountdown.value > 0)

// Méthodes
const handleRetry = () => {
  if (isRetryDisabled.value) return
  
  emit('retry')
  startCountdown()
}

const dismissBanner = () => {
  isVisible.value = false
}

const startCountdown = () => {
  if (props.error.retryAfter) {
    retryCountdown.value = props.error.retryAfter
    
    countdownInterval = setInterval(() => {
      if (retryCountdown.value > 0) {
        retryCountdown.value--
      } else {
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }
    }, 1000)
  }
}

const getErrorDetails = (): string => {
  switch (props.error.type) {
    case 'rate-limit':
      return 'Limite de taux dépassée - SSL Labs limite le nombre de requêtes'
    case 'maintenance':
      return 'Service en maintenance - SSL Labs effectue des travaux'
    case 'scan-in-progress':
      return 'Scan déjà en cours - Un audit est en cours pour ce domaine'
    case 'timeout':
      return 'Délai d\'attente dépassé - SSL Labs prend trop de temps à répondre'
    case 'network-error':
      return 'Erreur réseau - Problème de connexion avec SSL Labs'
    case 'ssl-labs-unavailable':
      return 'Service indisponible - SSL Labs est temporairement inaccessible'
    default:
      return 'Erreur inconnue'
  }
}

const formatRetryTime = (): string => {
  if (!props.error.retryAfter) return 'N/A'
  
  const minutes = Math.floor(props.error.retryAfter / 60)
  const seconds = props.error.retryAfter % 60
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

// Watchers
watch(() => props.error, (newError) => {
  if (newError) {
    isVisible.value = true
    startCountdown()
  }
}, { immediate: true })

// Cleanup
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.ssl-labs-error-banner {
  @apply p-4 rounded-lg border-l-4 mb-4;
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.banner-header {
  @apply flex items-start gap-3 mb-3;
}

.banner-header .w-5 {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.header-content {
  @apply flex-1;
}

.error-title {
  @apply text-sm font-semibold mb-1;
  color: var(--text-primary);
}

.error-description {
  @apply text-sm;
  color: var(--text-secondary);
}

.error-details {
  @apply space-y-2 mb-4;
}

.detail-item {
  @apply flex items-start gap-2 text-xs;
  color: var(--text-secondary);
}

.detail-item .w-4 {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 1px;
}

.detail-item strong {
  color: var(--text-primary);
}

.banner-actions {
  @apply flex gap-2;
}

.retry-button {
  @apply flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200;
  background: #f59e0b;
  color: white;
}

.retry-button:hover:not(.disabled) {
  background: #d97706;
}

.retry-button.disabled {
  @apply opacity-50 cursor-not-allowed;
  background: #9ca3af;
}

.dismiss-button {
  @apply flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--bg-border);
}

.dismiss-button:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 640px) {
  .banner-actions {
    @apply flex-col;
  }
  
  .retry-button,
  .dismiss-button {
    @apply w-full justify-center;
  }
}
</style>

