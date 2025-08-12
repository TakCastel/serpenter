<template>
  <div class="inline-flex items-center gap-2" ref="rootEl">
    <!-- Language dropdown -->
    <div class="relative">
      <button
        @click="toggleMenu"
        :class="[
          'rounded-lg border transition-colors duration-200 h-10 flex items-center gap-2',
          size === 'sm' ? 'px-2.5' : 'px-3',
          context === 'dropdown' 
            ? 'border-transparent hover:opacity-80' 
            : 'border-gray-200 bg-white hover:bg-gray-50'
        ]"
        :style="context === 'dropdown' ? {
          backgroundColor: 'var(--button-bg)',
          color: 'var(--text-primary)'
        } : {}"
        :aria-expanded="showMenu"
        :aria-label="t('common.language.select')"
      >
        <Icon :name="currentFlagIcon" :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" aria-hidden="true" />
        <span class="text-xs font-medium" :class="context === 'dropdown' ? '' : 'text-gray-700'">{{ currentLangLabel }}</span>
        <Icon name="heroicons:chevron-down" :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" :style="context === 'dropdown' ? { color: 'var(--text-secondary)' } : { color: '#6b7280' }" aria-hidden="true" />
      </button>
      <div
        v-if="showMenu"
        :class="[
          'absolute right-0 mt-2 w-48 rounded-lg border shadow-lg overflow-hidden',
          context === 'dropdown' ? 'border-transparent' : 'border-gray-200'
        ]"
        :style="[
          context === 'dropdown' ? {
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          } : {},
          { zIndex: context === 'dropdown' ? 99999 : 50 }
        ]"
        role="menu"
        :aria-label="t('common.language.select')"
      >
        <button
          @click="chooseLanguage('fr')"
          class="w-full text-left px-3 py-2 text-sm transition-colors duration-200 flex items-center justify-between"
          :class="[
            locale?.value === 'fr' 
              ? context === 'dropdown' ? 'opacity-80' : 'bg-emerald-50 text-emerald-700'
              : context === 'dropdown' ? 'hover:opacity-80' : 'hover:bg-gray-50'
          ]"
          :style="context === 'dropdown' ? { color: 'var(--text-primary)' } : {}"
          :aria-selected="locale?.value === 'fr'"
          role="menuitem"
          tabindex="0"
        >
          <span class="flex items-center gap-2">
            <Icon name="circle-flags:fr" class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('common.language.french') }}</span>
          </span>
          <Icon v-if="locale?.value === 'fr'" name="heroicons:check" :style="context === 'dropdown' ? { color: 'var(--accent-primary)' } : { color: '#059669' }" class="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          @click="chooseLanguage('en')"
          class="w-full text-left px-3 py-2 text-sm transition-colors duration-200 flex items-center justify-between"
          :class="[
            locale?.value === 'en' 
              ? context === 'dropdown' ? 'opacity-80' : 'bg-emerald-50 text-emerald-700'
              : context === 'dropdown' ? 'hover:opacity-80' : 'hover:bg-gray-50'
          ]"
          :style="context === 'dropdown' ? { color: 'var(--text-primary)' } : {}"
          :aria-selected="locale?.value === 'en'"
          role="menuitem"
          tabindex="0"
        >
          <span class="flex items-center gap-2">
            <Icon name="circle-flags:gb" class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('common.language.english') }}</span>
          </span>
          <Icon v-if="locale?.value === 'en'" name="heroicons:check" :style="context === 'dropdown' ? { color: 'var(--accent-primary)' } : { color: '#059669' }" class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Theme switch -->
    <button
      @click="toggleTheme"
      :class="[
        'rounded-lg border transition-colors duration-200 flex items-center justify-center h-10',
        size === 'sm' ? 'w-10' : 'w-10',
        context === 'dropdown' 
          ? 'border-transparent hover:opacity-80' 
          : 'border-gray-200 bg-white hover:bg-gray-50'
      ]"
      :style="context === 'dropdown' ? {
        backgroundColor: 'var(--button-bg)',
        color: 'var(--text-primary)'
      } : {}"
      :title="isDark ? lightLabel : darkLabel"
      :aria-label="isDark ? lightLabel : darkLabel"
      role="button"
      tabindex="0"
    >
      <Icon 
        :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
        :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'"
        :style="context === 'dropdown' ? { color: 'var(--text-primary)' } : { color: '#374151' }"
        class="transition-colors duration-200"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  size: { type: String, default: 'md' }, // 'sm' | 'md'
  context: { type: String, default: 'header' } // 'header' | 'dropdown'
})

const { locale, setLocale, t, te } = useI18n({ useScope: 'global' })

const { isDark, toggleTheme } = useTheme()

const showMenu = ref(false)
const rootEl = ref(null)

const currentFlagIcon = computed(() => (locale?.value === 'fr' ? 'circle-flags:fr' : 'circle-flags:gb'))
const currentLangLabel = computed(() => (locale?.value === 'fr' ? 'FR' : 'EN'))

// Libellés thème avec fallback si la clé i18n est absente
const lightLabel = computed(() => {
  if (te && te('app.theme.light')) return t('app.theme.light')
  return locale?.value === 'fr' ? 'Passer au thème clair' : 'Switch to light theme'
})

const darkLabel = computed(() => {
  if (te && te('app.theme.dark')) return t('app.theme.dark')
  return locale?.value === 'fr' ? 'Passer au thème sombre' : 'Switch to dark theme'
})

const setLanguage = async (lang) => {
  try {
    if (typeof setLocale === 'function') {
      await setLocale(lang)
    } else if (locale) {
      locale.value = lang
    }
  } catch (e) {
    if (locale) locale.value = lang
  }
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const chooseLanguage = async (lang) => {
  await setLanguage(lang)
  showMenu.value = false
}

onMounted(() => {
  // Plus besoin d'appeler themeOnMounted() car useTheme gère déjà onMounted
})

onUnmounted(() => {
  // Plus besoin d'appeler themeOnUnmounted() car useTheme gère déjà onUnmounted
})
</script>

