<template>
  <section class="py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--text-primary);">Tarifs</h2>
        <p class="text-lg" style="color: var(--text-secondary);">Commencez gratuitement, évoluez quand vous en avez besoin.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <!-- Freemium -->
        <div class="relative group">
          <div class="absolute -inset-[1px] rounded-2xl opacity-30 group-hover:opacity-50 transition-all duration-300" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); filter: blur(10px);"></div>
          <div class="relative card rounded-2xl p-8 flex flex-col shadow-xl transition-transform duration-300 group-hover:-translate-y-1" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border); box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
            <h3 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Gratuit</h3>
            <p class="text-sm mb-6" style="color: var(--text-secondary);">Idéal pour découvrir Serpenter et vérifier l’essentiel.</p>
            <div class="text-3xl font-extrabold mb-6" style="color: var(--text-primary);">Gratuit</div>
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
            <button @click="goToDashboard" class="mt-6 px-5 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:brightness-110">Commencer gratuitement</button>
            <p class="mt-2 text-xs" style="color: var(--text-muted);">Inscription email obligatoire</p>
          </div>
        </div>

        <!-- Pro (disabled) -->
        <div class="relative group cursor-not-allowed">
          <div class="absolute -inset-[1px] rounded-2xl opacity-20" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); filter: blur(10px);"></div>
          <div class="relative card rounded-2xl p-8 flex flex-col shadow-xl opacity-60" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border); box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
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
            <button disabled class="mt-6 px-5 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white">Bientôt disponible</button>
          </div>
        </div>

        <!-- Premium (disabled) -->
        <div class="relative group cursor-not-allowed">
          <div class="absolute -inset-[1px] rounded-2xl opacity-20" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); filter: blur(10px);"></div>
          <div class="relative card rounded-2xl p-8 flex flex-col shadow-xl opacity-60" style="background-color: var(--bg-surface); border: 1px solid var(--bg-border); box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
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
            <button disabled class="mt-6 px-5 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white">Bientôt disponible</button>
          </div>
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
