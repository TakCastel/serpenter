<template>
  <section class="py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--text-primary);">Tarifs</h2>
        <p class="text-lg" style="color: var(--text-secondary);">Commencez gratuitement, évoluez quand vous en avez besoin.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <!-- Freemium -->
        <div class="card p-8 flex flex-col" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <h3 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Gratuit</h3>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">Idéal pour découvrir Serpenter et vérifier l’essentiel.</p>
          <div class="text-4xl font-extrabold mb-6" style="color: var(--text-primary);">0 €</div>
          <ul class="space-y-3 flex-1" style="color: var(--text-secondary);">
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Checklist Web essentielle (SEO, performance, accessibilité, responsive)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Sans checklists spécifiques (WordPress, Shopify, React, …)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Sans export PDF/CSV</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Sans historique d’audit</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Sans IA (contenu statique)</span>
            </li>
          </ul>
          <button @click="goToDashboard" class="mt-6 px-4 py-3 rounded-xl font-semibold transition-all" style="background-color: var(--accent-primary); color: white;">Commencer gratuitement</button>
          <p class="mt-2 text-xs" style="color: var(--text-muted);">Inscription email obligatoire</p>
        </div>

        <!-- Pro (disabled) -->
        <div class="card p-8 flex flex-col border-2 opacity-60 cursor-not-allowed" style="background: linear-gradient(135deg, var(--bg-surface), var(--bg-primary)); border-color: var(--bg-border);">
          <div class="inline-flex items-center gap-2 mb-2">
            <span class="px-2 py-1 text-xs rounded-lg" style="background-color: var(--bg-border); color: var(--text-muted);">Bientôt</span>
          </div>
          <h3 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Pro</h3>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">Pour freelances & petites équipes qui livrent régulièrement.</p>
          <div class="text-4xl font-extrabold mb-1" style="color: var(--text-primary);">9 €<span class="text-base font-medium" style="color: var(--text-secondary);"> /mois</span></div>
          <div class="text-sm mb-6" style="color: var(--text-secondary);">ou 99 €/an</div>
          <ul class="space-y-3 flex-1" style="color: var(--text-secondary);">
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Checklists spécifiques CMS & frameworks (WordPress, Prestashop, Shopify, WooCommerce, Nuxt/Vue/React)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Exports PDF / CSV (avec ou sans marque)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Gestion multi‑projets / audits</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Mises à jour mensuelles</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Guides pas‑à‑pas pour aller vite</span>
            </li>
          </ul>
          <button disabled class="mt-6 px-4 py-3 rounded-xl font-semibold transition-all" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white;">Bientôt disponible</button>
        </div>

        <!-- Premium (disabled) -->
        <div class="card p-8 flex flex-col opacity-60 cursor-not-allowed" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);">
          <h3 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Platine</h3>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">Pour agences & besoins avancés (automatisation, IA, marque blanche).</p>
          <div class="text-4xl font-extrabold mb-1" style="color: var(--text-primary);">29 €<span class="text-base font-medium" style="color: var(--text-secondary);"> /mois</span></div>
          <div class="text-sm mb-6" style="color: var(--text-secondary);">ou 299 €/an</div>
          <ul class="space-y-3 flex-1" style="color: var(--text-secondary);">
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Tout ce qui est inclus dans Pro</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">IA intégrée: analyse auto, plans d’action, snippets</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Intégrations Zapier / n8n → Notion, Trello, Jira</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Checklists avancées (Sécurité, Core Web Vitals, RGAA/WCAG)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle" class="w-5 h-5" :style="{ color: 'var(--accent-primary)' }"/>
              <span class="flex-1">Marque blanche complète</span>
            </li>
          </ul>
          <button disabled class="mt-6 px-4 py-3 rounded-xl font-semibold transition-all" style="background-color: var(--accent-primary); color: white;">Bientôt disponible</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const goToDashboard = () => {
  navigateTo('/dashboard')
}
</script>
