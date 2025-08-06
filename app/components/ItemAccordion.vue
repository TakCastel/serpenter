<template>
  <div class="rounded-lg border transition-colors duration-200" style="background-color: var(--bg-primary); border-color: var(--bg-border);" role="region" :aria-label="`Élément ${item.label}`">
    <!-- Item Header -->
    <div 
      class="p-4 cursor-pointer transition-colors duration-200 hover:opacity-80"
      @click="toggleAccordion"
      @keydown.enter="toggleAccordion"
      @keydown.space.prevent="toggleAccordion"
      role="button"
      :aria-expanded="isExpanded"
      :aria-controls="`item-details-${item.id}`"
      :aria-label="`${isExpanded ? 'Fermer' : 'Ouvrir'} les détails de ${item.label}`"
      tabindex="0"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1">
          <button
            @click.stop="toggleItem"
            @keydown.enter.stop="toggleItem"
            @keydown.space.stop.prevent="toggleItem"
            class="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200"
            :class="{ 'bg-accent': isItemChecked }"
            :aria-checked="isItemChecked"
            :aria-label="`${isItemChecked ? 'Décocher' : 'Cocher'} ${item.label}`"
            style="border-color: var(--accent-primary);"
            :style="{ backgroundColor: isItemChecked ? 'var(--accent-primary)' : 'transparent' }"
            role="checkbox"
            tabindex="0"
          >
            <Icon 
              v-if="isItemChecked"
              name="heroicons:check" 
              class="w-3.5 h-3.5 transition-colors duration-200"
              style="color: var(--bg-primary);"
              aria-hidden="true"
            />
          </button>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium leading-tight transition-colors duration-200" style="color: var(--text-primary);">
          {{ item.label }}
            </h3>
            <p class="text-xs mt-1 transition-colors duration-200" style="color: var(--text-secondary);">
              {{ item.description }}
            </p>
          </div>
      </div>
      <button 
          class="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center transition-all duration-200 hover:opacity-80"
          :class="{ 'rotate-180': isExpanded }"
        :aria-expanded="isExpanded"
          :aria-label="`${isExpanded ? 'Fermer' : 'Ouvrir'} les détails`"
          aria-hidden="true"
        >
          <Icon 
            name="heroicons:chevron-down" 
            class="w-4 h-4 transition-colors duration-200"
            style="color: var(--text-muted);"
            aria-hidden="true"
          />
      </button>
      </div>
    </div>

    <!-- Item Details -->
    <div 
      :id="`item-details-${item.id}`"
      class="border-t transition-all duration-300 ease-in-out overflow-hidden"
      style="border-color: var(--bg-border); background-color: var(--bg-surface);"
      :class="{ 'max-h-0': !isExpanded }"
      role="region"
      :aria-label="`Détails de ${item.label}`"
    >
      <div class="p-4 space-y-4">
        <!-- Message si pas de détails -->
        <div v-if="!item.details" class="text-center py-4">
          <p class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
            Aucun détail disponible pour cet élément
          </p>
        </div>
        
        <!-- Explication -->
        <div v-if="item.details && item.details.explication" class="space-y-2">
          <h4 class="text-sm font-medium transition-colors duration-200" style="color: var(--accent-primary);">
            Explication
          </h4>
          <p class="text-sm leading-relaxed transition-colors duration-200" style="color: var(--text-secondary);">
            {{ item.details.explication }}
          </p>
        </div>

        <!-- Exemple -->
        <div v-if="item.details && item.details.exemple" class="space-y-2">
          <h4 class="text-sm font-medium transition-colors duration-200" style="color: var(--accent-primary);">
            Exemple
          </h4>
          <div class="space-y-3">
            <div v-if="item.details.exemple && item.details.exemple.description" class="text-xs transition-colors duration-200" style="color: var(--text-muted);">
              {{ item.details.exemple.description }}
            </div>
            
            <!-- HTML -->
            <div v-if="item.details.exemple && item.details.exemple.html" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                HTML
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de code HTML"><code>{{ item.details.exemple.html }}</code></pre>
            </div>
            
            <!-- CSS -->
            <div v-if="item.details.exemple && item.details.exemple.css" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                CSS
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de code CSS"><code>{{ item.details.exemple.css }}</code></pre>
            </div>
            
            <!-- JavaScript -->
            <div v-if="item.details.exemple && item.details.exemple.javascript" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                JavaScript
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de code JavaScript"><code>{{ item.details.exemple.javascript }}</code></pre>
            </div>
            
            <!-- PHP -->
            <div v-if="item.details.exemple && item.details.exemple.php" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                PHP
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de code PHP"><code>{{ item.details.exemple.php }}</code></pre>
            </div>
            
            <!-- Node.js -->
            <div v-if="item.details.exemple && item.details.exemple.nodejs" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                Node.js
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de code Node.js"><code>{{ item.details.exemple.nodejs }}</code></pre>
            </div>
            
            <!-- Apache -->
            <div v-if="item.details.exemple && item.details.exemple.apache" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                Apache
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de configuration Apache"><code>{{ item.details.exemple.apache }}</code></pre>
            </div>
            
            <!-- Nginx -->
            <div v-if="item.details.exemple && item.details.exemple.nginx" class="rounded-md p-3 border transition-colors duration-200" style="background-color: var(--bg-border); border-color: var(--bg-border);">
              <div class="text-xs mb-2 transition-colors duration-200" style="color: var(--text-muted);">
                Nginx
              </div>
              <pre class="text-sm font-mono transition-colors duration-200 whitespace-pre-wrap overflow-x-auto" style="color: var(--text-primary);" role="code" aria-label="Exemple de configuration Nginx"><code>{{ item.details.exemple.nginx }}</code></pre>
            </div>
          </div>
        </div>

        <!-- Bonnes pratiques -->
        <div v-if="item.details && item.details.bonnesPratiques && item.details.bonnesPratiques.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium transition-colors duration-200" style="color: var(--accent-primary);">
            Bonnes pratiques
          </h4>
          <ul class="space-y-1" role="list">
            <li 
              v-for="(practice, index) in item.details.bonnesPratiques" 
              :key="index"
              class="text-sm flex items-start space-x-2 transition-colors duration-200"
              style="color: var(--text-secondary);"
              role="listitem"
            >
              <Icon 
                name="heroicons:check" 
                class="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-200"
                style="color: var(--accent-primary);"
                aria-hidden="true"
              />
              <span>{{ practice }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  isItemChecked: { type: Boolean, required: true }
})

const emit = defineEmits(['toggle-item'])
const isExpanded = ref(false)

const toggleAccordion = () => {
  isExpanded.value = !isExpanded.value
}

const toggleItem = () => {
  emit('toggle-item', props.item.id)
}

// Écouter l'événement de fermeture des accordéons d'items
const handleCloseItemAccordion = (event) => {
  if (event.detail.itemId === props.item.id) {
    isExpanded.value = false
  }
}

onMounted(() => {
  window.addEventListener('close-item-accordion', handleCloseItemAccordion)
})

onUnmounted(() => {
  window.removeEventListener('close-item-accordion', handleCloseItemAccordion)
})

const getCodeTitle = (language) => {
  const titles = {
    'html': 'HTML',
    'vue': 'Vue.js',
    'js': 'JavaScript',
    'css': 'CSS',
    'php': 'PHP',
    'python': 'Python'
  }
  return titles[language] || language.toUpperCase()
}
</script> 