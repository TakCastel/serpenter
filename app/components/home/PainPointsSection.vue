<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
    <PainPointCard
      icon="heroicons:face-frown"
      title="Oups, j'ai oublié..."
      description="La meta description, les alt text, le HTTPS..."
    />
    <PainPointCard
      icon="heroicons:exclamation-triangle"
      title="Ça charge trop lentement"
      description="Images non optimisées, pas de cache..."
    />
    <PainPointCard
      icon="heroicons:question-mark-circle"
      title="Comment vérifier ?"
      description="Trop de choses à penser, pas assez de temps..."
    />
  </div>
</template>

<script setup>
import PainPointCard from './PainPointCard.vue'
</script>
