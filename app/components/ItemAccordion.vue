<template>
  <div class="card" role="region" :aria-label="$t('common.item', { label: item.label })">
    <!-- Item Header -->
    <div 
      class="p-6 cursor-pointer transition-all duration-200 hover:bg-opacity-80"
      @click="toggleAccordion"
      @keydown.enter="toggleAccordion"
      @keydown.space.prevent="toggleAccordion"
      role="button"
      :aria-expanded="isExpanded"
      :aria-controls="`item-details-${item.id}`"
      :aria-label="`${isExpanded ? $t('items.accordion.closeDetails') : $t('items.accordion.openDetails')} de ${item.label}`"
      tabindex="0"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 flex-1">
          <button
            @click.stop="toggleItem"
            @keydown.enter.stop="toggleItem"
            @keydown.space.stop.prevent="toggleItem"
            class="flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-200 hover:bg-opacity-80"
            :class="{ 'bg-accent': isItemChecked }"
            :aria-checked="isItemChecked"
            :aria-label="`${isItemChecked ? $t('items.accordion.uncheck') : $t('items.accordion.check')} ${item.label}`"
            style="border-color: var(--accent-primary);"
            :style="{ backgroundColor: isItemChecked ? 'var(--accent-primary)' : 'transparent' }"
            role="checkbox"
            tabindex="0"
          >
            <Icon 
              v-if="isItemChecked"
              name="heroicons:check" 
              class="w-4 h-4 transition-colors duration-200"
              style="color: white;"
              aria-hidden="true"
            />
          </button>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold leading-tight transition-colors duration-200 mb-2" style="color: var(--text-primary);">
              {{ item.label }}
            </h3>
            <p class="text-base transition-colors duration-200" style="color: var(--text-secondary);">
              {{ item.description }}
            </p>
          </div>
        </div>
        <button 
          class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-opacity-80"
          :class="{ 'rotate-180': isExpanded }"
          :aria-expanded="isExpanded"
          :aria-label="`${isExpanded ? $t('items.accordion.close') : $t('items.accordion.open')} les détails`"
          aria-hidden="true"
        >
          <Icon 
            name="heroicons:chevron-down" 
            class="w-5 h-5 transition-colors duration-200"
            style="color: var(--text-muted);"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <!-- Item Details -->
    <div 
      :id="`item-details-${item.id}`"
      class="border-t transition-all duration-500 ease-in-out overflow-hidden"
      style="border-color: var(--bg-border); background-color: var(--bg-primary);"
      :class="{ 'max-h-0': !isExpanded }"
      role="region"
      :aria-label="`Détails de ${item.label}`"
    >
      <div class="p-6 space-y-6">
        <!-- Message si pas de détails -->
        <div v-if="!item.details" class="text-center py-8">
          <p class="text-base transition-colors duration-200" style="color: var(--text-muted);">
            {{ $t('items.details.noDetails') }}
          </p>
        </div>
        
        <!-- Explication -->
        <div v-if="item.details && item.details.explication" class="space-y-3">
          <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
            {{ $t('items.details.explication') }}
          </h4>
          <p class="text-base leading-relaxed transition-colors duration-200" style="color: var(--text-secondary);">
            {{ item.details.explication }}
          </p>
        </div>

        <!-- Exemple -->
        <div v-if="item.details && item.details.exemple" class="space-y-3">
          <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
            {{ $t('items.details.exemple') }}
          </h4>
          <div class="space-y-4">
            <div v-if="item.details.exemple && item.details.exemple.description" class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
              {{ item.details.exemple.description }}
            </div>
            
            <!-- Code Examples -->
            <div v-if="item.details.exemple && (item.details.exemple.code || item.details.exemple.html || item.details.exemple.css || item.details.exemple.javascript || item.details.exemple.php || item.details.exemple.nodejs || item.details.exemple.apache || item.details.exemple.nginx)" class="space-y-2">
              <!-- HTML -->
              <div v-if="item.details.exemple.html" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-code);">{{ item.details.exemple.html }}</code></pre>
              </div>
              
              <!-- CSS -->
              <div v-if="item.details.exemple.css" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-code);">{{ item.details.exemple.css }}</code></pre>
              </div>
              
              <!-- JavaScript -->
              <div v-if="item.details.exemple.javascript" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-code);">{{ item.details.exemple.javascript }}</code></pre>
              </div>
              
              <!-- PHP -->
              <div v-if="item.details.exemple.php" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-code);">{{ item.details.exemple.php }}</code></pre>
              </div>
              
              <!-- Node.js -->
              <div v-if="item.details.exemple.nodejs" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-code);">{{ item.details.exemple.nodejs }}</code></pre>
              </div>
              
              <!-- Apache -->
              <div v-if="item.details.exemple.apache" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-code);">{{ item.details.exemple.apache }}</code></pre>
              </div>
              
              <!-- Nginx -->
              <div v-if="item.details.exemple.nginx" class="space-y-1">
                <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
                <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-code);">{{ item.details.exemple.nginx }}</code></pre>
              </div>
              
              <!-- Code Examples (ancienne structure) -->
              <div v-if="item.details.exemple.code" class="space-y-2">
                <!-- HTML -->
                <div v-if="item.details.exemple.code.html" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-code);">{{ item.details.exemple.code.html }}</code></pre>
                </div>
                
                <!-- CSS -->
                <div v-if="item.details.exemple.code.css" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-code);">{{ item.details.exemple.code.css }}</code></pre>
                </div>
                
                <!-- JavaScript -->
                <div v-if="item.details.exemple.code.javascript" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-code);">{{ item.details.exemple.code.javascript }}</code></pre>
                </div>
                
                <!-- PHP -->
                <div v-if="item.details.exemple.code.php" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-code);">{{ item.details.exemple.code.php }}</code></pre>
                </div>
                
                <!-- Node.js -->
                <div v-if="item.details.exemple.code.nodejs" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-code);">{{ item.details.exemple.code.nodejs }}</code></pre>
                </div>
                
                <!-- Apache -->
                <div v-if="item.details.exemple.code.apache" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-code);">{{ item.details.exemple.code.apache }}</code></pre>
                </div>
                
                <!-- Nginx -->
                <div v-if="item.details.exemple.code.nginx" class="space-y-1">
                  <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
                  <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-code);">{{ item.details.exemple.code.nginx }}</code></pre>
                </div>
              </div>
            </div>
            
            <!-- Image Example -->
            <div v-if="item.details.exemple && item.details.exemple.image" class="rounded-xl overflow-hidden" style="background-color: var(--bg-code);">
              <img 
                :src="item.details.exemple.image" 
                :alt="item.details.exemple.imageAlt || 'Exemple visuel'"
                class="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- Bonnes pratiques -->
        <div v-if="item.details && item.details.bonnesPratiques" class="space-y-2">
          <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
            {{ $t('items.details.bonnesPratiques') }}
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
                style="color: var(--accent-primary); position: relative; z-index: 0;"
                aria-hidden="true"
              />
              <span>{{ pratique }}</span>
            </li>
          </ul>
        </div>

        <!-- Ressources -->
        <div v-if="item.details && item.details.ressources && item.details.ressources.length > 0" class="space-y-3">
          <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
            {{ $t('items.details.ressources') }}
          </h4>
          <div class="space-y-3">
            <a 
              v-for="ressource in item.details.ressources" 
              :key="ressource.url"
              :href="ressource.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:bg-opacity-80"
              style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);"
              :title="ressource.title"
            >
              <Icon 
                name="heroicons:arrow-top-right-on-square" 
                class="w-5 h-5 flex-shrink-0 transition-colors duration-200"
                style="color: var(--accent-primary);"
                aria-hidden="true"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium transition-colors duration-200" style="color: var(--text-primary);">
                  {{ ressource.title }}
                </div>
                <div class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
                  {{ ressource.description }}
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Conseils -->
        <div v-if="item.details && item.details.conseils && item.details.conseils.length > 0" class="space-y-3">
          <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
            {{ $t('items.details.conseils') }}
          </h4>
          <div class="space-y-3">
            <div 
              v-for="conseil in item.details.conseils" 
              :key="conseil"
              class="flex items-start space-x-3 p-4 rounded-xl"
              style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);"
            >
              <Icon 
                name="heroicons:light-bulb" 
                class="w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-200"
                style="color: var(--accent-primary);"
                aria-hidden="true"
              />
              <p class="text-base transition-colors duration-200" style="color: var(--text-secondary);">
                {{ conseil }}
              </p>
            </div>
          </div>
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