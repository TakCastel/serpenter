<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <FeatureCard
      icon="fluent-emoji:magnifying-glass-tilted-left"
      title="SEO"
      description="Vérifiez que Google (et les autres) comprennent parfaitement votre site."
      :items="['Mots-clés et meta descriptions', 'Structure des titres (H1, H2, H3...)', 'Balises Open Graph', 'Sitemap et robots.txt']"
    />
    <FeatureCard
      icon="fluent-emoji:wheelchair-symbol"
      title="Accessibilité"
      description="Rendez votre site accessible à tous, y compris aux utilisateurs avec des handicaps."
      :items="['Navigation au clavier', 'Contraste des couleurs (WCAG)', 'Textes alternatifs', 'ARIA labels et rôles']"
    />
    <FeatureCard
      icon="fluent-emoji:high-voltage"
      title="Performance"
      description="Optimisez la vitesse de chargement pour une expérience utilisateur parfaite."
      :items="['Optimisation des images', 'Compression et cache', 'Minification du code', 'Lazy loading']"
    />
    <FeatureCard
      icon="fluent-emoji:locked"
      title="Sécurité"
      description="Protégez votre site et vos utilisateurs contre les menaces de sécurité."
      :items="['HTTPS obligatoire', 'Headers de sécurité', 'Protection XSS', 'Validation des formulaires']"
    />
    <FeatureCard
      icon="fluent-emoji:seedling"
      title="Éco-conception"
      description="Réduisez l'impact environnemental de votre site web."
      :items="['Optimisation énergétique', 'Réduction des requêtes', 'Hébergement vert', 'Code optimisé']"
    />
    <FeatureCard
      icon="fluent-emoji:bar-chart"
      title="Analytics"
      description="Mesurez et analysez les performances de votre site."
      :items="['Google Analytics', 'Suivi des conversions', 'Rapports détaillés', 'Monitoring des erreurs']"
    />
  </div>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>
