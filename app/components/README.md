# Structure des Composants

Cette application utilise une organisation modulaire des composants par feature pour une meilleure maintenabilité et lisibilité.

## 📁 Organisation des Dossiers

### `/home/` - Composants de la page d'accueil
- **HeroSection.vue** - Section principale de la page d'accueil
- **HeroBackground.vue** - Arrière-plan animé du hero
- **HeroLogo.vue** - Logo de l'application
- **HeroTitle.vue** - Titre et sous-titre du hero
- **PainPointsSection.vue** - Section des points de douleur
- **PainPointCard.vue** - Carte individuelle de point de douleur
- **HeroSolution.vue** - Section solution
- **HeroCTA.vue** - Boutons d'appel à l'action
- **HeroScrollIndicator.vue** - Indicateur de scroll
- **FeaturesSection.vue** - Section des fonctionnalités
- **FeaturesGrid.vue** - Grille des fonctionnalités
- **FeatureCard.vue** - Carte individuelle de fonctionnalité
- **FeaturesCTA.vue** - CTA de la section features

### `/dashboard/` - Composants du tableau de bord
- **AppHeader.vue** - En-tête de l'application
- **ProjectSelector.vue** - Sélecteur de projet
- **EmptyState.vue** - État vide quand aucun projet

### `/checklist/` - Composants de la checklist
- **SeoChecklist.vue** - Composant principal de la checklist
- **ItemAccordion.vue** - Accordéon pour les éléments de la checklist

### `/common/` - Composants communs
- **ThemeToggle.vue** - Bouton de changement de thème
- **BackToTop.vue** - Bouton retour en haut
- **SkeletonCard.vue** - Skeleton pour les cartes
- **SkeletonCategory.vue** - Skeleton pour les catégories
- **SkeletonItem.vue** - Skeleton pour les éléments
- **SkeletonProjectSelector.vue** - Skeleton pour le sélecteur de projet

## 🎯 Avantages de cette Structure

1. **Séparation des responsabilités** - Chaque dossier a un rôle spécifique
2. **Maintenabilité** - Facile de trouver et modifier les composants
3. **Réutilisabilité** - Composants communs centralisés
4. **Évolutivité** - Structure extensible pour de nouvelles features
5. **Lisibilité** - Organisation claire et intuitive

## 📝 Conventions

- Les composants sont nommés en PascalCase
- Les dossiers sont nommés en kebab-case
- Chaque composant a une responsabilité unique
- Les imports utilisent des chemins relatifs
- Les composants communs sont dans `/common/`
