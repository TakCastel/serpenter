<template>
  <details class="rounded-xl border" style="border-color: var(--bg-border);" :open="isOpen">
    <summary 
      class="cursor-pointer px-4 py-3 text-sm flex items-center justify-between hover:bg-opacity-50" 
      style="background-color: var(--bg-surface);"
      @click.prevent="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <Icon name="heroicons:lock-closed" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }" />
        <span class="font-semibold" style="color: var(--text-primary);">SSL / TLS</span>
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
      <div class="space-y-4">
        <p class="text-sm" style="color: var(--text-secondary);">Analyse Observatory de Mozilla (score global) et Security Headers (présence des en-têtes).</p>
        <div class="flex items-center gap-3">
          <button 
            @click="runScan" 
            :disabled="loading || !isValidUrl || !url"
            class="btn btn-primary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': !isValidUrl || !url }"
          >
            <span v-if="!loading">Lancer les 2 scans</span>
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

        <div v-if="results" class="space-y-3">
          <div class="p-3 rounded-lg" style="background-color: var(--bg-surface);">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold" style="color: var(--text-primary);">Score global</span>
              <div class="w-12 h-12 rounded-full grid place-items-center" :style="ringStyle(score)">
                <span class="text-sm font-bold text-white">{{ score }}</span>
              </div>
            </div>
            <div class="text-xs" style="color: var(--text-secondary);">
              Mozilla Observatory: <strong>{{ results.observatory?.grade || '—' }}</strong>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-3 rounded-lg border" style="border-color: var(--bg-border);">
              <div class="text-xs" style="color: var(--text-secondary);">En-têtes de sécurité</div>
              <ul class="text-xs mt-1" style="color: var(--text-primary);">
                <li v-for="(val, key) in results.headers?.headers" :key="key">
                  {{ key }}: <strong>{{ val ? 'présent' : 'manquant' }}</strong>
                </li>
              </ul>
            </div>
            <div class="p-3 rounded-lg border" style="border-color: var(--bg-border);">
              <div class="text-xs" style="color: var(--text-secondary);">Recommandations</div>
              <ul class="text-xs mt-1" style="color: var(--text-primary);">
                <li v-for="rec in results.headers?.recommendations || []" :key="rec">{{ rec }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { collectChecklistItemIdsFromHeaders } from '~/utils/security-mapping'

interface Props {
  url: string
  isValidUrl: boolean
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:isOpen','items-autochecked'])

const loading = ref(false)
const error = ref('')
const results = ref<any>(null)
const url = ref(props.url)
const isValidUrl = ref(props.isValidUrl)

const score = computed(() => results.value?.score)
const hasResults = computed(() => !!results.value)
const isOpen = computed({ get: () => props.isOpen, set: v => emit('update:isOpen', v) })

const runScan = async () => {
  if (!isValidUrl.value || !url.value) return
  loading.value = true
  error.value = ''
  try {
    // Lancer Observatory et Security Headers en parallèle
    const [obs, headers] = await Promise.all([
      $fetch('/api/security-observatory', { method: 'POST', body: { url: url.value } }) as any,
      $fetch('/api/security-headers', { method: 'POST', body: { url: url.value } }) as any
    ])

    if ((obs?.success || headers?.success)) {
      const observatoryData = obs?.success ? obs.data : null
      const headersData = headers?.success ? headers.data : null
      const computedScore = Math.round((
        (observatoryData?.score ?? 0) + (headersData?.score ?? 0)
      ) / 2)

      results.value = {
        score: computedScore,
        observatory: observatoryData,
        headers: headersData
      }

      // Auto-check depuis les headers
      if (headersData?.headers) {
        try {
          const ids = collectChecklistItemIdsFromHeaders(headersData.headers)
          if (ids.length) emit('items-autochecked', ids)
        } catch {}
      }
    } else {
      throw new Error('Échec des scans')
    }
  } catch (e:any) {
    error.value = e?.data?.statusMessage || e?.message || 'Erreur SSL'
    results.value = null
  } finally {
    loading.value = false
  }
}

const ringStyle = (val?: number) => {
  const v = typeof val === 'number' ? val : 0
  return { background: `conic-gradient(var(--accent-primary) ${v * 3.6}deg, var(--bg-border) 0)` }
}

const reset = () => {
  loading.value = false
  error.value = ''
  results.value = null
}

defineExpose({ runScan, reset, loading, score, hasResults })
</script>

