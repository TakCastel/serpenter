<template>
  <div class="text-center mt-16">
    <div class="card p-8 max-w-4xl mx-auto">
      <h3 class="text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300" style="color: var(--text-primary);">
        Prêt à vérifier votre site ?
      </h3>
      <p class="text-lg mb-6 transition-colors duration-300" style="color: var(--text-secondary);">
        Rejoignez des milliers de développeurs qui ne déploient plus sans vérifier !
      </p>
      <button 
        @click="navigateToDashboard"
        class="px-8 py-4 font-semibold rounded-xl transition-all duration-300"
        style="background-color: var(--accent-primary); color: white;"
      >
        <span class="flex items-center space-x-2">
          <Icon name="fluent-emoji:play-button" class="w-5 h-5" />
          <span>Commencer maintenant</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>
