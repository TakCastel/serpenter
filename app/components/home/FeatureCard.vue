<template>
  <div class="card p-8 transition-all duration-300 hover:scale-105" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
    <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
      <Icon :name="icon" class="w-8 h-8" style="color: white;" />
    </div>
    <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" style="color: var(--text-primary);">{{ title }}</h3>
    <p class="mb-6 text-lg leading-relaxed transition-colors duration-300" style="color: var(--text-secondary);">
      {{ description }}
    </p>
    <ul class="space-y-3 text-base transition-colors duration-300" style="color: var(--text-muted);">
      <li v-for="item in items" :key="item" class="flex items-center">
        <Icon name="heroicons:check-circle" class="w-5 h-5 mr-3" style="color: var(--accent-primary);" />
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
