<template>
  <div v-if="conseils && conseils.length > 0" class="space-y-3">
    <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
      {{ $t('items.details.conseils') }}
    </h4>
    <div class="space-y-3">
      <div 
        v-for="conseil in conseils" 
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
</template>

<script setup>
defineProps({
  conseils: {
    type: Array,
    default: () => []
  }
})
</script>
