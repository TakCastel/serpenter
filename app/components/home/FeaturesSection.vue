<template>
  <section id="features" class="py-24 transition-all duration-300" style="background-color: var(--bg-primary);">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300" style="color: var(--text-primary);">
          Plus de 200 vérifications organisées
        </h2>
        <p class="text-xl transition-colors duration-300 max-w-3xl mx-auto" style="color: var(--text-secondary);">
          Une checklist complète pour vérifier votre site <strong>avant</strong> le déploiement. 
          Parce qu'il vaut mieux prévenir que guérir ! 🎯
        </p>
      </div>
      
      <!-- Features grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="feature in featuresData" 
          :key="feature.id"
          class="card p-8 transition-all duration-300"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style="background-color: var(--accent-primary);">
            <Icon :name="feature.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-4 transition-colors duration-300" style="color: var(--text-primary);">
            {{ feature.title }}
          </h3>
          <p class="mb-6 transition-colors duration-300" style="color: var(--text-secondary);">
            {{ feature.description }}
          </p>
          <ul class="space-y-2 text-sm transition-colors duration-300" style="color: var(--text-muted);">
            <li v-for="item in feature.items" :key="item" class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-4 h-4 text-green-500 mr-2" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- CTA Section -->
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
              <Icon name="heroicons:play" class="w-5 h-5" />
              <span>Commencer maintenant</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { featuresData } from '~/data/features-data.js'

const router = useRouter()

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>
