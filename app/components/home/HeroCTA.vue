<template>
  <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
    <button 
      @click="navigateToDashboard"
      class="px-6 py-3 font-semibold rounded-xl transition-all duration-300"
      style="background-color: var(--accent-primary); color: white;"
    >
      <span class="flex items-center space-x-2">
        <Icon name="heroicons:play" class="w-4 h-4" />
        <span>Commencer la vérification</span>
      </span>
    </button>
    
    <button 
      @click="scrollToFeatures"
      class="px-6 py-3 border-2 font-semibold rounded-xl transition-all duration-300"
      style="border-color: var(--bg-border); color: var(--text-primary);"
    >
      Voir toutes les vérifications
    </button>
  </div>
</template>

<script setup>
const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}

const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
