<template>
  <div>
    <div class="fixed top-6 right-6 z-50">
      <LangThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <slot />
    <BackToTop />

    <!-- Version info en bas à gauche -->
    <div class="fixed bottom-4 left-4 z-40">
      <VersionInfo simple />
    </div>
    
    <!-- Debug i18n -->
    <I18nDebugger />
  </div>
</template>

<script setup>
import BackToTop from '~/components/common/BackToTop.vue'
import LangThemeSwitcher from '~/components/common/LangThemeSwitcher.vue'
import VersionInfo from '~/components/common/VersionInfo.vue'
import I18nDebugger from '~/components/debug/I18nDebugger.vue'
</script>
