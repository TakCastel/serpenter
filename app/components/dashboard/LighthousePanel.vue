<template>
  <div>
    <!-- En-tête déplacé dans l'accordéon pour éviter le doublon -->

    <!-- Form -->
    <form @submit.prevent="runAudit" class="space-y-4" autocomplete="off">
      <div>
        <label class="block text-sm mb-1" style="color: var(--text-secondary);">URL</label>
        <div class="flex gap-2">
          <div class="flex-1">
            <input 
              v-model="url" 
              type="url" 
              required 
              placeholder="https://preprod.example.com" 
              class="input w-full" 
              :class="{ 'border-red-500': url && !isValidUrl }"
              autocomplete="off" 
              spellcheck="false" 
              autocapitalize="none"
              @input="validateUrl"
            />
            <div v-if="url && !isValidUrl" class="text-sm text-red-500 mt-1">
              Veuillez entrer une URL valide (ex: https://example.com)
            </div>
          </div>
          <select v-model="formFactor" class="input w-36">
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>
      </div>

      <!-- Advanced -->
      <details class="rounded-xl border" style="border-color: var(--bg-border);" :open="advanced">
        <summary class="cursor-pointer px-4 py-3 text-sm flex items-center justify-between" @click.prevent="advanced = !advanced" :style="{ color: 'var(--text-secondary)' }">
          <span class="flex items-center gap-2"><Icon name="heroicons:adjustments-vertical" class="w-4 h-4" /> Options avancées</span>
          <Icon :name="advanced ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-4 h-4" />
        </summary>
        <div class="px-4 pb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">HTTP Basic – user</label>
              <input v-model="basicUser" type="text" placeholder="user" class="input w-full" autocomplete="off" spellcheck="false" autocapitalize="none" />
            </div>
            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">HTTP Basic – password</label>
              <div class="relative">
                <input v-model="basicPass" :type="showPass ? 'text' : 'password'" placeholder="mot de passe" class="input w-full pr-12" autocomplete="new-password" />
                <button type="button" @click="showPass = !showPass" class="absolute inset-y-0 right-2 my-auto w-9 h-9 rounded-lg flex items-center justify-center" :title="showPass ? 'Cacher' : 'Afficher'" :aria-label="showPass ? 'Cacher' : 'Afficher'" style="background-color: transparent;">
                  <Icon :name="showPass ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" :style="{ color: 'var(--text-primary)' }" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </details>

      <div class="flex items-center gap-3">
        <button 
          :disabled="loading || !url || !isValidUrl" 
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': !url || !isValidUrl }"
        >
          <span v-if="!loading && url && isValidUrl">Lancer l'audit</span>
          <span v-else-if="!loading && !url" class="flex items-center gap-2">
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
            Entrez l'URL du site web
          </span>
          <span v-else-if="!loading && !isValidUrl" class="flex items-center gap-2">
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
            URL invalide
          </span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" style="color: white;"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            Audit en cours…
          </span>
        </button>
        <span v-if="error" class="text-sm" style="color:#fca5a5;">{{ error }}</span>
      </div>
      
    </form>

    <!-- Results -->
    <div v-if="report" class="mt-8 space-y-6">
      <!-- Scores ring -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="cat in cats" :key="cat.key" class="p-4 rounded-xl border text-center" style="border-color: var(--bg-border);">
          <div class="mx-auto mb-3 w-20 h-20 rounded-full grid place-items-center" :style="ringStyle(score(report.categories[cat.key]?.score))">
            <div class="w-16 h-16 rounded-full grid place-items-center" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
              <span class="text-lg font-bold" style="color: var(--text-primary);">{{ score(report.categories[cat.key]?.score) }}</span>
            </div>
          </div>
          <div class="text-sm font-semibold" style="color: var(--text-primary);">{{ cat.label }}</div>
        </div>
      </div>

      <!-- Key metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl border" style="border-color: var(--bg-border);">
          <h3 class="font-semibold mb-3" style="color: var(--text-primary);">Indicateurs clés</h3>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2"><Icon name="heroicons:clock" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" /><span class="flex-1">LCP</span><strong>{{ ms('largest-contentful-paint') }}</strong></li>
            <li class="flex items-center gap-2"><Icon name="heroicons:cursor-arrow-rays" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" /><span class="flex-1">INP</span><strong>{{ ms('experimental-interaction-to-next-paint') }}</strong></li>
            <li class="flex items-center gap-2"><Icon name="heroicons:arrows-right-left" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" /><span class="flex-1">CLS</span><strong>{{ report?.audits?.['cumulative-layout-shift']?.displayValue ?? '—' }}</strong></li>
            <li class="flex items-center gap-2"><Icon name="heroicons:signal" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" /><span class="flex-1">TTFB</span><strong>{{ ms('server-response-time') }}</strong></li>
          </ul>
        </div>
        <div class="p-4 rounded-xl border" style="border-color: var(--bg-border);">
          <h3 class="font-semibold mb-3" style="color: var(--text-primary);">Détails SEO</h3>
          <ul class="space-y-2 text-sm" style="color: var(--text-secondary);">
            <li>Titres & meta: <strong>{{ pass('meta-description') }}</strong></li>
            <li>Liens internes: <strong>{{ pass('is-crawlable') }}</strong></li>
            <li>Best practices: <strong>{{ pass('image-alt') }}</strong></li>
          </ul>
        </div>
      </div>

      <p class="text-xs" style="color: var(--text-muted);">Astuce: lancez l’audit sur mobile et desktop pour comparer.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const url = ref('')
const basicUser = ref('')
const basicPass = ref('')
const showPass = ref(false)
const formFactor = ref<'mobile'|'desktop'>('mobile')
const loading = ref(false)
const error = ref('')
const report = ref<any>(null)
const emit = defineEmits(['items-autochecked'])
const advanced = ref(false)
const isValidUrl = ref(false)

const cats = [
  { key: 'performance', label: 'Performance' },
  { key: 'seo', label: 'SEO' },
  { key: 'best-practices', label: 'Bonnes pratiques' },
  { key: 'accessibility', label: 'Accessibilité' }
]

const score = (s?: number) => s != null ? Math.round(s * 100) : 0
const ringStyle = (val: number) => ({
  background: `conic-gradient(var(--accent-primary) ${val * 3.6}deg, var(--bg-border) 0)`
})
const ms = (key: string) => {
  const v = report.value?.audits?.[key]?.numericValue
  return v != null ? `${Math.round(v)} ms` : '—'
}
const pass = (key: string) => {
  const a = report.value?.audits?.[key]
  if (!a) return '—'
  return a.score === 1 ? 'OK' : 'À améliorer'
}

const runAudit = async () => {
  // Validation supplémentaire avant l'envoi
  if (!url.value || !isValidUrl.value) {
    error.value = 'Veuillez entrer une URL valide'
    return
  }
  
  error.value = ''
  report.value = null
  loading.value = true
  try {
    const body:any = { url: url.value, formFactor: formFactor.value }
    if (basicUser.value && basicPass.value) { body.basicUser = basicUser.value; body.basicPass = basicPass.value }
    const res = await $fetch('/api/lh', { method: 'POST', body })
    report.value = res
    try {
      const { collectChecklistItemIdsFromLhr } = await import('~/utils/lh-mapping')
      const passedIds = collectChecklistItemIdsFromLhr(report.value)
      if (passedIds.length > 0) emit('items-autochecked', passedIds)
    } catch {}
  } catch (e:any) {
    error.value = e?.data?.statusMessage || e?.message || 'Erreur inattendue'
  } finally {
    loading.value = false
  }
}

const validateUrl = () => {
  if (!url.value) {
    isValidUrl.value = false
    return
  }
  
  try {
    // Vérifier que c'est une URL valide
    const urlObj = new URL(url.value)
    
    // Vérifier que c'est bien HTTP ou HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      isValidUrl.value = false
      return
    }
    
    // Vérifier qu'il y a un nom de domaine
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      isValidUrl.value = false
      return
    }
    
    // Vérifier que le nom de domaine contient au moins un point (ex: .com, .fr)
    if (!urlObj.hostname.includes('.')) {
      isValidUrl.value = false
      return
    }
    
    isValidUrl.value = true
  } catch {
    isValidUrl.value = false
  }
}

// Méthode pour réinitialiser l'état du composant
const reset = () => {
  url.value = ''
  basicUser.value = ''
  basicPass.value = ''
  showPass.value = false
  formFactor.value = 'mobile'
  loading.value = false
  error.value = ''
  report.value = null
  advanced.value = false
  isValidUrl.value = false
}

// Exposer la méthode reset
defineExpose({
  reset
})
</script>
