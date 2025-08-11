<template>
  <div class="space-y-4">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div class="text-base font-semibold" style="color: var(--text-primary);">Scanner de Sécurité</div>
      <div class="flex items-center gap-2">
        <button 
          @click="runAllScans" 
          :disabled="isAnyLoading || !url || !isValidUrl"
          class="btn btn-primary btn-sm"
          :class="{ 'opacity-50 cursor-not-allowed': !url || !isValidUrl }"
        >
          <span v-if="!isAnyLoading">Scanner complet</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" style="color: white;">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Scan en cours...
          </span>
        </button>
      </div>
    </div>

    <!-- URL Input -->
    <div class="p-4 rounded-xl border" style="border-color: var(--bg-border);">
      <label class="block text-sm mb-2" style="color: var(--text-secondary);">URL à scanner</label>
      <div class="flex gap-2">
        <input 
          v-model="url" 
          type="url" 
          required 
          placeholder="https://example.com" 
          class="input flex-1" 
          :class="{ 'border-red-500': url && !isValidUrl }"
          @input="validateUrl"
        />
        <button 
          @click="runAllScans" 
          :disabled="isAnyLoading || !url || !isValidUrl"
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': !url || !isValidUrl }"
        >
          <Icon name="heroicons:shield-check" class="w-4 h-4" />
        </button>
      </div>
      <div v-if="url && !isValidUrl" class="text-sm text-red-500 mt-1">
        Veuillez entrer une URL valide (ex: https://example.com)
      </div>
    </div>

    <!-- Accordéons des différents scanners -->
    <div class="space-y-3">
      <!-- Headers Security Panel -->
      <HeadersSecurityPanel 
        ref="headersPanel"
        :url="url"
        :is-valid-url="isValidUrl"
        :is-open="headersPanelOpen"
        @update:is-open="headersPanelOpen = $event"
        @items-autochecked="onItemsAutoChecked"
      />



      <!-- Vulnerability Panel -->
      <VulnerabilityPanel 
        ref="vulnerabilityPanel"
        :url="url"
        :is-valid-url="isValidUrl"
        :is-open="vulnerabilityPanelOpen"
        @update:is-open="vulnerabilityPanelOpen = $event"
        @items-autochecked="onItemsAutoChecked"
      />
    </div>

    <!-- Résumé des scores -->
    <div v-if="hasAnyResults" class="p-4 rounded-xl border" style="border-color: var(--bg-border);">
      <h3 class="font-semibold mb-3" style="color: var(--text-primary);">Résumé de Sécurité</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="score in securityScores" :key="score.key" class="text-center">
          <div class="mx-auto mb-2 w-16 h-16 rounded-full grid place-items-center" :style="ringStyle(score.value)">
            <div class="w-12 h-12 rounded-full grid place-items-center" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
              <span class="text-sm font-bold" style="color: var(--text-primary);">{{ score.value }}</span>
            </div>
          </div>
          <div class="text-xs font-semibold" style="color: var(--text-primary);">{{ score.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { collectAllSecurityChecklistItemIds } from '~/utils/security-mapping'
import HeadersSecurityPanel from './HeadersSecurityPanel.vue'

import VulnerabilityPanel from './VulnerabilityPanel.vue'

// Props et emits
const emit = defineEmits(['items-autochecked'])

// Réfs des panels
const headersPanel = ref()

const vulnerabilityPanel = ref()

// État local
const url = ref('')
const isValidUrl = ref(false)
const headersPanelOpen = ref(false)
const vulnerabilityPanelOpen = ref(false)

// Computed
const isAnyLoading = computed(() => {
  return headersPanel.value?.loading || 
 
         vulnerabilityPanel.value?.loading
})

const hasAnyResults = computed(() => {
  return headersPanel.value?.hasResults || 
 
         vulnerabilityPanel.value?.hasResults
})

const securityScores = computed(() => {
  const scores = []
  
  if (headersPanel.value?.score !== undefined) {
    scores.push({ key: 'headers', label: 'Headers', value: headersPanel.value.score })
  }
  

  
  if (vulnerabilityPanel.value?.score !== undefined) {
    scores.push({ key: 'vulnerabilities', label: 'Vulnérabilités', value: vulnerabilityPanel.value.score })
  }
  
  return scores
})

// Méthodes
const validateUrl = () => {
  if (!url.value) {
    isValidUrl.value = false
    return
  }
  
  try {
    const urlObj = new URL(url.value)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      isValidUrl.value = false
      return
    }
    if (!urlObj.hostname || !urlObj.hostname.includes('.')) {
      isValidUrl.value = false
      return
    }
    isValidUrl.value = true
  } catch {
    isValidUrl.value = false
  }
}

const runAllScans = async () => {
  if (!url.value || !isValidUrl.value) return
  
  // Lancer tous les scans en parallèle
  const scans = []
  
  if (headersPanel.value?.runScan) {
    scans.push(headersPanel.value.runScan())
  }
  
  if (sslPanel.value?.runScan) {
    scans.push(sslPanel.value.runScan())
  }
  
  if (vulnerabilityPanel.value?.runScan) {
    scans.push(vulnerabilityPanel.value.runScan())
  }
  
  try {
    await Promise.all(scans)
  } catch (error) {
    console.error('Erreur lors des scans de sécurité:', error)
  }
}

const onItemsAutoChecked = (itemIds: string[]) => {
  emit('items-autochecked', itemIds)
}

// Méthode pour réinitialiser l'état
const reset = () => {
  url.value = ''
  isValidUrl.value = false
  
  if (headersPanel.value?.reset) headersPanel.value.reset()
  if (sslPanel.value?.reset) sslPanel.value.reset()
  if (vulnerabilityPanel.value?.reset) vulnerabilityPanel.value.reset()
}

// Utilitaires
const ringStyle = (val: number) => ({
  background: `conic-gradient(var(--accent-primary) ${val * 3.6}deg, var(--bg-border) 0)`
})

// Exposer la méthode reset
defineExpose({
  reset
})
</script>
