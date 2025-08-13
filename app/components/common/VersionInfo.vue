<template>
  <div class="text-xs opacity-60 hover:opacity-100 transition-opacity duration-200">
    <div v-if="simple" class="text-xs opacity-60">
      v{{ version }} | {{ buildDate }}
    </div>
    <div v-else class="bg-black/10 backdrop-blur-sm rounded-lg p-2 text-xs">
      <div class="font-mono">
        <div>v{{ version }}</div>
        <div>{{ buildDate }}</div>
        <div>{{ buildHash }}</div>
        <div>{{ buildEnv }}</div>
        <!-- Debug i18n -->
        <div class="mt-2 pt-2 border-t border-white/20">
          <div>i18n: {{ i18nStatus }}</div>
          <div>Locale: {{ currentLocale }}</div>
          <div>Fallback: {{ fallbackLocale }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  simple: { type: Boolean, default: false }
})

const { version, buildDate, buildHash, buildEnv } = useVersion()
const { locale, t, te } = useI18n()

// Debug i18n
const i18nStatus = computed(() => {
  try {
    // Test si l'i18n fonctionne
    const testKey = 'welcome'
    const testResult = t(testKey)
    return testResult !== testKey ? '✅ OK' : '❌ KO'
  } catch (error) {
    return '❌ Error'
  }
})

const currentLocale = computed(() => locale?.value || 'undefined')
const fallbackLocale = computed(() => {
  try {
    return t('welcome') !== 'welcome' ? '✅' : '❌'
  } catch {
    return '❌'
  }
})
</script>
