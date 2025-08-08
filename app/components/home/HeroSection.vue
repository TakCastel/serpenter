<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 transition-all duration-300" style="background: linear-gradient(to bottom right, var(--bg-surface), var(--bg-primary), var(--bg-surface));"></div>
    
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- Theme Toggle Button -->
    <div class="absolute top-6 right-6 z-20">
      <button
        @click="toggleTheme"
        class="w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-opacity-80 backdrop-blur-sm border shadow-lg"
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
    <div class="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
      <!-- Logo/Brand -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-2xl">
          <Icon name="fluent-emoji:snake" class="w-8 h-8" style="color: var(--accent-primary);" />
        </div>
      </div>
      
      <!-- Main heading -->
      <h1 class="text-4xl md:text-6xl font-bold mb-4 transition-all duration-300" style="color: var(--text-primary);">
        Serpenter
      </h1>
      
      <!-- Subtitle with humor -->
      <div class="mb-6 max-w-3xl mx-auto">
        <p class="text-lg md:text-xl mb-2 leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
          Vous en avez marre d'oublier la balise <code class="px-2 py-1 rounded text-sm font-mono transition-colors duration-300" style="background-color: var(--bg-code); color: var(--text-code);">title</code> ?
        </p>
        <p class="text-base md:text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
          La checklist complète pour vérifier votre site <strong>avant</strong> de le déployer. 
          <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">Parce qu'un site parfait, ça se prépare !</span>
        </p>
      </div>
      
      <!-- Pain points -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
        <div class="card p-4 text-center transition-all duration-300">
          <div class="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--accent-primary);">
            <Icon name="heroicons:face-frown" class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-base font-semibold mb-1 transition-colors duration-300" style="color: var(--text-primary);">Oups, j'ai oublié...</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">La meta description, les alt text, le HTTPS...</p>
        </div>
        
        <div class="card p-4 text-center transition-all duration-300">
          <div class="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--accent-primary);">
            <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-base font-semibold mb-1 transition-colors duration-300" style="color: var(--text-primary);">Ça charge trop lentement</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">Images non optimisées, pas de cache...</p>
        </div>
        
        <div class="card p-4 text-center transition-all duration-300">
          <div class="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--accent-primary);">
            <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-base font-semibold mb-1 transition-colors duration-300" style="color: var(--text-primary);">Comment vérifier ?</h3>
          <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">Trop de choses à penser, pas assez de temps...</p>
        </div>
      </div>
      
      <!-- Solution -->
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="card p-6" style="background-color: var(--accent-primary);">
          <h2 class="text-xl md:text-2xl font-bold mb-2 text-white">
            🎯 La solution : Une checklist intelligente
          </h2>
          <p class="text-base opacity-90 text-white">
            Plus de 200 points de vérification organisés par catégories. 
            <strong>Cochez, validez, déployez en toute sérénité !</strong>
          </p>
        </div>
      </div>
      
      <!-- CTA Buttons -->
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
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
      <Icon name="heroicons:chevron-down" class="w-5 h-5 transition-colors duration-300" style="color: var(--text-muted);" />
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
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
