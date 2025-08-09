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
          {{ $t('home.features.header') }}
        </h2>
        <p class="text-xl md:text-2xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" style="color: var(--text-secondary);">
          {{ $t('home.features.subtitle1.before') }} 
          <strong>{{ $t('home.features.subtitle1.em') }}</strong>
          {{ ' ' + $t('home.features.subtitle1.after') }} 
          <span class="font-semibold transition-colors duration-300" style="color: var(--accent-primary);">{{ $t('home.features.subtitle2') }}</span> 🎯
        </p>
      </div>
      
      <!-- Features grid (3 cartes ciblées) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div 
          v-for="feature in homepageFeatures" 
          :key="feature.id"
          class="card p-8 transition-all duration-300"
          style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);"
        >
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
            <Icon :name="feature.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" style="color: var(--text-primary);">
            {{ $t(feature.titleKey) }}
          </h3>
          <p class="mb-6 text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
            {{ $t(feature.descriptionKey) }}
          </p>
          <ul class="space-y-3 text-base transition-colors duration-300" style="color: var(--text-muted);">
            <li v-for="itemKey in feature.itemsKeys" :key="itemKey" class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-3 shrink-0" style="color: var(--accent-primary);" />
              <span class="flex-1">{{ $t(itemKey) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bloc storytelling: Problème / Solution, sans icônes -->
      <div class="my-24 md:my-32">
        <!-- En-tête concis -->
        <div class="px-6 md:px-10 pt-2 pb-8 text-center">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3" style="background-color: var(--bg-primary); color: var(--text-secondary); border: 1px solid var(--bg-border);">{{ $t('home.story.whyChip') }}</span>
          <h3 class="text-3xl md:text-4xl font-bold" style="color: var(--text-primary);">{{ $t('home.story.title') }}</h3>
          <p class="text-base md:text-lg mt-3 max-w-3xl mx-auto" style="color: var(--text-secondary);">{{ $t('home.story.subtitle') }}</p>
        </div>
        <!-- Deux colonnes texte uniquement -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <!-- Problème -->
          <div class="flex flex-col gap-4">
            <h4 class="text-lg font-semibold" style="color: var(--text-primary);">{{ $t('home.story.problemTitle') }}</h4>
            <p class="text-sm md:text-base leading-relaxed" style="color: var(--text-secondary);">
              {{ $t('home.story.p1.before') }} 
              <strong>{{ $t('home.story.p1.listEm') }}</strong>
              {{ ' ' + $t('home.story.p1.afterBefore') }} 
              <strong>{{ $t('home.story.p1.stakesEm') }}</strong>
            </p>
            <p class="text-sm md:text-base leading-relaxed" style="color: var(--text-secondary);">
              {{ $t('home.story.p2.before') }} 
              <strong>{{ $t('home.story.p2.item1') }}</strong>, 
              <strong>{{ $t('home.story.p2.item2') }}</strong>, 
              <strong>{{ $t('home.story.p2.item3') }}</strong>, 
              {{ $t('home.story.p2.connector') }} 
              <strong>{{ $t('home.story.p2.item4') }}</strong>.
            </p>
            <p class="text-sm md:text-base leading-relaxed" style="color: var(--text-secondary);">
              {{ $t('home.story.p3.before') }} 
              <strong>{{ $t('home.story.p3.em1') }}</strong>
              {{ $t('home.story.p3.middle') }} 
              <strong>{{ $t('home.story.p3.em2') }}</strong> 
              {{ $t('home.story.p3.after') }}
            </p>
          </div>
          <!-- Solution -->
          <div class="flex flex-col gap-4">
            <h4 class="text-lg font-semibold" style="color: var(--text-primary);">{{ $t('home.story.solutionTitle') }}</h4>
            <p class="text-sm md:text-base leading-relaxed" style="color: var(--text-secondary);">
              {{ $t('home.story.s1.before') }} 
              <strong>{{ $t('home.story.s1.em1') }}</strong> 
              {{ $t('home.story.s1.middle') }} 
              <strong>{{ $t('home.story.s1.em2') }}</strong>.
            </p>
            <p class="text-sm md:text-base leading-relaxed" style="color: var(--text-secondary);">
              {{ $t('home.story.s2.before') }} 
              <strong>{{ $t('home.story.s2.em1') }}</strong>, 
              {{ $t('home.story.s2.middle') }} 
              <strong>{{ $t('home.story.s2.em2') }}</strong> 
              {{ ' ' + $t('home.story.s2.afterBefore') }} 
              <strong>{{ $t('home.story.s2.em3') }}</strong> 
              {{ ' ' + $t('home.story.s2.after') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pricing removed -->
      
      <!-- CTA Section -->
      <div class="text-center">
        <div class="rounded-2xl p-12 max-w-4xl mx-auto relative overflow-hidden" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: 1px solid var(--bg-border);">
          <!-- Éléments décoratifs -->
          <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div class="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20"></div>
            <div class="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20"></div>
          </div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center bg-white">
              <Icon name="fluent-emoji:snake" class="w-10 h-10" :style="{ color: 'var(--accent-primary)' }" />
            </div>
            
            <h3 class="text-3xl md:text-4xl font-bold mb-6 text-white">
              {{ $t('home.cta.title') }}
            </h3>
            <p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              {{ $t('home.cta.subtitle') }}
            </p>
            <button 
              @click="navigateToDashboard"
              class="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:opacity-95 active:scale-[.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 bg-white text-gray-900"
            >
              <Icon name="heroicons:play" class="w-5 h-5" />
              <span>{{ $t('home.cta.button') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const homepageFeatures = [
  {
    id: 'checklist-system',
    titleKey: 'home.cards.checklist.title',
    descriptionKey: 'home.cards.checklist.desc',
    icon: 'heroicons:clipboard-document-check',
    itemsKeys: [
      'home.cards.checklist.items.0',
      'home.cards.checklist.items.1',
      'home.cards.checklist.items.2'
    ]
  },
  {
    id: 'lighthouse-integrated',
    titleKey: 'home.cards.lighthouse.title',
    descriptionKey: 'home.cards.lighthouse.desc',
    icon: 'heroicons:bolt',
    itemsKeys: [
      'home.cards.lighthouse.items.0',
      'home.cards.lighthouse.items.1',
      'home.cards.lighthouse.items.2'
    ]
  },
  {
    id: 'multi-projects',
    titleKey: 'home.cards.projects.title',
    descriptionKey: 'home.cards.projects.desc',
    icon: 'heroicons:folder',
    itemsKeys: [
      'home.cards.projects.items.0',
      'home.cards.projects.items.1',
      'home.cards.projects.items.2'
    ]
  }
]
import PricingSection from '~/components/home/PricingSection.vue'

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
