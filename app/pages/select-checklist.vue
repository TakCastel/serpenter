<template>
  <div class="px-4 lg:px-6 py-10 max-w-6xl mx-auto">
    

    <!-- Grille des options simplifiées -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Web Pré-déploiement -->
      <div 
        class="group relative overflow-hidden border border-gray-200 rounded-2xl p-6 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('web-prelaunch')"
      >
        <!-- Header de la carte -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                Web
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-1.5 text-gray-900">Web — Pré‑déploiement</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Checklist complète pour vérifier tous les aspects essentiels avant la mise en ligne de votre site web.
          </p>
        </div>
      </div>

      <!-- Applications Mobiles -->
      <div 
        class="group relative overflow-hidden border border-gray-200 rounded-2xl p-6 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('appstore-preflight')"
      >
        <!-- Header de la carte -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-500 to-gray-700 flex items-center justify-center shadow-sm">
              <Icon name="heroicons:device-phone-mobile" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                Mobile
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-1.5 text-gray-900">Applications Mobiles — App Store & Play Store</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Contrôles complets pour préparer vos applications iOS et Android à la soumission sur les stores.
          </p>
        </div>
      </div>

      <!-- Security Checker -->
      <div 
        class="group relative overflow-hidden border border-gray-200 rounded-2xl p-6 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('security-checker')"
      >
        <!-- Header de la carte -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-sm">
              <Icon name="heroicons:shield-check" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                Sécurité
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-1.5 text-gray-900">Sécurité & Données — Audit de protection</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Vérifications essentielles pour sécuriser votre infrastructure, protéger vos données et assurer la conformité.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer informatif -->
    <div class="text-center mt-12 p-6 rounded-lg bg-gray-50 border border-gray-200">
      <div class="flex items-center justify-center space-x-2 mb-3">
        <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500" />
        <span class="text-sm font-medium text-gray-900">Besoin d'aide ?</span>
      </div>
      <p class="text-sm text-gray-600">
        Vous pouvez changer le type de checklist à tout moment depuis les paramètres de votre projet.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useProjectsStore } from '~/stores/projects'

definePageMeta({
  layout: 'dashboard'
})

const projectsStore = useProjectsStore()
const { currentUser } = useAuth()
const submitting = ref(false)
const currentProject = computed(() => projectsStore.currentProject)

// Rediriger si le projet a déjà un checklistType
onMounted(() => {
  if (process.client && currentProject.value?.checklistType) {
    navigateTo('/dashboard')
  }
})

// Écouter les changements de projet pour rediriger si nécessaire
watch(currentProject, (project) => {
  if (process.client && project?.checklistType) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

const setType = async (type) => {
  if (!currentUser.value || !currentProject.value?.id) return
  try {
    submitting.value = true
    await projectsStore.updateProjectRemote(currentUser.value.uid, currentProject.value.id, { checklistType: type })
    // Mettre à jour localement pour éviter d'attendre le snapshot
    const p = projectsStore.projects.find(p => p.id === currentProject.value.id)
    if (p) p.checklistType = type
    navigateTo('/dashboard')
  } finally {
    submitting.value = false
  }
}
</script>


