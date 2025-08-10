<template>
  <div class="flex items-center space-x-4">
    <!-- Bouton toggle sidebar -->
    <button
      @click="$emit('toggle-sidebar')"
      class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md"
      :style="{
        backgroundColor: 'var(--button-bg)',
        borderColor: 'var(--button-border)',
        color: 'var(--text-primary)'
      }"
      :title="isSidebarCollapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'"
      :aria-label="isSidebarCollapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'"
    >
      <Icon 
        :name="isSidebarCollapsed ? 'heroicons:bars-3' : 'heroicons:x-mark'" 
        class="w-5 h-5 transition-transform duration-300"
        :class="{ 'rotate-180': !isSidebarCollapsed }"
        :style="{ color: 'var(--text-primary)' }"
      />
    </button>
    
    <!-- Logo et titre -->
    <div class="flex items-center space-x-3">
      <Icon name="fluent-emoji:snake" class="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
      <div class="flex flex-col">
        <h1 class="font-bold tracking-tight text-xl text-emerald-500">
          {{ $t('app.title') }}
        </h1>
        <span class="text-xs text-gray-600">
          {{ $t('app.subtitle') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-sidebar'])
</script>
