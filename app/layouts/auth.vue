<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-3" style="background-color: var(--bg-primary);">
    <div class="fixed top-6 right-6 z-50">
      <LangThemeSwitcher />
    </div>
    <!-- Branding / Intro gauche -->
    <aside class="hidden md:flex md:col-span-1 flex-col justify-between p-10 lg:p-14 border-r" style="border-color: var(--bg-border); background-color: var(--bg-surface);">
      <div>
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <Icon name="fluent-emoji:snake" class="w-8 h-8" />
          <span class="text-xl font-bold group-hover:underline" style="color: var(--accent-primary);">Serpenter</span>
        </NuxtLink>
        <div class="mt-10">
          <h2 class="text-3xl font-bold mb-3" style="color: var(--text-primary);">La checklist pré‑déploiement</h2>
          <p class="text-base" style="color: var(--text-secondary);">Vérifiez SEO, performance, accessibilité, sécurité et plus encore avant mise en ligne.</p>
        </div>
      </div>
      <div>
        <NuxtLink to="/" class="text-sm underline" style="color: var(--text-secondary);">← Retour à l’accueil</NuxtLink>
      </div>
    </aside>

    <!-- Zone formulaire droite -->
    <main class="min-h-screen md:col-span-2 flex items-center justify-center px-6 lg:px-12 py-12">
      <div class="w-full md:max-w-lg lg:max-w-xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import LangThemeSwitcher from '~/components/common/LangThemeSwitcher.vue'
</script>
