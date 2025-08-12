<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Navigation de la page -->
      <PageNavigation page-title="Paramètres" />
      
      <!-- Contenu de la page -->
      <div class="space-y-6">
        <!-- Section Général -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold mb-4">Général</h2>
          <p class="text-gray-600">Paramètres généraux - contenu à venir</p>
        </div>

        <!-- Section Version & Informations -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold mb-4">Version & Informations</h2>
          <VersionInfo :show-details="true" :show-features="true" />

          <!-- Actions de version -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Actions</h3>
            <div class="flex gap-3">
              <button
                @click="checkForUpdates"
                :disabled="checkingUpdates"
                class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon v-if="checkingUpdates" name="heroicons:arrow-path" class="animate-spin mr-2" size="16" />
                {{ checkingUpdates ? 'Vérification...' : 'Vérifier les mises à jour' }}
              </button>

              <button
                @click="showVersionDetails = !showVersionDetails"
                class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
              >
                {{ showVersionDetails ? 'Masquer' : 'Voir' }} les détails
              </button>
            </div>
          </div>

          <!-- Détails techniques -->
          <div v-if="showVersionDetails" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Détails techniques</h4>
            <div class="text-xs text-gray-600 space-y-1 font-mono">
              <div>User Agent: {{ userAgent }}</div>
              <div>Viewport: {{ viewport.width }}x{{ viewport.height }}</div>
              <div>Timezone: {{ timezone }}</div>
              <div>Language: {{ language }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageNavigation from '~/components/common/PageNavigation.vue'
import VersionInfo from '~/components/common/VersionInfo.vue'

const showVersionDetails = ref(false)
const checkingUpdates = ref(false)

// Informations système
const userAgent = process.client ? navigator.userAgent : 'Server'
const viewport = reactive({
  width: process.client ? window.innerWidth : 0,
  height: process.client ? window.innerHeight : 0
})
const timezone = process.client ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
const language = process.client ? navigator.language : 'fr-FR'

// Mettre à jour le viewport en temps réel
if (process.client) {
  const updateViewport = () => {
    viewport.width = window.innerWidth
    viewport.height = window.innerHeight
  }

  window.addEventListener('resize', updateViewport)
  onUnmounted(() => window.removeEventListener('resize', updateViewport))
}

// Vérifier les mises à jour (simulation)
const checkForUpdates = async () => {
  checkingUpdates.value = true

  // Simulation d'une vérification
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Ici vous pourriez faire un appel API pour vérifier les mises à jour
  alert('Vous utilisez la dernière version disponible !')

  checkingUpdates.value = false
}

definePageMeta({
  layout: 'dashboard'
})
</script>
