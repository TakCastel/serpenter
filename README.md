# 🐍 Serpenter - Application de Sécurité Web

[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.0.3-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-6.14.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Cypress](https://img.shields.io/badge/Cypress-14.5.4-17202C?style=for-the-badge&logo=cypress)](https://www.cypress.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

Application Nuxt.js moderne pour l'analyse de sécurité et l'audit de sites web avec workflow GitFlow automatisé et gestion intelligente des versions.

## 📋 Table des matières

- [🚀 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [📱 Captures d'écran](#-captures-décran)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [📚 Documentation](#-documentation)
- [🔧 Scripts et commandes](#-scripts-et-commandes)
- [🏷️ Gestion des versions](#️-gestion-des-versions)
- [🤝 Contribution](#-contribution)
- [🧪 Tests](#-tests)
- [🚀 Déploiement](#-déploiement)
- [📊 Structure du projet](#-structure-du-projet)
- [🔒 Sécurité](#-sécurité)
- [📈 Performance](#-performance)
- [🌐 Internationalisation](#-internationalisation)
- [📋 Prérequis](#-prérequis)
- [❓ FAQ](#-faq)
- [📄 Licence](#-licence)

## 🚀 Fonctionnalités

### 🔒 Audit de sécurité avancé
- **Analyse des en-têtes HTTP** : Vérification des en-têtes de sécurité (CSP, HSTS, X-Frame-Options)
- **Test SSL/TLS** : Validation des certificats et configuration de sécurité
- **Scan de vulnérabilités** : Détection automatique des failles de sécurité connues
- **Lighthouse Security** : Intégration avec Google Lighthouse pour l'audit complet
- **Rapports détaillés** : Génération de rapports PDF et export des données

### 📊 Dashboard interactif
- **Vue d'ensemble en temps réel** : Monitoring des scores de sécurité
- **Graphiques interactifs** : Visualisation des métriques avec Chart.js
- **Comparaison de projets** : Analyse comparative entre différents sites
- **Historique des audits** : Suivi de l'évolution de la sécurité
- **Alertes intelligentes** : Notifications pour les problèmes critiques

### 🌐 Multi-langues et accessibilité
- **Support FR/EN** : Interface complètement traduite avec i18n
- **Mode sombre/clair** : Thèmes adaptatifs avec persistance
- **Responsive design** : Optimisé pour tous les appareils
- **Accessibilité WCAG** : Conformité aux standards d'accessibilité

### 🧪 Tests et qualité
- **Suite Cypress E2E** : Tests automatisés complets
- **Tests de régression** : Validation continue des fonctionnalités
- **Tests de performance** : Monitoring des métriques de performance
- **Tests de sécurité** : Validation des mesures de sécurité

## 🏗️ Architecture

### Frontend
- **Framework** : Nuxt.js 4 avec Vue 3 Composition API
- **Styling** : Tailwind CSS avec système de thèmes personnalisé
- **State Management** : Pinia avec persistance automatique
- **Routing** : Vue Router avec middleware d'authentification
- **Icons** : Nuxt Icon avec collections Fluent et Heroicons

### Backend
- **Runtime** : Nuxt Nitro (SSR/SSG hybride)
- **API Routes** : Endpoints RESTful pour les services externes
- **Middleware** : Authentification, validation, rate limiting
- **Prerendering** : Génération statique pour Netlify

### Base de données
- **Cloud Database** : Firebase Firestore
- **Authentification** : Firebase Auth avec gestion des rôles
- **Storage** : Firebase Storage pour les fichiers
- **Real-time** : Synchronisation en temps réel des données

### Infrastructure
- **Hébergement** : Netlify avec build local
- **CDN** : Distribution globale avec Netlify Edge
- **Functions** : Serverless functions pour les tâches lourdes
- **Monitoring** : Logs et métriques intégrés

## 📱 Captures d'écran

> *Note : Les captures d'écran seront ajoutées ici pour montrer l'interface utilisateur*

### Dashboard principal
- Vue d'ensemble des projets
- Scores de sécurité en temps réel
- Graphiques de tendances

### Interface d'audit
- Formulaires d'analyse
- Résultats détaillés
- Recommandations d'amélioration

## 🚀 Démarrage rapide

### 1. Installation

```bash
# Cloner le repository
git clone https://github.com/TakCastel/serpenter.git
cd serpenter

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Firebase
```

### 2. Configuration Firebase

```bash
# Créer un projet Firebase
# Activer Firestore, Auth et Storage
# Copier les clés dans .env.local

NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... autres variables Firebase
```

### 3. Lancement

```bash
# Mode développement
npm run dev

# Build de production
npm run generate

# Tests E2E
npm run test:e2e
```

## 📚 Documentation

### Guides principaux
- **[Guide du Workflow](WORKFLOW_GUIDE.md)** - GitFlow et déploiement Netlify
- **[Documentation Nuxt](https://nuxt.com/docs/getting-started/introduction)** - Guide officiel Nuxt.js
- **[Guide Cypress](cypress/README.md)** - Tests end-to-end

### Documentation technique
- **[Architecture](docs/ARCHITECTURE.md)** - Détails techniques et décisions
- **[API Reference](docs/API.md)** - Documentation des endpoints
- **[Database Schema](docs/DATABASE.md)** - Structure des données Firestore

## 🔧 Scripts et commandes

### Développement
```bash
npm run dev                    # Serveur de développement (localhost:3000)
npm run build                  # Build de production
npm run generate              # Build statique pour Netlify
npm run preview               # Prévisualiser le build de production
```

### Tests
```bash
npm run test:e2e              # Tests end-to-end Cypress
npm run test:e2e:headless     # Tests Cypress en mode headless
npm run test:e2e:open         # Interface Cypress interactive
npm run test:smoke            # Tests de fumée rapides
npm run test:auth             # Tests d'authentification
npm run test:projects         # Tests des projets
npm run test:checklist        # Tests des checklists
npm run test:ui               # Tests de l'interface
```

### Build et déploiement
```bash
npm run build:netlify         # Build optimisé pour Netlify
npm run deploy:netlify        # Déploiement manuel sur Netlify
npm run publish:netlify       # Build + déploiement complet
```

### Gestion des versions
```bash
npm run version:show          # Afficher la version actuelle
npm run version:auto:feature  # Incrémenter version feature (1.0.0 → 1.1.0)
npm run version:auto:hotfix   # Incrémenter version hotfix (1.0.0 → 1.0.1)
npm run version:auto:major    # Incrémenter version majeure (1.0.0 → 2.0.0)
npm run version:patch         # Incrémenter patch manuellement
npm run version:minor         # Incrémenter minor manuellement
npm run version:major         # Incrémenter major manuellement
```

## 🏷️ Gestion des versions

### Principe de versioning
Le projet utilise le **Semantic Versioning** (SemVer) avec gestion automatique :

- **`MAJOR`** (2.0.0) : Breaking changes, changements incompatibles
- **`MINOR`** (1.1.0) : Nouvelles fonctionnalités, compatibles
- **`PATCH`** (1.0.1) : Corrections de bugs, compatibles

### Règles automatiques
- **Feature → develop** : `MINOR` (1.0.0 → 1.1.0)
- **Hotfix → main** : `PATCH` (1.0.0 → 1.0.1)  
- **Develop → main** : `MINOR` (1.1.0 → 1.2.0)
- **Breaking change** : `MAJOR` (1.0.0 → 2.0.0)

### Scripts automatisés
```bash
# ⚡ Automatique (recommandé)
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"
.\scripts\merge-with-version.ps1 -MergeType "hotfix" -BranchName "hotfix/nom-hotfix"
.\scripts\merge-with-version.ps1 -MergeType "develop" -BranchName "develop" -PushTag

# Script de version intelligent
npm run version:auto          # Détection automatique du type
```

### Tags Git automatiques
Chaque version est automatiquement taguée :
- `v1.0.0`, `v1.0.1`, `v1.1.0`, etc.
- Tags poussés automatiquement avec `-PushTag`
- Historique complet des releases dans Git
- Messages de commit standardisés

## 🤝 Contribution

### Workflow de développement

#### 1. Préparation
```bash
# Mettre à jour develop
git checkout develop
git pull origin develop

# Créer la branche feature
git checkout -b feature/nom-de-votre-feature
```

#### 2. Développement
```bash
# Faire vos modifications
# Tester localement
npm run dev
npm run test:e2e

# Commiter régulièrement
git add .
git commit -m "feat(scope): description de la modification"
```

#### 3. Merge avec gestion automatique des versions
```bash
# Merger vers develop
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"

# Merger vers main
.\scripts\merge-with-version.ps1 -MergeType "develop" -BranchName "develop" -PushTag
```

### Conventions de commit
```bash
# Format
type(scope): description courte

# Types
feat:     nouvelle fonctionnalité
fix:      correction de bug
docs:     documentation
style:    formatage, espaces, etc.
refactor: refactorisation
test:     ajout/modification de tests
chore:    tâches de maintenance

# Exemples
git commit -m "feat(auth): ajout de la validation 2FA"
git commit -m "fix(dashboard): correction du calcul des scores"
git commit -m "docs: mise à jour du guide utilisateur"
git commit -m "build: mise à jour des artefacts Netlify"
```

### Checklist de contribution
- [ ] Code conforme aux standards ESLint
- [ ] Tests passent (`npm run test:e2e`)
- [ ] Build de production fonctionne (`npm run generate`)
- [ ] Documentation mise à jour
- [ ] Commit message suit les conventions
- [ ] Branche feature supprimée après merge

## 🧪 Tests

### Stratégie de test
- **Tests unitaires** : Composants Vue et utilitaires
- **Tests d'intégration** : API et services
- **Tests E2E** : Scénarios utilisateur complets avec Cypress
- **Tests de performance** : Lighthouse et métriques Web Vitals

### Structure des tests Cypress
```
cypress/
├── e2e/                    # Tests end-to-end
│   ├── auth.cy.js         # Tests d'authentification
│   ├── dashboard.cy.js    # Tests du dashboard
│   ├── projects.cy.js     # Tests des projets
│   └── smoke.cy.js        # Tests de fumée
├── fixtures/               # Données de test
├── support/                # Commandes et configuration
└── scripts/                # Scripts utilitaires
```

### Exécution des tests
```bash
# Tests interactifs
npm run cypress:open

# Tests en CI
npm run test:e2e:headless

# Tests spécifiques
npm run test:smoke          # Tests de fumée
npm run test:auth           # Tests d'authentification
npm run test:projects       # Tests des projets
```

## 🚀 Déploiement

### Configuration Netlify
Le projet utilise **Netlify avec build local** pour un contrôle total :

- **Build local** : `npm run generate` crée une version statique
- **Déploiement** : Fichiers copiés dans `.netlify/publish/`
- **SSR** : Prerendering complet pour des performances optimales
- **Versioning** : Chaque déploiement correspond à un commit Git

### Processus de déploiement
```bash
# 1. Générer la version statique
npm run generate

# 2. Les fichiers sont automatiquement copiés vers .netlify/publish/

# 3. Commiter et pousser (déclenche le déploiement)
git add .
git commit -m "build: mise à jour des artefacts de déploiement"
git push origin main
```

### Avantages de cette approche
✅ **SSR fonctionnel** : Prerendering complet des pages  
✅ **Performance** : Fichiers statiques servis rapidement  
✅ **Contrôle** : Build local, pas de surprise sur Netlify  
✅ **Versioning** : Chaque déploiement correspond à un commit Git  
✅ **Rollback** : Retour facile à une version précédente  

## 📊 Structure du projet

```
serpenter/
├── app/                     # Code source principal
│   ├── components/          # Composants Vue réutilisables
│   ├── composables/         # Logique métier partagée
│   ├── layouts/             # Layouts de l'application
│   ├── middleware/          # Middleware d'authentification
│   ├── pages/               # Pages et routing
│   ├── plugins/             # Plugins Nuxt
│   ├── stores/              # Stores Pinia
│   └── utils/               # Utilitaires et helpers
├── cypress/                 # Tests end-to-end
├── docs/                    # Documentation technique
├── netlify/                 # Configuration Netlify
├── public/                  # Assets statiques
├── scripts/                 # Scripts de build et déploiement
├── server/                  # API routes et middleware
├── .netlify/                # Artefacts de déploiement
├── nuxt.config.ts           # Configuration Nuxt
├── netlify.toml             # Configuration Netlify
└── package.json             # Dépendances et scripts
```

### Composants principaux
- **Dashboard** : Interface principale avec métriques
- **SecurityScanner** : Scanner de sécurité automatisé
- **ProjectSelector** : Gestion des projets
- **ChecklistManager** : Gestion des checklists de sécurité
- **AuthSystem** : Système d'authentification complet

## 🔒 Sécurité

### Mesures de sécurité implémentées
- **Authentification Firebase** : Gestion sécurisée des utilisateurs
- **Validation des entrées** : Protection contre les injections
- **En-têtes de sécurité** : CSP, HSTS, X-Frame-Options
- **Rate limiting** : Protection contre les attaques par déni de service
- **HTTPS obligatoire** : Chiffrement des communications
- **Validation des permissions** : Contrôle d'accès granulaire

### Bonnes pratiques
- Variables d'environnement pour les secrets
- Validation côté client et serveur
- Sanitisation des données utilisateur
- Logs de sécurité pour audit
- Mises à jour régulières des dépendances

## 📈 Performance

### Optimisations implémentées
- **Code splitting** : Chargement à la demande des composants
- **Lazy loading** : Images et composants chargés au besoin
- **Prerendering** : Pages générées statiquement
- **CDN** : Distribution globale avec Netlify Edge
- **Compression** : Gzip et Brotli automatiques
- **Cache** : Stratégies de cache optimisées

### Métriques de performance
- **Lighthouse Score** : >90 sur tous les critères
- **First Contentful Paint** : <1.5s
- **Largest Contentful Paint** : <2.5s
- **Cumulative Layout Shift** : <0.1
- **First Input Delay** : <100ms

## 🌐 Internationalisation

### Support multi-langues
- **Français** : Langue par défaut
- **Anglais** : Support complet
- **i18n** : Gestion automatique des traductions
- **Détection automatique** : Basée sur les préférences navigateur
- **Persistance** : Choix de langue sauvegardé

### Structure des traductions
```
i18n/
├── fr.json                  # Traductions françaises
├── en.json                  # Traductions anglaises
└── locales/                 # Fichiers de traduction
```

## 📋 Prérequis

### Système
- **OS** : Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js** : Version 20.19.4 ou supérieure
- **npm** : Version 9+ ou yarn 1.22+
- **Git** : Version 2.30+ avec GitFlow configuré

### Navigateurs supportés
- **Chrome** : Version 90+
- **Firefox** : Version 88+
- **Safari** : Version 14+
- **Edge** : Version 90+

### Outils de développement
- **VS Code** : Éditeur recommandé
- **Cypress** : Tests E2E
- **Lighthouse** : Audit de performance
- **DevTools** : Outils de développement navigateur

## ❓ FAQ

### Questions générales

**Q: Comment démarrer rapidement le projet ?**
R: Suivez le guide de démarrage rapide ci-dessus. Assurez-vous d'avoir Node.js 20+ et configurez Firebase.

**Q: Comment gérer les versions automatiquement ?**
R: Utilisez les scripts automatisés : `.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom"`

**Q: Comment déployer sur Netlify ?**
R: Le déploiement est automatique via Git. Poussez sur `main` et Netlify déploiera automatiquement.

**Q: Comment ajouter une nouvelle fonctionnalité ?**
R: Créez une branche feature depuis `develop`, développez, testez, puis utilisez le script de merge automatisé.

### Questions techniques

**Q: Comment configurer Firebase ?**
R: Créez un projet Firebase, activez Firestore/Auth/Storage, et copiez les clés dans `.env.local`.

**Q: Comment exécuter les tests ?**
R: `npm run test:e2e` pour tous les tests, `npm run cypress:open` pour l'interface interactive.

**Q: Comment optimiser les performances ?**
R: Utilisez `npm run generate` pour le build de production, et surveillez les métriques Lighthouse.

**Q: Comment gérer les traductions ?**
R: Modifiez les fichiers dans `i18n/locales/` et utilisez la composable `useI18n()`.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **Nuxt.js** : Framework Vue.js moderne
- **Tailwind CSS** : Framework CSS utilitaire
- **Firebase** : Backend-as-a-Service
- **Cypress** : Tests end-to-end
- **Netlify** : Hébergement et déploiement

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/TakCastel/serpenter/issues)
- **Discussions** : [GitHub Discussions](https://github.com/TakCastel/serpenter/discussions)
- **Documentation** : [Guide du Workflow](WORKFLOW_GUIDE.md)

---

**💡 Important** : Consultez toujours le [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) avant de commencer une nouvelle feature !

**⭐ N'oubliez pas de mettre une étoile au projet si vous l'aimez !**
