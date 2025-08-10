<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Navigation de la page -->
      <PageNavigation page-title="Mon Profil" />
      
      <!-- Contenu de la page -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Page profil - contenu à venir</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageNavigation from '~/components/common/PageNavigation.vue'

definePageMeta({
  layout: 'dashboard'
})
</script>
