<template>
  <div class="card p-4 rounded-xl">
    <div class="flex gap-2 mb-4">
      <button class="btn" :class="{ 'btn-primary': tab==='meta' }" @click="tab='meta'">Métadonnées</button>
      <button class="btn" :class="{ 'btn-primary': tab==='ios' }" @click="tab='ios'">iOS (Info.plist)</button>
      <button class="btn" :class="{ 'btn-primary': tab==='android' }" @click="tab='android'">Android (Manifest)</button>
    </div>

    <div v-if="tab==='meta'" class="space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input v-model="meta.ios.name" placeholder="Nom (iOS) ≤ 30" class="input" />
        <input v-model="meta.ios.subtitle" placeholder="Sous‑titre ≤ 30" class="input" />
        <input v-model="meta.ios.keywords" placeholder="Mots‑clés (≤100)" class="input" />
        <input v-model="meta.ios.promotionalText" placeholder="Texte promo ≤ 170" class="input" />
      </div>
      <textarea v-model="meta.ios.description" rows="4" placeholder="Description iOS ≤ 4000" class="textarea" />
      <input v-model="meta.ios.releaseNotes" placeholder="Notes de version iOS ≤ 4000" class="input" />

      <hr class="my-3" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input v-model="meta.android.title" placeholder="Titre (Android) ≤ 30" class="input" />
        <input v-model="meta.android.shortDescription" placeholder="Courte description ≤ 80" class="input" />
      </div>
      <textarea v-model="meta.android.fullDescription" rows="4" placeholder="Description Android ≤ 4000" class="textarea" />
      <input v-model="meta.android.releaseNotes" placeholder="Notes de version Android ≤ 500" class="input" />

      <div class="flex gap-2">
        <button class="btn btn-primary" @click="checkMeta">Vérifier</button>
      </div>

      <div v-if="metaResult" class="mt-3 space-y-2">
        <p class="font-medium">Résultats</p>
        <div v-if="metaOk" class="p-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
          Aucun problème détecté selon ces règles.
        </div>
        <div v-else class="space-y-2">
          <div v-if="iosIssues.length">
            <p class="font-medium">iOS ({{ iosIssues.length }})</p>
            <ul class="list-disc ml-5">
              <li v-for="(m,i) in iosIssues" :key="'ios'+i">{{ m }}</li>
            </ul>
          </div>
          <div v-if="androidIssues.length">
            <p class="font-medium">Android ({{ androidIssues.length }})</p>
            <ul class="list-disc ml-5">
              <li v-for="(m,i) in androidIssues" :key="'andr'+i">{{ m }}</li>
            </ul>
          </div>
        </div>
        <p v-if="metaResult?.hints" class="text-xs text-gray-500">iOS: {{ metaResult.hints.ios }} | Android: {{ metaResult.hints.android }}</p>
      </div>
    </div>

    <div v-else-if="tab==='ios'" class="space-y-3">
      <CodeEditor v-model="iosPlist" :rows="12" label="Info.plist (XML)" placeholder="Collez votre Info.plist (XML)" :clean-markdown="true" />
      <div class="flex items-center gap-2">
        <button class="btn btn-primary" :disabled="iosLoading" @click="checkIOS">
          <span v-if="iosLoading">Analyse…</span>
          <span v-else>Analyser</span>
        </button>
        <span v-if="iosError" class="text-red-600 text-sm">{{ iosError }}</span>
      </div>
      <ul v-if="iosResult && iosResult.issues && iosResult.issues.length" class="list-disc ml-5 mt-3">
        <li v-for="(m,i) in iosResult.issues" :key="i">{{ m }}</li>
      </ul>
      <div v-else-if="iosResult && !iosError" class="p-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 mt-3">
        Aucun problème détecté selon ces règles.
      </div>
    </div>

    <div v-else class="space-y-3">
      <CodeEditor v-model="androidManifest" :rows="12" label="AndroidManifest.xml" placeholder="Collez votre AndroidManifest.xml" :clean-markdown="true" />
      <div class="flex items-center gap-2">
        <button class="btn btn-primary" :disabled="androidLoading" @click="checkAndroid">
          <span v-if="androidLoading">Analyse…</span>
          <span v-else>Analyser</span>
        </button>
        <span v-if="androidError" class="text-red-600 text-sm">{{ androidError }}</span>
      </div>
      <ul v-if="androidResult?.issues?.length" class="list-disc ml-5 mt-3">
        <li v-for="(m,i) in androidResult.issues" :key="i">{{ m }}</li>
      </ul>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CodeEditor from '~/components/common/CodeEditor.vue'

const tab = ref<'meta'|'ios'|'android'>('meta')

const meta = ref({
  ios: { name: '', subtitle: '', keywords: '', promotionalText: '', description: '', releaseNotes: '' },
  android: { title: '', shortDescription: '', fullDescription: '', releaseNotes: '' }
})
const metaResult = ref<any>(null)
const iosIssues = ref<string[]>([])
const androidIssues = ref<string[]>([])
const metaOk = ref<boolean>(false)
const iosPlist = ref('')
const iosResult = ref<any>(null)
const iosLoading = ref(false)
const iosError = ref<string | null>(null)
const androidManifest = ref('')
const androidResult = ref<any>(null)
const androidLoading = ref(false)
const androidError = ref<string | null>(null)

const checkMeta = async () => {
  const payload = { 
    platform: 'both', 
    data: { 
      name: meta.value.ios.name,
      subtitle: meta.value.ios.subtitle,
      keywords: meta.value.ios.keywords,
      promotionalText: meta.value.ios.promotionalText,
      description: meta.value.ios.description,
      releaseNotes: meta.value.ios.releaseNotes,
      title: meta.value.android.title,
      shortDescription: meta.value.android.shortDescription,
      fullDescription: meta.value.android.fullDescription,
      androidReleaseNotes: meta.value.android.releaseNotes
    } 
  }
  metaResult.value = await $fetch('/api/mobile/metadata', { method: 'POST', body: payload })
  iosIssues.value = metaResult.value?.issues?.ios || []
  androidIssues.value = metaResult.value?.issues?.android || []
  metaOk.value = iosIssues.value.length === 0 && androidIssues.value.length === 0
}
const checkIOS = async () => {
  iosLoading.value = true
  iosError.value = null
  iosResult.value = null
  try {
    const cleaned = (iosPlist.value || '')
      .replace(/```[a-zA-Z]*\s*/g, '')
      .replace(/```/g, '')
      .trim()
    iosResult.value = await $fetch('/api/mobile/ios-plist', { method: 'POST', body: { plist: cleaned } })
    if (!iosResult.value) {
      iosError.value = 'Aucun résultat reçu.'
    }
  } catch (e: any) {
    const statusMsg = e?.data?.statusMessage || e?.message
    iosError.value = statusMsg || 'Analyse échouée. Vérifiez que vous collez le Info.plist brut (XML).'
  } finally {
    iosLoading.value = false
  }
}
const checkAndroid = async () => {
  androidLoading.value = true
  androidError.value = null
  androidResult.value = null
  try {
    const cleaned = (androidManifest.value || '')
      .replace(/```[a-zA-Z]*\s*/g, '')
      .replace(/```/g, '')
      .trim()
    androidResult.value = await $fetch('/api/mobile/android-manifest', { method: 'POST', body: { manifestXml: cleaned } })
  } catch (e: any) {
    androidError.value = e?.data?.statusMessage || e?.message || 'Analyse échouée. Vérifiez le XML.'
  } finally {
    androidLoading.value = false
  }
}

// Méthode pour réinitialiser l'état
const reset = () => {
  tab.value = 'meta'

  // Réinitialiser les métadonnées
  meta.value = {
    ios: { name: '', subtitle: '', keywords: '', promotionalText: '', description: '', releaseNotes: '' },
    android: { title: '', shortDescription: '', fullDescription: '', releaseNotes: '' }
  }
  metaResult.value = null
  iosIssues.value = []
  androidIssues.value = []
  metaOk.value = false

  // Réinitialiser iOS
  iosPlist.value = ''
  iosResult.value = null
  iosLoading.value = false
  iosError.value = null

  // Réinitialiser Android
  androidManifest.value = ''
  androidResult.value = null
  androidLoading.value = false
  androidError.value = null
}

// Gestionnaire de changement de projet
const handleProjectChanged = () => {
  reset()
}

// Écouter les changements de projet
onMounted(() => {
  if (process.client) {
    window.addEventListener('project-checklist-changed', handleProjectChanged)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('project-checklist-changed', handleProjectChanged)
  }
})

// Exposer la méthode reset
defineExpose({
  reset
})
</script>

<style scoped>
.input { @apply w-full border rounded-md px-3 py-2; }
.textarea { @apply w-full border rounded-md px-3 py-2; }
.btn { @apply px-3 py-2 rounded-md border; }
.btn-primary { @apply bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700; }
.card { @apply bg-white border border-gray-200; }
</style>

