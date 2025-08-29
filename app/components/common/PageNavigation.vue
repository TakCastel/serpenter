<template>
  <div class="mb-6 flex items-center justify-between">
    <!-- Navigation de retour -->
    <div class="flex items-center space-x-3">
      <button
        @click="goBack"
        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
        :style="{
          color: 'var(--text-secondary)',
          backgroundColor: 'transparent',
        }"
        :class="{ 'hover:bg-opacity-10': true }"
        :onmouseover="
          ($event) =>
            ($event.target.style.backgroundColor = 'var(--button-hover)')
        "
        :onmouseleave="
          ($event) => ($event.target.style.backgroundColor = 'transparent')
        "
        aria-label="Retour au tableau de bord"
      >
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        <span>Retour</span>
      </button>

      <div :style="{ color: 'var(--bg-border)' }">|</div>

      <button
        @click="goToDashboard"
        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
        :style="{
          color: 'var(--text-secondary)',
          backgroundColor: 'transparent',
        }"
        :class="{ 'hover:bg-opacity-10': true }"
        :onmouseover="
          ($event) =>
            ($event.target.style.backgroundColor = 'var(--button-hover)')
        "
        :onmouseleave="
          ($event) => ($event.target.style.backgroundColor = 'transparent')
        "
        aria-label="Aller au tableau de bord"
      >
        <Icon name="heroicons:home" class="w-4 h-4" />
        <span>Tableau de bord</span>
      </button>
    </div>

    <!-- Titre de la page -->
    <div
      v-if="pageTitle"
      class="text-2xl font-bold"
      :style="{ color: 'var(--text-primary)' }"
    >
      {{ pageTitle }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  pageTitle: {
    type: String,
    default: "",
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
  showDashboardButton: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    goToDashboard();
  }
};

const goToDashboard = () => {
  router.push("/dashboard");
};
</script>
