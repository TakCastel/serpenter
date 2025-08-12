# Guide d'ajout des attributs data-cy

Ce fichier liste tous les attributs `data-cy` à ajouter dans vos composants Vue pour que les tests Cypress fonctionnent.

## 🔐 Authentification (login.vue, register.vue)

```vue
<!-- Champs de formulaire -->
<input data-cy="email-input" type="email" v-model="email" />
<input data-cy="password-input" type="password" v-model="password" />
<button data-cy="toggle-password" @click="showPassword = !showPassword">
<button data-cy="login-button" @click="onSubmit">Connexion</button>
<button data-cy="register-button" @click="onSubmit">Inscription</button>
<button data-cy="google-login-button" @click="onGoogle">Google</button>

<!-- Messages d'erreur -->
<p data-cy="error-message" v-if="error">{{ error }}</p>
```

## 📁 Projets (EmptyState.vue, ProjectSelector.vue)

```vue
<!-- EmptyState.vue -->
<div data-cy="empty-state">
  <h1 data-cy="empty-state-title">Aucun projet</h1>
  <input data-cy="project-name-input" v-model="projectName" />
  <textarea data-cy="project-description-input" v-model="projectDescription" />
  <button data-cy="checklist-type-web-prelaunch">Web Pre-launch</button>
  <button data-cy="checklist-type-appstore-preflight">App Store</button>
  <button data-cy="checklist-type-security-checker">Security</button>
  <button data-cy="create-project-button" @click="createProject">Créer</button>
</div>

<!-- ProjectSelector.vue -->
<div data-cy="project-selector" @click="toggleDropdown">
<div data-cy="project-dropdown" v-if="isDropdownOpen">
  <button data-cy="project-option" v-for="project in projects">
    {{ project.name }}
  </button>
</div>
<div data-cy="project-loading" v-if="isLoading">Chargement...</div>
```

## ✅ Checklist (SeoChecklist.vue, ItemAccordion.vue)

```vue
<!-- SeoChecklist.vue -->
<div data-cy="checklist-category" v-for="category in categories">
  <div :data-cy="`category-${category.id}`">
    <div data-cy="checklist-item" v-for="item in category.items">
      <input data-cy="checklist-checkbox" type="checkbox" />
    </div>
  </div>
</div>

<!-- Progression -->
<div data-cy="progress-percentage">{{ progressPercentage }}%</div>
<div data-cy="progress-bar" :style="{ width: progressPercentage + '%' }"></div>

<!-- Réinitialisation -->
<button data-cy="reset-progress-button" @click="resetProgress">Réinitialiser</button>

<!-- ItemAccordion.vue -->
<div data-cy="accordion-header" @click="toggleAccordion">
<div data-cy="accordion-content" v-if="isExpanded">
```

## 🎨 Interface (ThemeToggle.vue, AppHeader.vue, Sidebar.vue)

```vue
<!-- ThemeToggle.vue -->
<button data-cy="theme-toggle" @click="toggleTheme">
  <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" />
</button>

<!-- AppHeader.vue -->
<header data-cy="app-header" class="fixed">
  <div data-cy="header-progress">{{ progress }}%</div>
  <div data-cy="user-menu" @click="toggleUserMenu">
    <button data-cy="logout-button" @click="logout">Déconnexion</button>
  </div>
</header>

<!-- Sidebar.vue -->
<aside data-cy="sidebar" :class="{ collapsed: isCollapsed }">
  <button data-cy="sidebar-toggle" @click="toggleSidebar">
  <nav data-cy="category-navigation">
    <button data-cy="category-nav-seo" @click="setActiveCategory('seo')">
    <button data-cy="category-nav-performance" @click="setActiveCategory('performance')">
  </nav>
</aside>

<!-- Menu mobile -->
<button data-cy="mobile-menu-toggle" @click="toggleMobileMenu">
<div data-cy="mobile-menu" v-if="isMobileMenuOpen">
  <button data-cy="mobile-menu-close" @click="closeMobileMenu">
  <button data-cy="mobile-logout-button" @click="logout">
</div>
```

## 🏠 Pages publiques (index.vue, help.vue)

```vue
<!-- Page d'accueil -->
<div data-cy="default-layout">
  <section data-cy="hero-section">
    <h1 data-cy="hero-title">La checklist pré-déploiement</h1>
    <p data-cy="hero-description">Description...</p>
    <button data-cy="hero-cta-primary">Commencer</button>
    <button data-cy="hero-cta-secondary">En savoir plus</button>
  </section>
  
  <section data-cy="features-section">
    <div data-cy="feature-item" v-for="feature in features">
      <div data-cy="feature-icon">
      <h3 data-cy="feature-title">{{ feature.title }}</h3>
      <p data-cy="feature-description">{{ feature.description }}</p>
    </div>
  </section>
  
  <section data-cy="pricing-section">
    <div data-cy="pricing-plan" v-for="plan in plans">
      <h3 data-cy="plan-name">{{ plan.name }}</h3>
      <div data-cy="plan-price">{{ plan.price }}</div>
      <ul data-cy="plan-features">
        <li v-for="feature in plan.features">{{ feature }}</li>
      </ul>
    </div>
  </section>
</div>

<!-- Navigation -->
<nav>
  <a data-cy="nav-login" href="/login">Connexion</a>
  <a data-cy="nav-register" href="/register">Inscription</a>
  <a data-cy="nav-help" href="/help">Aide</a>
</nav>

<!-- Logo -->
<div data-cy="app-logo">
  <span data-cy="app-name">Serpenter</span>
</div>
```

## 🌐 Internationalisation

```vue
<!-- Sélecteur de langue -->
<div data-cy="lang-selector" @click="toggleLangMenu">
  <div data-cy="lang-dropdown" v-if="isLangMenuOpen">
    <button data-cy="lang-option-fr" @click="setLocale('fr')">Français</button>
    <button data-cy="lang-option-en" @click="setLocale('en')">English</button>
  </div>
</div>
```

## 🔄 Modals et overlays

```vue
<!-- Modal de réinitialisation -->
<div data-cy="reset-modal" v-if="showResetModal">
  <button data-cy="confirm-reset-button" @click="confirmReset">Confirmer</button>
  <button data-cy="cancel-reset-button" @click="cancelReset">Annuler</button>
</div>

<!-- Loading states -->
<div data-cy="loading" v-if="isLoading">Chargement...</div>
<div data-cy="skeleton-loader" v-if="isLoading">
```

## 🎯 Layouts

```vue
<!-- layouts/auth.vue -->
<div data-cy="auth-layout">

<!-- layouts/default.vue -->
<div data-cy="default-layout">

<!-- layouts/dashboard.vue -->
<div data-cy="dashboard-layout">
  <div data-cy="main-content">
    <div data-cy="dashboard-grid" class="grid grid-cols-1 lg:grid-cols-3">
```

## 🔍 Outils intégrés

```vue
<!-- Lighthouse -->
<div data-cy="lighthouse-accordion">
  <button data-cy="lighthouse-run-button">Lancer l'audit</button>
  <div data-cy="lighthouse-results">
</div>

<!-- Security Scanner -->
<div data-cy="security-scanner-accordion">
  <button data-cy="security-scan-button">Scanner</button>
  <div data-cy="security-results">
</div>

<!-- App Preflight -->
<div data-cy="app-preflight-accordion">
  <button data-cy="app-preflight-check-button">Vérifier</button>
  <div data-cy="app-preflight-results">
</div>
```

## 📱 Responsive et mobile

```vue
<!-- Navigation mobile/desktop -->
<nav data-cy="desktop-nav" class="hidden md:block">
<nav data-cy="mobile-nav" class="md:hidden">

<!-- Éléments adaptatifs -->
<div data-cy="responsive-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## ✅ Checklist complète des attributs

Copiez cette checklist pour vérifier que tous les attributs sont ajoutés :

- [ ] `data-cy="email-input"` dans login.vue et register.vue
- [ ] `data-cy="password-input"` dans login.vue et register.vue
- [ ] `data-cy="login-button"` dans login.vue
- [ ] `data-cy="register-button"` dans register.vue
- [ ] `data-cy="user-menu"` dans AppHeader.vue
- [ ] `data-cy="logout-button"` dans le menu utilisateur
- [ ] `data-cy="project-selector"` dans ProjectSelector.vue
- [ ] `data-cy="empty-state"` dans EmptyState.vue
- [ ] `data-cy="create-project-button"` dans EmptyState.vue
- [ ] `data-cy="theme-toggle"` dans ThemeToggle.vue
- [ ] `data-cy="checklist-checkbox"` dans les éléments de checklist
- [ ] `data-cy="accordion-header"` dans ItemAccordion.vue
- [ ] `data-cy="progress-percentage"` dans l'affichage de progression
- [ ] `data-cy="sidebar"` dans Sidebar.vue
- [ ] `data-cy="mobile-menu-toggle"` dans la navigation mobile

Une fois ces attributs ajoutés, les tests Cypress pourront interagir avec votre application !
