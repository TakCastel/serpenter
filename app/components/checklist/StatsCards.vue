<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-8">
    <!-- Skeleton pour les stats cards pendant le chargement -->
    <template v-if="isLoading">
      <SkeletonCard />
      <SkeletonCard />
    </template>
    
    <!-- Stats cards réelles -->
    <template v-else>
      <div class="card p-6">
        <div class="flex items-center justify-center space-x-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
            <Icon name="heroicons:check-circle" class="w-6 h-6" style="color: white;" />
          </div>
          <div class="text-left">
            <div class="text-2xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
              {{ completedCount }}
            </div>
            <div class="text-xs transition-colors duration-200" style="color: var(--text-muted);">
              {{ $t('app.progress.completedCount', { count: totalCount }) }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center justify-center space-x-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200" style="background-color: var(--accent-primary);">
            <Icon name="heroicons:chart-bar" class="w-6 h-6" style="color: white;" />
          </div>
          <div class="text-left">
            <div class="text-2xl font-bold transition-colors duration-200" style="color: var(--text-primary);">
              {{ Math.round(progressPercentage) }}%
            </div>
            <div class="text-xs transition-colors duration-200" style="color: var(--text-muted);">
              {{ $t('app.progress.percentage') }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import SkeletonCard from '../common/SkeletonCard.vue'

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  completedCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  progressPercentage: {
    type: Number,
    required: true
  }
})
</script>
