<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4">
    <div class="text-center max-w-md">
      <!-- Icône -->
      <div class="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style="background-color: var(--bg-border);">
        <Icon name="heroicons:folder" class="w-12 h-12" style="color: var(--accent-primary);" aria-hidden="true" />
      </div>
      
      <!-- Titre -->
      <h1 class="text-2xl font-bold mb-4 transition-colors duration-200" style="color: var(--text-primary);">
        {{ $t('emptyState.title') }}
      </h1>
      
      <!-- Description -->
      <p class="text-lg mb-8 transition-colors duration-200" style="color: var(--text-secondary);">
        {{ $t('emptyState.description') }}
      </p>
      
      <!-- Bouton d'action -->
      <button
        @click="$emit('create-project')"
        @keydown.enter="$emit('create-project')"
        @keydown.space.prevent="$emit('create-project')"
        class="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
        style="background-color: var(--accent-primary); color: var(--bg-primary);"
        :aria-label="$t('emptyState.createButton')"
        role="button"
        tabindex="0"
      >
        <Icon name="heroicons:plus" class="w-5 h-5 inline mr-2" aria-hidden="true" />
        {{ $t('emptyState.createButton') }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['create-project'])
</script>
