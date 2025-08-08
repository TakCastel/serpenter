<template>
  <section id="features" class="py-24 transition-all duration-300" style="background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-primary) 100%);">
    <!-- Motif serpent en arrière-plan -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 right-20 w-64 h-64">
        <svg viewBox="0 0 300 300" class="w-full h-full">
          <path 
            d="M30,150 Q80,100 130,150 T230,150" 
            stroke="var(--accent-primary)" 
            stroke-width="6" 
            fill="none" 
            stroke-linecap="round"
            class="animate-snake-path-delayed"
          />
          <circle cx="230" cy="150" r="4" fill="var(--accent-primary)" class="animate-pulse" />
        </svg>
      </div>
    </div>
    
    <!-- Grille subtile -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, var(--accent-primary) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-6xl font-bold mb-8 transition-colors duration-300" style="color: var(--text-primary);">
          Plus de 200 vérifications organisées
        </h2>
        <p class="text-xl md:text-2xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" style="color: var(--text-secondary);">
          Une checklist complète pour vérifier votre site <strong>avant</strong> le déploiement. 
          <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">Parce qu'il vaut mieux prévenir que guérir !</span> 🎯
        </p>
      </div>
      
      <!-- Features grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div 
          v-for="feature in featuresData" 
          :key="feature.id"
          class="card p-8 transition-all duration-300"
          style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);"
        >
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <Icon :name="feature.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" style="color: var(--text-primary);">
            {{ feature.title }}
          </h3>
          <p class="mb-6 text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
            {{ feature.description }}
          </p>
          <ul class="space-y-3 text-base transition-colors duration-300" style="color: var(--text-muted);">
            <li v-for="item in feature.items" :key="item" class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-3" style="color: var(--accent-primary);" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Section explicative -->
      <div class="max-w-4xl mx-auto mb-20">
        <div class="card p-12 transition-all duration-300" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-6 transition-colors duration-300" style="color: var(--text-primary);">
              Pourquoi Serpenter ?
            </h2>
            <p class="text-xl leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
              Une solution complète pour tous les professionnels du web
            </p>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Problème -->
            <div>
              <h3 class="text-2xl font-bold mb-6 transition-colors duration-300" style="color: var(--text-primary);">
                Le problème
              </h3>
              <div class="space-y-4 text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
                <p>
                  Combien de fois avez-vous déployé un site en vous demandant si vous n'aviez rien oublié ? 
                  <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">SEO, performance, accessibilité, sécurité...</span> 
                  La liste est longue et les enjeux sont importants.
                </p>
                <p>
                  Un oubli peut coûter cher : <span class="font-semibold">rangs dans Google, expérience utilisateur dégradée, problèmes de sécurité, ou même des amendes pour non-conformité.</span>
                </p>
                <p>
                  Et quand on travaille seul ou en équipe, il est facile de passer à côté de points critiques qui peuvent faire la différence entre un site qui performe et un site qui déçoit.
                </p>
              </div>
            </div>
            
            <!-- Solution -->
            <div>
              <h3 class="text-2xl font-bold mb-6 transition-colors duration-300" style="color: var(--text-primary);">
                La solution
              </h3>
              <div class="space-y-4 text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
                <p>
                  <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">Serpenter</span> 
                  est une checklist exhaustive et intelligente qui vous guide pas à pas dans la vérification de votre site avant déploiement.
                </p>
                <p>
                  <strong>Pour tous les professionnels du web :</strong> Que vous soyez freelance, développeur en équipe, ou QA testeur, Serpenter vous assure de livrer un travail irréprochable, standardise vos processus de validation et vous donne une base solide pour vos tests. Ne laissez rien au hasard dans vos vérifications.
                </p>
              </div>
            </div>
          </div>
          
          <div class="mt-12 p-8 rounded-2xl" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <div class="text-center">
              <h4 class="text-2xl font-bold text-white mb-4">
                Plus de 200 points de vérification organisés
              </h4>
              <p class="text-white/90 text-lg">
                De la balise title aux bonnes pratiques de sécurité, en passant par l'accessibilité et la performance. 
                <span class="font-semibold">Tout est couvert, rien n'est laissé au hasard.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="text-center">
        <div class="card p-12 max-w-4xl mx-auto relative overflow-hidden" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: 1px solid var(--bg-border);">
          <!-- Éléments décoratifs -->
          <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20"></div>
            <div class="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20"></div>
          </div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center bg-white backdrop-blur-sm">
              <Icon name="fluent-emoji:snake" class="w-10 h-10" style="color: var(--accent-primary);" />
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

<style scoped>
@keyframes snake-path-delayed {
  0% {
    stroke-dasharray: 0 1000;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 1000 0;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 1000 0;
    stroke-dashoffset: -1000;
  }
}

.animate-snake-path-delayed {
  animation: snake-path-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
  stroke-dasharray: 0 1000;
}
</style>
