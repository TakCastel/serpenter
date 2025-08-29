<template>
  <div
    class="min-h-screen p-8"
    :style="{ backgroundColor: 'var(--bg-primary)' }"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Navigation de la page -->
      <PageNavigation page-title="Mon Profil" />

      <!-- Contenu de la page -->
      <div
        class="rounded-lg shadow-sm border p-6"
        :style="{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--bg-border)',
        }"
      >
        <p :style="{ color: 'var(--text-secondary)' }">
          Page profil - contenu à venir
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageNavigation from "~/components/common/PageNavigation.vue";

definePageMeta({
  layout: "dashboard",
});
</script>
