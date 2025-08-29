<template>
  <div
    v-if="isVisible"
    class="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-sm transition-all duration-300 ease-in-out"
    :class="
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    "
    style="background-color: var(--bg-surface); border-color: var(--bg-border)"
  >
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <Icon
          name="heroicons:arrow-path"
          class="w-5 h-5 animate-spin"
          style="color: var(--accent-primary)"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium" style="color: var(--text-primary)">
          Changement de projet en cours...
        </p>
        <p class="text-xs" style="color: var(--text-secondary)">
          Chargement de la checklist
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

// Auto-hide après 3 secondes
const autoHide = () => {
  if (props.isVisible) {
    setTimeout(() => {
      // Émettre un événement pour cacher la notification
      if (process.client) {
        window.dispatchEvent(new CustomEvent("hide-loading-notification"));
      }
    }, 3000);
  }
};

onMounted(() => {
  if (props.isVisible) {
    autoHide();
  }
});

onUnmounted(() => {
  // Nettoyer les timeouts si nécessaire
});
</script>
