<template>
  <div v-if="bonnesPratiques && bonnesPratiques.length > 0" class="space-y-2">
    <h4 class="text-lg font-semibold transition-colors duration-200" style="color: var(--accent-primary);">
      {{ $t('items.details.bonnesPratiques') }}
    </h4>
    <ul class="space-y-1" role="list">
      <li 
        v-for="(pratique, index) in bonnesPratiques" 
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
</template>

<script setup>
defineProps({
  bonnesPratiques: {
    type: Array,
    default: () => []
  }
})
</script>
