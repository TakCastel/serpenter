<template>
  <div class="card p-8 transition-all duration-300">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style="background-color: var(--accent-primary);">
      <Icon :name="icon" class="w-6 h-6" style="color: white;" />
    </div>
    <h3 class="text-xl font-semibold mb-4 transition-colors duration-300" style="color: var(--text-primary);">{{ title }}</h3>
    <p class="mb-6 transition-colors duration-300" style="color: var(--text-secondary);">
      {{ description }}
    </p>
    <ul class="space-y-2 text-sm transition-colors duration-300" style="color: var(--text-muted);">
      <li v-for="item in items" :key="item" class="flex items-center">
        <Icon name="fluent-emoji:check-mark" class="w-4 h-4 text-green-500 mr-2" />
        {{ item }}
      </li>
    </ul>
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
  },
  items: {
    type: Array,
    required: true
  }
})
</script>
