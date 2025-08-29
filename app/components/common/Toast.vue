<template>
  <div
    v-if="notification"
    class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-out"
    :class="[
      'animate-slide-in',
      notification.type === 'success' && 'border-green-200 bg-green-50',
      notification.type === 'error' && 'border-red-200 bg-red-50',
      notification.type === 'warning' && 'border-yellow-200 bg-yellow-50',
      notification.type === 'info' && 'border-blue-200 bg-blue-50',
    ]"
  >
    <!-- Header avec icône et bouton de fermeture -->
    <div class="flex items-start justify-between p-4">
      <div class="flex items-center space-x-3">
        <!-- Icône selon le type -->
        <Icon
          :name="iconName"
          class="w-5 h-5 flex-shrink-0"
          :class="iconClass"
        />

        <!-- Contenu -->
        <div class="flex-1 min-w-0">
          <h4
            v-if="notification.title"
            class="text-sm font-medium"
            :class="titleClass"
          >
            {{ notification.title }}
          </h4>
          <p
            v-if="notification.message"
            class="text-sm mt-1"
            :class="messageClass"
          >
            {{ notification.message }}
          </p>
        </div>
      </div>

      <!-- Bouton de fermeture -->
      <button
        @click="close"
        class="ml-4 flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        :class="closeButtonClass"
      >
        <Icon name="heroicons:x-mark" class="w-4 h-4" />
      </button>
    </div>

    <!-- Barre de progression -->
    <div
      v-if="notification.duration > 0"
      class="h-1 bg-gray-200 rounded-b-lg overflow-hidden"
    >
      <div
        class="h-full transition-all duration-300 ease-linear"
        :class="progressBarClass"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// État local pour la barre de progression
const progressWidth = ref(100);
const progressInterval = ref(null);

// Icône et classes selon le type
const iconName = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "heroicons:check-circle";
    case "error":
      return "heroicons:exclamation-circle";
    case "warning":
      return "heroicons:exclamation-triangle";
    case "info":
      return "heroicons:information-circle";
    default:
      return "heroicons:information-circle";
  }
});

const iconClass = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    case "info":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
});

const titleClass = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "text-green-800";
    case "error":
      return "text-red-800";
    case "warning":
      return "text-yellow-800";
    case "info":
      return "text-blue-800";
    default:
      return "text-gray-800";
  }
});

const messageClass = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "text-green-700";
    case "error":
      return "text-red-700";
    case "warning":
      return "text-yellow-700";
    case "info":
      return "text-blue-700";
    default:
      return "text-gray-700";
  }
});

const closeButtonClass = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "text-green-600 hover:bg-green-100";
    case "error":
      return "text-red-600 hover:bg-red-100";
    case "warning":
      return "text-yellow-600 hover:bg-yellow-100";
    case "info":
      return "text-blue-600 hover:bg-blue-100";
    default:
      return "text-gray-600 hover:bg-gray-100";
  }
});

const progressBarClass = computed(() => {
  switch (props.notification.type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
});

// Fermer la notification
const close = () => {
  emit("close", props.notification.id);
};

// Gérer la barre de progression
onMounted(() => {
  if (props.notification.duration > 0) {
    const startTime = Date.now();
    const duration = props.notification.duration;

    progressInterval.value = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      progressWidth.value = (remaining / duration) * 100;

      if (remaining <= 0) {
        clearInterval(progressInterval.value);
      }
    }, 16); // ~60fps
  }
});

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
  }
});
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
