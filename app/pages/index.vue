<template>
  <div>
    <HeroSection />
    <FeaturesSection />
  </div>
</template>

<script setup>
import HeroSection from '~/components/home/HeroSection.vue'
import FeaturesSection from '~/components/home/FeaturesSection.vue'

definePageMeta({
  layout: 'default'
})
</script>
