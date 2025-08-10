<template>
  <div class="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8">
    <div 
      v-if="progressPercentage !== null && currentProjectId && $route.path === '/dashboard'"
      class="flex items-center space-x-3"
    >
      <!-- Progress Circle -->
      <div class="relative w-12 h-12">
        <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#059669"
            stroke-width="2"
            stroke-linecap="round"
            :stroke-dasharray="`${progressPercentage * 1.131}, 100`"
            class="transition-all duration-500 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-xs font-semibold text-gray-700 transition-colors duration-200">
            {{ Math.round(progressPercentage) }}%
          </span>
        </div>
      </div>
      
      <!-- Texte de progression -->
      <div class="text-sm text-gray-600">
        <div class="font-medium">Progression du projet</div>
        <div class="text-xs text-gray-500">terminé</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progressPercentage: {
    type: Number,
    default: null
  },
  currentProjectId: {
    type: String,
    default: null
  }
})
</script>
