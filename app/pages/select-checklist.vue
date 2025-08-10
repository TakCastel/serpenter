<template>
  <div class="px-4 lg:px-6 py-10 max-w-6xl mx-auto">
    <!-- Navigation de la page -->
    <PageNavigation page-title="Choisir votre checklist" :show-back-button="false" />
    
    <!-- Header simple -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gray-100">
        <Icon name="heroicons:clipboard-document-check" class="w-10 h-10 text-gray-600" />
      </div>
      <h1 class="text-4xl font-bold mb-4 text-gray-900">Choisir votre checklist</h1>
      <p class="text-lg max-w-2xl mx-auto text-gray-600">
        Sélectionnez la checklist qui correspond le mieux à votre projet. Vous pourrez la modifier à tout moment.
      </p>
    </div>

    <!-- Grille des options simplifiées -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Web Pré-déploiement -->
      <div 
        class="border border-gray-200 rounded-lg p-6 cursor-pointer bg-white hover:bg-gray-50"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('web-prelaunch')"
      >
        <!-- Header de la carte -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-blue-500 text-white">
                Recommandé
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2 text-gray-900">Web — Pré‑déploiement</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Checklist complète pour vérifier tous les aspects essentiels avant la mise en ligne de votre site web.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>44 vérifications</span>
            <span>SEO • Performance • Sécurité</span>
          </div>
        </div>
      </div>

      <!-- iOS App Store -->
      <div 
        class="border border-gray-200 rounded-lg p-6 cursor-pointer bg-white hover:bg-gray-50"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('appstore-preflight')"
      >
        <!-- Header de la carte -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center">
              <Icon name="heroicons:device-phone-mobile" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                iOS
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2 text-gray-900">iOS — Pré‑soumission App Store</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Contrôles spécifiques pour préparer votre application iOS à la soumission sur l'App Store.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>38 vérifications</span>
            <span>App Store • iOS • UX</span>
          </div>
        </div>
      </div>

      <!-- WordPress Audit -->
      <div 
        class="border border-gray-200 rounded-lg p-6 cursor-pointer bg-white hover:bg-gray-50"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        @click="!submitting && setType('wordpress-audit')"
      >
        <!-- Header de la carte -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center">
              <Icon name="heroicons:document-text" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                WordPress
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2 text-gray-900">WordPress — Audit de configuration</h3>
          <p class="text-sm leading-relaxed text-gray-600">
            Vérifications essentielles pour une instance WordPress optimisée, sécurisée et performante.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>42 vérifications</span>
            <span>WordPress • CMS • Sécurité</span>
          </div>
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
import PageNavigation from '~/components/common/PageNavigation.vue'

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


