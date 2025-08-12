<template>
  <div class="flex items-center space-x-3" role="toolbar" aria-label="Actions de l'application">
    <!-- Bouton Reset supprimé - déplacé dans le dashboard -->
    
    <!-- Menu mobile trigger -->
    <button
      @click="$emit('toggle-mobile-menu')"
      class="sm:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
      :style="{
        backgroundColor: 'var(--button-bg)',
        borderColor: 'var(--button-border)',
        color: 'var(--text-primary)'
      }"
      :aria-expanded="showMobileMenu"
      aria-label="Ouvrir le menu mobile"
    >
      <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" :style="{ color: 'var(--text-primary)' }" />
    </button>

    <!-- Section Profil Utilisateur -->
    <div v-if="userLoggedIn" class="relative">
      <!-- Bouton principal du menu utilisateur -->
      <button
        @click="$emit('toggle-user-menu')"
        class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80"
        :style="{
          backgroundColor: 'var(--button-bg)',
          color: 'var(--text-primary)'
        }"
        :aria-expanded="showUserMenu"
        aria-label="Menu utilisateur"
      >
        <!-- Avatar avec fallback -->
        <div class="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-200 hover:ring-emerald-300 transition-all duration-200">
          <img 
            v-if="currentUser?.photoURL" 
            :src="currentUser.photoURL" 
            :alt="currentUser?.displayName || 'Avatar'"
            class="w-full h-full object-cover"
          />
          <div 
            v-else 
            class="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
          >
            <Icon name="heroicons:user" class="w-4 h-4 text-white" />
          </div>
        </div>
        
        <!-- Informations utilisateur -->
        <div class="hidden md:block text-left">
          <div class="text-sm font-semibold" :style="{ color: 'var(--text-primary)' }">
            {{ currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur' }}
          </div>
          <div class="text-xs" :style="{ color: 'var(--text-secondary)' }">
            {{ currentUser?.email || 'Membre actif' }}
          </div>
        </div>
        
        <!-- Flèche -->
        <Icon 
          name="heroicons:chevron-down" 
          class="w-4 h-4 transition-transform duration-200"
          :style="{ color: 'var(--text-muted)' }"
          :class="{ 'rotate-180': showUserMenu }"
        />
      </button>

      <!-- Menu Profil Utilisateur -->
      <div 
        v-if="showUserMenu"
        class="absolute top-full right-0 mt-3 w-72 rounded-2xl border shadow-2xl z-50 backdrop-blur-sm"
        :style="{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--bg-border)'
        }"
        role="menu"
        aria-label="Menu utilisateur"
      >
        <!-- En-tête du profil avec avatar plus grand -->
        <div class="px-6 py-6 text-center border-b" :style="{ borderColor: 'var(--bg-border)' }">
          <div class="flex flex-col items-center space-y-3">
            <!-- Avatar principal -->
            <div class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-emerald-100 hover:ring-emerald-200 transition-all duration-200">
              <img 
                v-if="currentUser?.photoURL" 
                :src="currentUser.photoURL" 
                :alt="currentUser?.displayName || 'Avatar'"
                class="w-full h-full object-cover"
              />
              <div 
                v-else 
                class="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
              >
                <Icon name="heroicons:user" class="w-8 h-8 text-white" />
              </div>
            </div>
            
            <!-- Informations utilisateur -->
            <div>
              <div class="text-lg font-bold" :style="{ color: 'var(--text-primary)' }">
                {{ currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur' }}
              </div>
              <div class="text-sm" :style="{ color: 'var(--text-secondary)' }">
                {{ currentUser?.email || 'Membre actif' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- LangThemeSwitcher -->
        <div class="p-4 space-y-3">
          <LangThemeSwitcher size="sm" context="dropdown" />
        </div>
        
        <!-- Séparateur -->
        <div class="border-t mx-4" :style="{ borderColor: 'var(--bg-border)' }"></div>
        
        <!-- Déconnexion -->
        <div class="p-4">
          <button
            @click="handleLogout"
            class="w-full px-4 py-3 text-left text-sm transition-all duration-200 hover:bg-opacity-90 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 flex items-center justify-center space-x-3 font-medium"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 text-red-500" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LangThemeSwitcher from '~/components/common/LangThemeSwitcher.vue'

const { signOut } = useAuth()

defineProps({
  isClient: {
    type: Boolean,
    default: false
  },
  showMobileMenu: {
    type: Boolean,
    default: false
  },
  showUserMenu: {
    type: Boolean,
    default: false
  },
  userLoggedIn: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'toggle-mobile-menu',
  'toggle-user-menu',
  'logout'
])

const handleLogout = async () => {
  try {
    await signOut()
    // Émettre l'événement pour fermer le menu utilisateur
    emit('logout')
    // Rediriger vers la page de connexion
    await navigateTo('/login')
  } catch (e) {
    // Erreur déconnexion
    // En cas d'erreur, rediriger quand même vers login
    await navigateTo('/login')
  }
}
</script>
