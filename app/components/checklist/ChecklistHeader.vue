<template>
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold mb-4 transition-colors duration-200 tracking-tight" style="color: var(--text-primary);">
      {{ $t('app.hero.title') }}
    </h1>
    <p class="text-lg transition-colors duration-200 mb-8 max-w-2xl mx-auto" style="color: var(--text-secondary);">
      {{ $t('app.hero.description') }}
    </p>
  </div>
</template>

<script setup>
// Pas de props nécessaires pour ce composant
</script>
