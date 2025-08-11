<template>
  <div v-if="showMobileMenu" class="sm:hidden mt-3 px-1" role="menu" aria-label="Menu mobile">
    <div class="rounded-lg border border-gray-200 bg-white shadow-lg">
      <div class="p-2 space-y-1">
        <!-- Actions -->
        <button @click="toggleTheme" class="w-full px-3 py-2 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-200">
          <span>Thème</span>
          <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5 text-emerald-500" />
        </button>
        
        <div class="px-3 pt-2 text-xs text-gray-500">Langue</div>
        <div class="grid grid-cols-2 gap-2 px-2">
          <button @click="$emit('switch-language', 'fr')" class="px-3 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-200">FR</button>
          <button @click="$emit('switch-language', 'en')" class="px-3 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-200">EN</button>
        </div>
        
        <button v-if="currentProjectId && currentProjectHasChecklistType" @click="$emit('mobile-reset')" class="w-full px-3 py-2 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-200">
          <span>{{ $t('common.reset') }}</span>
          <Icon name="heroicons:arrow-path" class="w-5 h-5 text-gray-500" />
        </button>
        
        <!-- Déconnexion -->
        <div class="border-t border-gray-100 pt-2">
          <button @click="$emit('logout')" class="w-full px-3 py-2 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 text-red-600 transition-colors duration-200">
            <span>Se déconnecter</span>
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const { isDark, toggleTheme, onMounted: themeOnMounted, onUnmounted: themeOnUnmounted } = useTheme()

defineProps({
  showMobileMenu: {
    type: Boolean,
    default: false
  },
  progressPercentage: {
    type: Number,
    default: null
  },
  currentProjectId: {
    type: String,
    default: null
  },
  currentProjectHasChecklistType: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'switch-language',
  'mobile-reset',
  'go-to-profile',
  'logout'
])

onMounted(() => {
  themeOnMounted()
})

onUnmounted(() => {
  themeOnUnmounted()
})
</script>
