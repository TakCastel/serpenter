<template>
  <div v-if="explication" class="space-y-3">
    <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
      {{ $t('items.details.explication') }}
    </h4>
    <p class="text-base leading-relaxed transition-colors duration-200" style="color: var(--text-secondary);">
      {{ explication }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  explication: {
    type: String,
    default: null
  }
})
</script>
