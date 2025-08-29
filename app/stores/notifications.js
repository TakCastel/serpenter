import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const nextId = ref(1);

  // Types de notifications disponibles
  const types = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  };

  // Ajouter une notification
  const addNotification = ({
    type = "info",
    title,
    message,
    duration = 5000,
  }) => {
    const id = nextId.value++;
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now(),
    };

    notifications.value.push(notification);

    // Auto-remove après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  // Supprimer une notification
  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // Méthodes de convenance pour chaque type
  const success = (title, message, duration) =>
    addNotification({ type: "success", title, message, duration });
  const error = (title, message, duration) =>
    addNotification({ type: "error", title, message, duration });
  const warning = (title, message, duration) =>
    addNotification({ type: "warning", title, message, duration });
  const info = (title, message, duration) =>
    addNotification({ type: "info", title, message, duration });

  // Vider toutes les notifications
  const clearAll = () => {
    notifications.value = [];
  };

  return {
    // État
    notifications: computed(() => notifications.value),

    // Types
    types,

    // Méthodes
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll,
  };
});
