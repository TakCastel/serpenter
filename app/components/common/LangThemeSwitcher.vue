<template>
  <div class="inline-flex items-center gap-2" ref="rootEl">
    <!-- Language dropdown -->
    <div class="relative">
      <button
        @click="toggleMenu"
        :class="[
          'rounded-xl border backdrop-blur-sm flex items-center gap-2 transition-all duration-200',
          size === 'sm' ? 'px-2.5 py-1.5' : 'px-3 py-2'
        ]"
        style="background-color: var(--bg-surface); border-color: var(--bg-border); color: var(--text-primary);"
        :aria-expanded="showMenu"
        :aria-label="t('app.language.select')"
      >
        <Icon :name="currentFlagIcon" :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" aria-hidden="true" />
        <span class="text-xs font-medium">{{ currentLangLabel }}</span>
        <Icon name="heroicons:chevron-down" class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" aria-hidden="true" />
      </button>
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 rounded-xl border z-50 overflow-hidden"
        style="background-color: var(--bg-surface); border-color: var(--bg-border);"
        role="menu"
        :aria-label="t('app.language.select')"
      >
        <button
          @click="chooseLanguage('fr')"
          class="w-full text-left px-3 py-2 text-sm transition-all duration-200 flex items-center justify-between"
          :style="{
            color: locale?.value === 'fr' ? 'var(--accent-primary)' : 'var(--text-primary)',
            backgroundColor: locale?.value === 'fr' ? 'var(--bg-border)' : 'transparent'
          }"
          :aria-selected="locale?.value === 'fr'"
          role="menuitem"
          tabindex="0"
          @mouseenter="$event.target.style.backgroundColor = 'var(--bg-border)'"
          @mouseleave="$event.target.style.backgroundColor = locale?.value === 'fr' ? 'var(--bg-border)' : 'transparent'"
        >
          <span class="flex items-center gap-2">
            <Icon name="circle-flags:fr" class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('app.language.french') }}</span>
          </span>
          <Icon v-if="locale?.value === 'fr'" name="heroicons:check" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" aria-hidden="true" />
        </button>
        <button
          @click="chooseLanguage('en')"
          class="w-full text-left px-3 py-2 text-sm transition-all duration-200 flex items-center justify-between"
          :style="{
            color: locale?.value === 'en' ? 'var(--accent-primary)' : 'var(--text-primary)',
            backgroundColor: locale?.value === 'en' ? 'var(--bg-border)' : 'transparent'
          }"
          :aria-selected="locale?.value === 'en'"
          role="menuitem"
          tabindex="0"
          @mouseenter="$event.target.style.backgroundColor = 'var(--bg-border)'"
          @mouseleave="$event.target.style.backgroundColor = locale?.value === 'en' ? 'var(--bg-border)' : 'transparent'"
        >
          <span class="flex items-center gap-2">
            <Icon name="circle-flags:gb" class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('app.language.english') }}</span>
          </span>
          <Icon v-if="locale?.value === 'en'" name="heroicons:check" class="w-4 h-4" :style="{ color: 'var(--accent-primary)' }" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Theme switch -->
    <button
      @click="toggleTheme"
      :class="[
        'rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm border',
        size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
      ]"
      style="background-color: var(--bg-surface); border-color: var(--bg-border);"
      :title="isDark ? t('app.theme.light') : t('app.theme.dark')"
      :aria-label="isDark ? t('app.theme.light') : t('app.theme.dark')"
      role="button"
      tabindex="0"
    >
      <Icon 
        :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
        :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'"
        class="transition-colors duration-200"
        style="color: var(--text-primary);"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  size: { type: String, default: 'md' } // 'sm' | 'md'
})

const { locale, setLocale, t } = useI18n({ useScope: 'global' })

const isDark = ref(true)
const showMenu = ref(false)
const rootEl = ref(null)

const currentFlagIcon = computed(() => (locale?.value === 'fr' ? 'circle-flags:fr' : 'circle-flags:gb'))
const currentLangLabel = computed(() => (locale?.value === 'fr' ? 'FR' : 'EN'))

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('light-theme')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

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
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      isDark.value = false
      document.documentElement.classList.add('light-theme')
    } else {
      isDark.value = true
      document.documentElement.classList.remove('light-theme')
    }
    const handleClick = (e) => {
      if (!rootEl.value) return
      if (showMenu.value && !rootEl.value.contains(e.target)) {
        showMenu.value = false
      }
    }
    document.addEventListener('click', handleClick)
    ;(rootEl).value && ((rootEl).value._off = handleClick)
  }
})

onUnmounted(() => {
  if (process.client && rootEl.value && rootEl.value._off) {
    document.removeEventListener('click', rootEl.value._off)
  }
})
</script>


