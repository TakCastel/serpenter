<template>
  <div
    class="checklist-skeleton w-full"
    style="min-height: calc(100vh + 200px)"
  >
    <!-- Skeleton pour les catégories -->
    <div class="space-y-6">
      <SkeletonCategory v-for="i in 5" :key="`skeleton-category-${i}`" />
    </div>
  </div>
</template>

<script setup>
import SkeletonCategory from "./SkeletonCategory.vue";

// Composant skeleton pour la checklist (sans les cartes de stats)
</script>
