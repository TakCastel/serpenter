<template>
  <div class="card p-4 text-center transition-all duration-300">
    <div class="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--accent-primary);">
      <Icon :name="icon" class="w-5 h-5 text-white" />
    </div>
    <h3 class="text-base font-semibold mb-1 transition-colors duration-300" style="color: var(--text-primary);">{{ title }}</h3>
    <p class="text-sm transition-colors duration-300" style="color: var(--text-secondary);">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
