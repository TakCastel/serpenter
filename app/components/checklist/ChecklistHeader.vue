<template>
  <div class="mb-6">
    <div class="text-center mb-4">
      <h1 class="text-3xl font-bold mb-2 transition-colors duration-200 tracking-tight" style="color: var(--text-primary);">
        Checklist Pré-Déploiement
      </h1>
      <p class="text-sm transition-colors duration-200 max-w-2xl mx-auto" style="color: var(--text-secondary);">
        Vérifiez tous les aspects essentiels avant de mettre votre site en ligne
      </p>
    </div>
    <div class="flex items-center justify-center gap-6 text-sm">
      <div class="text-center">
        <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ completedCount }}</div>
        <div class="text-xs" style="color: var(--text-secondary);">sur {{ totalCount }} complétés</div>
      </div>
      <div class="w-px h-8" style="background-color: var(--bg-border);"></div>
      <div class="text-center">
        <div class="text-2xl font-bold" style="color: var(--text-primary);">{{ Math.round(progressPercentage) }}%</div>
        <div class="text-xs" style="color: var(--text-secondary);">terminé</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ completedCount: number; totalCount: number; progressPercentage: number }>()
</script>
