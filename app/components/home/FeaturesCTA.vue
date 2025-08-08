<template>
  <div class="text-center mt-20">
    <div class="card p-12 max-w-4xl mx-auto relative overflow-hidden" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: 1px solid var(--bg-border);">
      <!-- Éléments décoratifs -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
        <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20"></div>
        <div class="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20"></div>
      </div>
      
      <div class="relative z-10">
        <div class="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <Icon name="fluent-emoji:snake" class="w-10 h-10 text-white" />
        </div>
        
        <h3 class="text-3xl md:text-4xl font-bold mb-6 text-white">
          Prêt à vérifier votre site ?
        </h3>
        <p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Rejoignez des milliers de développeurs qui ne déploient plus sans vérifier !
        </p>
        <button 
          @click="navigateToDashboard"
          class="px-12 py-6 text-xl font-bold rounded-3xl transition-all duration-300 bg-white text-gray-900"
        >
          <span class="flex items-center space-x-4">
            <Icon name="heroicons:play" class="w-6 h-6" />
            <span>Commencer maintenant</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>
