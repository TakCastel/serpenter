<template>
  <div v-if="exemple" class="space-y-3">
    <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
      {{ $t('items.details.exemple') }}
    </h4>
    <div class="space-y-4">
      <div v-if="exemple.description" class="text-sm transition-colors duration-200" style="color: var(--text-muted);">
        {{ exemple.description }}
      </div>
      
      <!-- Code Examples -->
      <div v-if="hasCodeExamples" class="space-y-2">
        <!-- HTML -->
        <div v-if="exemple.html" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-code);">{{ exemple.html }}</code></pre>
        </div>
        
        <!-- CSS -->
        <div v-if="exemple.css" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-code);">{{ exemple.css }}</code></pre>
        </div>
        
        <!-- JavaScript -->
        <div v-if="exemple.javascript" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-code);">{{ exemple.javascript }}</code></pre>
        </div>
        
        <!-- PHP -->
        <div v-if="exemple.php" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-code);">{{ exemple.php }}</code></pre>
        </div>
        
        <!-- Node.js -->
        <div v-if="exemple.nodejs" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-code);">{{ exemple.nodejs }}</code></pre>
        </div>
        
        <!-- Apache -->
        <div v-if="exemple.apache" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-code);">{{ exemple.apache }}</code></pre>
        </div>
        
        <!-- Nginx -->
        <div v-if="exemple.nginx" class="space-y-1">
          <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
          <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-code);">{{ exemple.nginx }}</code></pre>
        </div>
        
        <!-- Code Examples (ancienne structure) -->
        <div v-if="exemple.code" class="space-y-2">
          <!-- HTML -->
          <div v-if="exemple.code.html" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">HTML</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple HTML"><code style="color: var(--text-code);">{{ exemple.code.html }}</code></pre>
          </div>
          
          <!-- CSS -->
          <div v-if="exemple.code.css" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">CSS</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple CSS"><code style="color: var(--text-code);">{{ exemple.code.css }}</code></pre>
          </div>
          
          <!-- JavaScript -->
          <div v-if="exemple.code.javascript" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">JavaScript</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple JavaScript"><code style="color: var(--text-code);">{{ exemple.code.javascript }}</code></pre>
          </div>
          
          <!-- PHP -->
          <div v-if="exemple.code.php" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">PHP</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple PHP"><code style="color: var(--text-code);">{{ exemple.code.php }}</code></pre>
          </div>
          
          <!-- Node.js -->
          <div v-if="exemple.code.nodejs" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Node.js</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Node.js"><code style="color: var(--text-code);">{{ exemple.code.nodejs }}</code></pre>
          </div>
          
          <!-- Apache -->
          <div v-if="exemple.code.apache" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Apache</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Apache"><code style="color: var(--text-code);">{{ exemple.code.apache }}</code></pre>
          </div>
          
          <!-- Nginx -->
          <div v-if="exemple.code.nginx" class="space-y-1">
            <div class="text-xs font-medium transition-colors duration-200" style="color: var(--text-muted);">Nginx</div>
            <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple Nginx"><code style="color: var(--text-code);">{{ exemple.code.nginx }}</code></pre>
          </div>
        </div>
      </div>
      
      <!-- Image Example -->
      <div v-if="exemple.image" class="rounded-xl overflow-hidden" style="background-color: var(--bg-code);">
        <img 
          :src="exemple.image" 
          :alt="exemple.imageAlt || 'Exemple visuel'"
          class="w-full h-auto"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  exemple: {
    type: Object,
    default: null
  }
})

const hasCodeExamples = computed(() => {
  if (!props.exemple) return false
  return props.exemple.code || 
         props.exemple.html || 
         props.exemple.css || 
         props.exemple.javascript || 
         props.exemple.php || 
         props.exemple.nodejs || 
         props.exemple.apache || 
         props.exemple.nginx
})
</script>
