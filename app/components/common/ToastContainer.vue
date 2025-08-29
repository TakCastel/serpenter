<template>
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <TransitionGroup name="toast" tag="div" class="space-y-3">
      <Toast
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close="removeNotification"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotificationsStore } from "~/stores/notifications";
import Toast from "./Toast.vue";

const notificationsStore = useNotificationsStore();

// Récupérer les notifications depuis le store
const notifications = computed(() => notificationsStore.notifications);

// Supprimer une notification
const removeNotification = (id) => {
  notificationsStore.removeNotification(id);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
