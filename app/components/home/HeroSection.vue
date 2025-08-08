<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background avec motif serpent -->
    <div class="absolute inset-0 transition-all duration-300" style="background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-primary) 100%);"></div>
    
    <!-- Motif serpent en arrière-plan -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-10 left-10 w-96 h-96">
        <svg viewBox="0 0 400 400" class="w-full h-full">
          <path 
            d="M50,200 Q100,150 150,200 T250,200 T350,200" 
            stroke="var(--accent-primary)" 
            stroke-width="8" 
            fill="none" 
            stroke-linecap="round"
            class="animate-snake-path"
          />
          <circle cx="350" cy="200" r="6" fill="var(--accent-primary)" class="animate-pulse" />
        </svg>
      </div>
      <div class="absolute bottom-20 right-20 w-64 h-64">
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
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, var(--accent-primary) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <!-- Theme Toggle Button -->
    <div class="absolute top-6 right-6 z-20">
      <button
        @click="toggleTheme"
        class="w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm border"
        style="background-color: var(--bg-surface); border-color: var(--bg-border);"
        :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
        :aria-label="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
        role="button"
        tabindex="0"
      >
        <Icon 
          :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
          class="w-5 h-5 transition-colors duration-200"
          style="color: var(--text-primary);"
          aria-hidden="true"
        />
      </button>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
      <!-- Logo/Brand -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 bg-white">
          <Icon name="fluent-emoji:snake" class="w-10 h-10" style="color: var(--accent-primary);" />
        </div>
      </div>
      
      <!-- Main heading -->
      <h1 class="text-5xl md:text-7xl font-bold mb-6 transition-all duration-300" style="color: var(--accent-primary);">
        Serpenter
      </h1>
      
      <!-- Subtitle clair et direct -->
      <div class="mb-8 max-w-3xl mx-auto">
        <p class="text-xl md:text-2xl mb-4 leading-relaxed transition-colors duration-300 font-medium" style="color: var(--text-primary);">
          La checklist complète pour vérifier votre site avant le déploiement
        </p>
        <p class="text-lg md:text-xl leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
          Plus de 200 points de vérification organisés par catégories. 
          <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">Cochez, validez, déployez en toute sérénité !</span>
        </p>
      </div>
      
      <!-- Avantages clés -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
        <div class="card p-6 text-center transition-all duration-300" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2 transition-colors duration-300" style="color: var(--text-primary);">Vérification complète</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">SEO, performance, accessibilité, sécurité et plus encore</p>
        </div>
        
        <div class="card p-6 text-center transition-all duration-300" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <Icon name="heroicons:light-bulb" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2 transition-colors duration-300" style="color: var(--text-primary);">Conseils pratiques</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">Explications détaillées et bonnes pratiques pour chaque point</p>
        </div>
        
        <div class="card p-6 text-center transition-all duration-300" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <Icon name="heroicons:rocket-launch" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-semibold mb-2 transition-colors duration-300" style="color: var(--text-primary);">Déploiement serein</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">Confiance totale avant de mettre votre site en ligne</p>
        </div>
      </div>
      
      <!-- CTA Principal -->
      <div class="mb-16 text-center">
        <button 
          @click="navigateToDashboard"
          class="px-12 py-6 text-2xl font-bold rounded-3xl transition-all duration-300"
          style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white;"
        >
          <span class="flex items-center space-x-4">
            <Icon name="heroicons:play" class="w-7 h-7" />
            <span>Commencer maintenant</span>
          </span>
        </button>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--bg-surface); border: 2px solid var(--bg-border);">
        <Icon name="heroicons:chevron-down" class="w-4 h-4 transition-colors duration-300" style="color: var(--text-primary);" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()

const isDark = ref(true)

const navigateToDashboard = () => {
  router.push('/dashboard')
}

const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('light-theme')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.add('light-theme')
    } else {
      isDark.value = true
      document.documentElement.classList.remove('light-theme')
    }
  }
})
</script>

<style scoped>
@keyframes snake-path {
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

.animate-snake-path {
  animation: snake-path 8s ease-in-out infinite;
  stroke-dasharray: 0 1000;
}

.animate-snake-path-delayed {
  animation: snake-path-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
  stroke-dasharray: 0 1000;
}
</style>

