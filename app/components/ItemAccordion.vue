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
            
            <!-- Code Examples -->
            <div v-if="item.details.exemple && (item.details.exemple.code || item.details.exemple.html || item.details.exemple.css || item.details.exemple.javascript || item.details.exemple.php || item.details.exemple.nodejs || item.details.exemple.apache || item.details.exemple.nginx)" class="space-y-2">
              <!-- HTML -->
              <div v-if="item.details.exemple.html" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-secondary);">{{ item.details.exemple.html }}</code></pre>
              </div>
              
              <!-- CSS -->
              <div v-if="item.details.exemple.css" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-secondary);">{{ item.details.exemple.css }}</code></pre>
              </div>
              
              <!-- JavaScript -->
              <div v-if="item.details.exemple.javascript" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-secondary);">{{ item.details.exemple.javascript }}</code></pre>
              </div>
              
              <!-- PHP -->
              <div v-if="item.details.exemple.php" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-secondary);">{{ item.details.exemple.php }}</code></pre>
              </div>
              
              <!-- Node.js -->
              <div v-if="item.details.exemple.nodejs" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-secondary);">{{ item.details.exemple.nodejs }}</code></pre>
              </div>
              
              <!-- Apache -->
              <div v-if="item.details.exemple.apache" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-secondary);">{{ item.details.exemple.apache }}</code></pre>
              </div>
              
              <!-- Nginx -->
              <div v-if="item.details.exemple.nginx" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
                <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-secondary);">{{ item.details.exemple.nginx }}</code></pre>
              </div>
              
              <!-- Code Examples (ancienne structure) -->
              <div v-if="item.details.exemple.code" class="space-y-2">
                <!-- HTML -->
                <div v-if="item.details.exemple.code.html" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.html }}</code></pre>
                </div>
                
                <!-- CSS -->
                <div v-if="item.details.exemple.code.css" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.css }}</code></pre>
                </div>
                
                <!-- JavaScript -->
                <div v-if="item.details.exemple.code.javascript" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.javascript }}</code></pre>
                </div>
                
                <!-- PHP -->
                <div v-if="item.details.exemple.code.php" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.php }}</code></pre>
                </div>
                
                <!-- Node.js -->
                <div v-if="item.details.exemple.code.nodejs" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.nodejs }}</code></pre>
                </div>
                
                <!-- Apache -->
                <div v-if="item.details.exemple.code.apache" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.apache }}</code></pre>
                </div>
                
                <!-- Nginx -->
                <div v-if="item.details.exemple.code.nginx" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
                  <pre class="text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto" style="background-color: var(--bg-surface);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-secondary);">{{ item.details.exemple.code.nginx }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bonnes pratiques -->
        <div v-if="item.details && item.details.bonnesPratiques" class="space-y-2">
          <h4 class="text-sm font-medium transition-colors duration-200" style="color: var(--accent-primary);">
            Bonnes pratiques
          </h4>
          <ul class="space-y-1" role="list">
            <li 
              v-for="(pratique, index) in item.details.bonnesPratiques" 
              :key="index"
              class="text-sm leading-relaxed transition-colors duration-200 flex items-start space-x-2"
              style="color: var(--text-secondary);"
              role="listitem"
            >
              <Icon 
                name="heroicons:check-circle" 
                class="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-200"
                style="color: var(--accent-primary);"
                aria-hidden="true"
              />
              <span>{{ pratique }}</span>
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
  item: {
    type: Object,
    required: true
  },
  isItemChecked: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-item'])

const isExpanded = ref(false)

const toggleAccordion = () => {
  isExpanded.value = !isExpanded.value
}

const toggleItem = () => {
  emit('toggle-item', props.item.id)
}

const handleCloseItemAccordion = (event) => {
  if (event.detail.itemId === props.item.id) {
    isExpanded.value = false
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('close-item-accordion', handleCloseItemAccordion)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('close-item-accordion', handleCloseItemAccordion)
  }
})
</script> 