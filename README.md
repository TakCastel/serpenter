# 🐍 Serpenter - Application de Sécurité Web

Application Nuxt.js moderne pour l'analyse de sécurité et l'audit de sites web avec workflow GitFlow automatisé.

## 🏗️ Architecture

- **Frontend** : Nuxt.js 4 + Vue 3 + Tailwind CSS
- **Backend** : Nuxt Nitro (SSR/SSG)
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Tests** : Cypress E2E
- **Déploiement** : Netlify (build local + prerendering)
- **Workflow** : GitFlow avec gestion automatique des versions

## 🚀 Fonctionnalités

- **🔒 Audit de sécurité** : Analyse des en-têtes, SSL, vulnérabilités
- **📊 Dashboard interactif** : Visualisation des scores et métriques
- **🌐 Multi-langues** : Support FR/EN avec i18n
- **📱 Responsive** : Interface adaptée à tous les écrans
- **🧪 Tests complets** : Suite Cypress E2E automatisée
- **🏷️ Versioning automatique** : Gestion SemVer avec GitFlow

## 📚 Documentation

- **[Guide du Workflow](WORKFLOW_GUIDE.md)** - GitFlow et déploiement Netlify
- **[Documentation Nuxt](https://nuxt.com/docs/getting-started/introduction)** - Guide officiel Nuxt.js

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 🚀 Déploiement

Le projet utilise **Netlify** avec un build local et prerendering :

```bash
# Générer la version statique
npm run generate

# Le déploiement se fait automatiquement via Git
# Voir WORKFLOW_GUIDE.md pour les détails
```

## 🏷️ Gestion automatique des versions

Le projet utilise le **Semantic Versioning** avec gestion automatique :

- **Features** : `1.0.0` → `1.1.0` (MINOR)
- **Hotfixes** : `1.0.0` → `1.0.1` (PATCH)
- **Breaking changes** : `1.0.0` → `2.0.0` (MAJOR)

### Scripts de version

```bash
# ⚡ Automatique (recommandé)
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"

# Manuel
npm run version:auto:feature    # 1.0.0 -> 1.1.0
npm run version:auto:hotfix     # 1.0.0 -> 1.0.1
npm run version:show            # Afficher la version actuelle
```

## 📖 Pour commencer

1. **Lire le [Guide du Workflow](WORKFLOW_GUIDE.md)** - Essentiel pour comprendre le processus de développement
2. **Suivre les conventions GitFlow** pour chaque feature
3. **Tester localement** avant de merger
4. **Utiliser `npm run generate`** pour le build de production
5. **Utiliser les scripts automatisés** pour la gestion des versions

## 🔧 Scripts principaux

```bash
# Développement
npm run dev                    # Serveur de développement
npm run generate              # Build statique pour Netlify

# Tests
npm run test:e2e              # Tests end-to-end Cypress
npm run cypress:open          # Interface Cypress

# Versioning
npm run version:show          # Version actuelle
npm run version:auto:feature  # Incrémenter version feature
npm run version:auto:hotfix   # Incrémenter version hotfix
```

## 🤝 Contribution

### Workflow de développement

1. **Créer une branche feature** depuis `develop`
2. **Développer et tester** localement
3. **Utiliser les scripts automatisés** pour les merges et versions
4. **Suivre les conventions** de commit et GitFlow

### Scripts de développement

```bash
# Créer et développer une feature
git checkout -b feature/nom-feature
# ... développement ...
git commit -m "feat: description"

# Merger avec gestion automatique des versions
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"
```

## 📋 Prérequis

- Node.js 20+
- npm ou yarn
- Git avec GitFlow configuré

---

**💡 Important** : Consultez toujours le [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) avant de commencer une nouvelle feature !
