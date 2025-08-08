<template>
  <div
    class="card p-12 max-w-4xl mx-auto mb-12 relative overflow-hidden"
    style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: 1px solid var(--bg-border);"
  >
    <!-- Contenu -->
    <div class="relative z-10 text-center">
      <!-- Titre principal avec Fluent Emoji -->
      <div class="mb-4 flex items-center justify-center gap-3">
        <Icon name="fluent-emoji:check-mark-button" class="w-8 h-8" aria-hidden="true" />
        <h1 class="text-4xl md:text-5xl font-bold text-white">
          Félicitations !
        </h1>
      </div>

      <!-- Sous-titre -->
      <h2 class="text-2xl md:text-3xl font-semibold mb-6 text-white/90">
        Votre site est prêt pour le déploiement
      </h2>

      <!-- Description courte -->
      <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
        Toutes les catégories sont complétées. Vous pouvez lancer le déploiement en toute confiance.
      </p>
    </div>
  </div>
</template>

<script setup>
// Props conservées si déjà passées depuis le parent (non utilisées ici)
const props = defineProps({
  totalItems: { type: Number, required: false, default: 0 },
  totalCategories: { type: Number, required: false, default: 0 }
})
</script>

<style scoped>
</style>
