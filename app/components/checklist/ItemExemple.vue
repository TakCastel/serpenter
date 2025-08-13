<template>
  <div class="space-y-3">
    <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
      EXEMPLE
    </h4>
    <div class="space-y-4">
      <div class="space-y-1">
        <pre class="text-xs p-3 rounded overflow-x-auto" style="background-color: var(--bg-code);" role="code" aria-label="Exemple"><code style="color: var(--text-code);">{{ exemple }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  exemple: {
    type: String,
    default: null
  }
})
</script>
