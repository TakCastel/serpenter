<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader 
      :current-project-id="currentProjectId" 
      :is-sidebar-collapsed="isSidebarCollapsed"
      @reset-progress="handleResetProgress" 
      @toggle-sidebar="toggleSidebar"
    />
    
    <!-- Layout principal avec sidebar (offset ajusté pour le header plus petit) -->
    <div class="pt-[77px] flex items-stretch overflow-hidden">
      <!-- Sidebar avec sommaire -->
      <Sidebar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @project-changed="handleProjectChanged"
      />
      
      <!-- Contenu principal -->
      <main :class="['w-full min-w-0 min-h-0 overflow-auto bg-[var(--bg-primary)] transition-all duration-500 ease-in-out', isSidebarCollapsed ? 'ml-14' : 'ml-72']" :style="{ height: 'calc(100vh - 77px)' }" role="main" aria-label="Contenu principal des vérifications">
        <slot />
      </main>
    </div>

    <!-- Back to top -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'

import AppHeader from '~/components/dashboard/AppHeader.vue'
import Sidebar from '~/components/dashboard/Sidebar.vue'
import BackToTop from '~/components/common/BackToTop.vue'

const projectsStore = useProjectsStore()
const { currentUser, ready } = useAuth()
const currentProjectId = computed(() => projectsStore.currentProjectId)

// S'abonner automatiquement aux projets quand l'utilisateur est authentifié
watch([currentUser, ready], ([user, isReady]) => {
  if (process.client && isReady && user && !projectsStore.isSynced) {
    projectsStore.subscribeUserProjects(user.uid)
  }
}, { immediate: true })

const handleResetProgress = () => {
  if (process.client) {
    // Émettre un événement personnalisé pour réinitialiser le progrès
    window.dispatchEvent(new CustomEvent('reset-checklist-progress'))
  }
}

const handleProjectChanged = (projectId) => {
  // Cette fonction est maintenant gérée par le composant Sidebar
  // On peut la laisser vide ou la supprimer si elle n'est pas utilisée ailleurs
}

const isSidebarCollapsed = ref(false)
const toggleSidebar = () => { isSidebarCollapsed.value = !isSidebarCollapsed.value }
</script>
