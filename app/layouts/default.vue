<template>
  <div>
    <div class="fixed top-6 right-6 z-50">
      <LangThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <slot />
    <BackToTop />
  </div>
</template>

<script setup>
import BackToTop from '~/components/common/BackToTop.vue'
import LangThemeSwitcher from '~/components/common/LangThemeSwitcher.vue'
</script>
