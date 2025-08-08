<template>
  <div>
    <NuxtRouteAnnouncer />
    <slot />
    <BackToTop />
  </div>
</template>

<script setup>
import BackToTop from '~/components/common/BackToTop.vue'
</script>
