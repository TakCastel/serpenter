<template>
  <div 
    class="p-4 cursor-pointer transition-all duration-200 hover:bg-opacity-80"
    @click="$emit('toggle-accordion')"
    @keydown.enter="$emit('toggle-accordion')"
    @keydown.space.prevent="$emit('toggle-accordion')"
    role="button"
    :aria-expanded="isExpanded"
    :aria-controls="`item-details-${item.id}`"
    :aria-label="`${isExpanded ? $t('items.accordion.closeDetails') : $t('items.accordion.openDetails')} de ${item.label}`"
    tabindex="0"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4 flex-1">
        <button
          @click.stop="$emit('toggle-item')"
          @keydown.enter.stop="$emit('toggle-item')"
          @keydown.space.stop.prevent="$emit('toggle-item')"
          class="flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 relative overflow-hidden"
          :class="{ 
            'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30': isItemChecked,
            'border-gray-300 hover:border-gray-400': !isItemChecked
          }"
          :aria-checked="isItemChecked"
          :aria-label="`${isItemChecked ? $t('items.accordion.uncheck') : $t('items.accordion.check')} ${item.label}`"
          role="checkbox"
          tabindex="0"
        >
          <!-- Checkbox -->
          <Icon 
            v-if="isItemChecked"
            name="heroicons:check" 
            class="w-3 h-3 transition-all duration-300 text-white drop-shadow-sm"
            :class="{ 'animate-bounce-in': isItemChecked }"
            aria-hidden="true"
          />
        </button>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold leading-tight transition-colors duration-200 mb-2" style="color: var(--text-primary);" v-html="item.label">
          </h3>
          <p class="text-base transition-colors duration-200" style="color: var(--text-secondary);">
            {{ item.description }}
          </p>
        </div>
      </div>
      <button 
        class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-opacity-80"
        :class="{ 'rotate-180': isExpanded && !isItemChecked }"
        :aria-expanded="isExpanded"
        :aria-label="`${isExpanded ? $t('items.accordion.close') : $t('items.accordion.open')} les détails`"
        aria-hidden="true"
      >
        <Icon 
          v-if="isItemChecked"
          name="heroicons:check-circle" 
          class="w-5 h-5 transition-colors duration-200"
          style="color: var(--accent-primary);"
          aria-hidden="true"
        />
        <Icon 
          v-else
          name="heroicons:chevron-down" 
          class="w-5 h-5 transition-colors duration-200"
          style="color: var(--text-muted);"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  isItemChecked: {
    type: Boolean,
    required: true
  },
  isExpanded: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle-accordion', 'toggle-item'])
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}
</style>
