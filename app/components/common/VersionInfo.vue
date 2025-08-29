<template>
  <div
    class="text-xs opacity-60 hover:opacity-100 transition-opacity duration-200"
    :style="{ color: 'var(--text-secondary)' }"
  >
    <div v-if="simple" class="text-xs opacity-60">
      v{{ version }} | {{ buildDate }}
    </div>
    <div
      v-else
      class="backdrop-blur-sm rounded-lg p-2 text-xs"
      :style="{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }"
    >
      <div class="font-mono">
        <div>v{{ version }}</div>
        <div>{{ buildDate }}</div>
        <div>{{ buildHash }}</div>
        <div>{{ buildEnv }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  simple: { type: Boolean, default: false },
});

const { version, buildDate, buildHash, buildEnv } = useVersion();
</script>
