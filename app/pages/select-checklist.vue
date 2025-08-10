<template>
  <div class="px-4 lg:px-6 py-10 max-w-6xl mx-auto">
    <!-- Header stylé -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
        <Icon name="heroicons:clipboard-document-check" class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-4xl font-bold mb-4" style="color: var(--text-primary);">Choisir votre checklist</h1>
      <p class="text-lg max-w-2xl mx-auto" style="color: var(--text-secondary);">
        Sélectionnez la checklist qui correspond le mieux à votre projet. Vous pourrez la modifier à tout moment.
      </p>
    </div>

    <!-- Grille des options stylées -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Web Pré-déploiement -->
      <div 
        class="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        :style="{
          borderColor: 'var(--bg-border)',
          backgroundColor: 'var(--bg-surface)'
        }"
        @click="!submitting && setType('web-prelaunch')"
      >
        <!-- Fond dégradé au hover -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Header de la carte -->
        <div class="relative p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full" style="background-color: var(--accent-primary); color: white;">
                Recommandé
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2" style="color: var(--text-primary);">Web — Pré‑déploiement</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
            Checklist complète pour vérifier tous les aspects essentiels avant la mise en ligne de votre site web.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="relative px-6 pb-6">
          <div class="flex items-center justify-between text-sm" style="color: var(--text-muted);">
            <span>44 vérifications</span>
            <span>SEO • Performance • Sécurité</span>
          </div>
        </div>
        
        <!-- Indicateur de sélection -->
        <div class="absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 group-hover:border-accent-primary" style="border-color: var(--bg-border);"></div>
      </div>

      <!-- iOS App Store -->
      <div 
        class="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        :style="{
          borderColor: 'var(--bg-border)',
          backgroundColor: 'var(--bg-surface)'
        }"
        @click="!submitting && setType('appstore-preflight')"
      >
        <!-- Fond dégradé au hover -->
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Header de la carte -->
        <div class="relative p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #10b981, #3b82f6);">
              <Icon name="heroicons:device-phone-mobile" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full" style="background-color: var(--bg-border); color: var(--text-secondary);">
                iOS
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2" style="color: var(--text-primary);">iOS — Pré‑soumission App Store</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
            Contrôles spécifiques pour préparer votre application iOS à la soumission sur l'App Store.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="relative px-6 pb-6">
          <div class="flex items-center justify-between text-sm" style="color: var(--text-muted);">
            <span>38 vérifications</span>
            <span>App Store • iOS • UX</span>
          </div>
        </div>
        
        <!-- Indicateur de sélection -->
        <div class="absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 group-hover:border-accent-primary" style="border-color: var(--bg-border);"></div>
      </div>

      <!-- WordPress Audit -->
      <div 
        class="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
        :class="submitting ? 'opacity-50 cursor-not-allowed' : ''"
        :style="{
          borderColor: 'var(--bg-border)',
          backgroundColor: 'var(--bg-surface)'
        }"
        @click="!submitting && setType('wordpress-audit')"
      >
        <!-- Fond dégradé au hover -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Header de la carte -->
        <div class="relative p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #3b82f6, #10b981);">
              <Icon name="heroicons:document-text" class="w-8 h-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-xs font-medium px-2 py-1 rounded-full" style="background-color: var(--bg-border); color: var(--text-secondary);">
                WordPress
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2" style="color: var(--text-primary);">WordPress — Audit de configuration</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
            Vérifications essentielles pour une instance WordPress optimisée, sécurisée et performante.
          </p>
        </div>
        
        <!-- Footer avec statistiques -->
        <div class="relative px-6 pb-6">
          <div class="flex items-center justify-between text-sm" style="color: var(--text-muted);">
            <span>42 vérifications</span>
            <span>WordPress • CMS • Sécurité</span>
          </div>
        </div>
        
        <!-- Indicateur de sélection -->
        <div class="absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 group-hover:border-accent-primary" style="border-color: var(--bg-border);"></div>
      </div>
    </div>

    <!-- Footer informatif -->
    <div class="text-center mt-12 p-6 rounded-2xl" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
      <div class="flex items-center justify-center space-x-2 mb-3">
        <Icon name="heroicons:information-circle" class="w-5 h-5" style="color: var(--accent-primary);" />
        <span class="text-sm font-medium" style="color: var(--text-primary);">Besoin d'aide ?</span>
      </div>
      <p class="text-sm" style="color: var(--text-secondary);">
        Vous pouvez changer le type de checklist à tout moment depuis les paramètres de votre projet.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'

definePageMeta({
  layout: 'dashboard'
})

const projectsStore = useProjectsStore()
const { currentUser } = useAuth()
const submitting = ref(false)
const currentProject = computed(() => projectsStore.currentProject)

onMounted(() => {
  if (process.client && currentProject.value?.checklistType) {
    navigateTo('/dashboard')
  }
})

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


