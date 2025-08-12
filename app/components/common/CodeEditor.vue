<template>
  <div class="w-full">
    <div v-if="label" class="mb-2 flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      <div class="flex items-center gap-2 text-xs">
        <button class="btn-xs" @click="handleClean" v-if="cleanMarkdown">Nettoyer Markdown</button>
        <button class="btn-xs" @click="handleCopy">Copier</button>
        <button class="btn-xs" @click="handleClear">Vider</button>
      </div>
    </div>
    <textarea
      :rows="rows"
      :placeholder="placeholder"
      class="textarea font-mono"
      :value="modelValue"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
  rows?: number
  cleanMarkdown?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  label: '',
  rows: 10,
  cleanMarkdown: false
})

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const onInput = (e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
}

const handleClear = () => emit('update:modelValue', '')

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.modelValue || '')
  } catch {
    // noop
  }
}

const stripMarkdownFences = (text: string) => {
  return (text || '')
    .replace(/```[a-zA-Z]*\s*/g, '')
    .replace(/```/g, '')
    .trim()
}

const handleClean = () => {
  if (!props.cleanMarkdown) return
  const cleaned = stripMarkdownFences(props.modelValue)
  emit('update:modelValue', cleaned)
}
</script>

<style scoped>
.textarea { @apply w-full border rounded-md px-3 py-2; }
.btn-xs { @apply px-2 py-1 rounded border text-gray-700 bg-white hover:bg-gray-50; }
</style>

