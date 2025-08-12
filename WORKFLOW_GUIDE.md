# 🚀 Guide du Workflow de Développement - Serpenter

## 📋 Vue d'ensemble

Ce guide documente le workflow de développement utilisé pour le projet Serpenter, incluant GitFlow, le build local et le déploiement Netlify.

## 🔄 GitFlow - Structure des branches

```
main (production)
├── develop (intégration)
├── feature/nom-feature (développement)
├── hotfix/nom-hotfix (corrections urgentes)
└── release/nom-release (préparation release)
```

### 📍 Branches principales

- **`main`** : Code en production, toujours stable
- **`develop`** : Branche d'intégration, contient les features validées
- **`feature/*`** : Développement de nouvelles fonctionnalités
- **`hotfix/*`** : Corrections urgentes de bugs en production
- **`release/*`** : Préparation des releases (optionnel)

## 🛠️ Workflow de développement d'une feature

### 1. Création de la feature

```bash
# Basculer sur develop et la mettre à jour
git checkout develop
git pull origin develop

# Créer et basculer sur la nouvelle branche feature
git checkout -b feature/nom-de-votre-feature
```

### 2. Développement

```bash
# Faire vos modifications...
# Tester localement...

# Commiter régulièrement
git add .
git commit -m "feat: description de la modification"

# Pousser la branche feature
git push origin feature/nom-de-votre-feature
```

### 3. Merge vers develop (avec gestion automatique des versions)

```bash
# ⚡ NOUVEAU : Utiliser le script automatisé
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-de-votre-feature"

# Ou manuellement :
# Basculer sur develop
git checkout develop
git pull origin develop

# Mettre à jour la version (minor: 1.0.0 -> 1.1.0)
npm run version:auto:feature

# Merger la feature
git merge feature/nom-de-votre-feature

# Pousser develop et le tag
git push origin develop
git push origin v$(npm run version:show)
```

### 4. Merge vers main et déploiement

```bash
# ⚡ NOUVEAU : Utiliser le script automatisé
.\scripts\merge-with-version.ps1 -MergeType "develop" -BranchName "develop" -PushTag

# Ou manuellement :
# Basculer sur main
git checkout main
git pull origin main

# Merger develop
git merge develop

# Pousser main (déclenche le déploiement Netlify)
git push origin main
```

### 5. Nettoyage

```bash
# Supprimer la branche feature locale
git branch -d feature/nom-de-votre-feature

# Supprimer la branche feature distante (optionnel)
git push origin --delete feature/nom-de-votre-feature
```

## 🏗️ Build et déploiement Netlify

### Configuration actuelle

Le projet est configuré pour utiliser **Netlify avec build local** :

- **`nuxt.config.ts`** : `preset: 'netlify-static'` avec prerendering activé
- **`netlify.toml`** : Pointe vers `.netlify/publish/`
- **Build local** : `nuxt generate` crée une version statique complète

### Processus de build

```bash
# 1. Générer la version statique
npm run generate

# 2. Copier les fichiers vers le dossier Netlify
# (automatique via le script de build)

# 3. Commiter et pousser
git add .
git commit -m "build: mise à jour des artefacts de déploiement"
git push origin main
```

### Pourquoi cette approche ?

✅ **SSR fonctionnel** : Prerendering complet des pages  
✅ **Performance** : Fichiers statiques servis rapidement  
✅ **Contrôle** : Build local, pas de surprise sur Netlify  
✅ **Versioning** : Chaque déploiement correspond à un commit Git  

## 🚨 Workflow pour les hotfixes

### 1. Création du hotfix

```bash
# Basculer sur main
git checkout main
git pull origin main

# Créer le hotfix
git checkout -b hotfix/nom-du-hotfix
```

### 2. Correction et déploiement

```bash
# Faire la correction...
# Tester...

# Commiter
git commit -m "fix: description de la correction"

# ⚡ NOUVEAU : Utiliser le script automatisé
.\scripts\merge-with-version.ps1 -MergeType "hotfix" -BranchName "hotfix/nom-du-hotfix" -PushTag

# Ou manuellement :
# Merger vers main avec mise à jour de version (patch: 1.0.0 -> 1.0.1)
npm run version:auto:hotfix
git checkout main
git merge hotfix/nom-du-hotfix
git push origin main
git push origin v$(npm run version:show)

# Merger vers develop
git checkout develop
git merge hotfix/nom-du-hotfix
git push origin develop
```

### 3. Nettoyage

```bash
# Supprimer le hotfix
git branch -d hotfix/nom-du-hotfix
```

## 📝 Conventions de commit

### Format des messages

```
type(scope): description courte

type: feat, fix, docs, style, refactor, test, chore
scope: composant ou module concerné (optionnel)
```

## 🏷️ Gestion automatique des versions

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

### Scripts de version

```bash
# ⚡ Automatique (recommandé)
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"

# Manuel
npm run version:auto:feature    # 1.0.0 -> 1.1.0
npm run version:auto:hotfix     # 1.0.0 -> 1.0.1
npm run version:auto:major      # 1.0.0 -> 2.0.0
```

### Tags Git automatiques

Chaque version est automatiquement taguée :
- `v1.0.0`, `v1.0.1`, `v1.1.0`, etc.
- Tags poussés automatiquement avec `-PushTag`
- Historique complet des releases dans Git

### Exemples

```bash
git commit -m "feat(auth): ajout de la validation 2FA"
git commit -m "fix(dashboard): correction du calcul des scores"
git commit -m "docs: mise à jour du guide utilisateur"
git commit -m "build: mise à jour des artefacts Netlify"
```

## 🔧 Scripts utiles

### Build pour Netlify

```bash
# Générer la version statique
npm run generate

# Ou utiliser le script complet
npm run build:netlify
```

### Gestion automatique des versions

```bash
# ⚡ NOUVEAU : Script automatisé pour les merges
.\scripts\merge-with-version.ps1 -MergeType "feature" -BranchName "feature/nom-feature"
.\scripts\merge-with-version.ps1 -MergeType "hotfix" -BranchName "hotfix/nom-hotfix"
.\scripts\merge-with-version.ps1 -MergeType "develop" -BranchName "develop" -PushTag

# Scripts de version manuels
npm run version:auto:feature    # 1.0.0 -> 1.1.0
npm run version:auto:hotfix     # 1.0.0 -> 1.0.1
npm run version:auto:major      # 1.0.0 -> 2.0.0
npm run version:show            # Afficher la version actuelle
```

### Vérification de l'état

```bash
# Voir les branches
git branch -a

# Voir l'état des branches
git status

# Voir l'historique des commits
git log --oneline --graph

# Voir les tags
git tag -l
```

## ⚠️ Points d'attention

### ⚡ Avant chaque merge

1. **Tester localement** : `npm run dev` et `npm run generate`
2. **Vérifier les conflits** : `git status` et `git diff`
3. **S'assurer que develop est à jour** : `git pull origin develop`

### 🚫 À éviter

- ❌ Merger directement sur `main` sans passer par `develop`
- ❌ Pousser du code non testé
- ❌ Oublier de faire `git pull` avant de merger
- ❌ Laisser des branches feature orphelines

### ✅ Bonnes pratiques

- ✅ Toujours partir de `develop` pour les features
- ✅ Tester avant de merger
- ✅ Commiter régulièrement avec des messages clairs
- ✅ Nettoyer les branches après merge
- ✅ Vérifier que le build fonctionne avant de pousser

## 🎯 Checklist pour chaque feature

- [ ] Créer la branche feature depuis `develop`
- [ ] Développer et tester localement
- [ ] Commiter régulièrement avec des messages clairs
- [ ] **Merger vers `develop` avec gestion automatique des versions** ⚡
- [ ] **Merger vers `main` avec gestion automatique des versions** ⚡
- [ ] Nettoyer les branches
- [ ] Vérifier le déploiement sur Netlify
- [ ] **Vérifier que le tag de version a été créé et poussé** 🏷️

## 🎯 Checklist pour chaque hotfix

- [ ] Créer la branche hotfix depuis `main`
- [ ] Corriger le bug et tester
- [ ] Commiter avec le préfixe `fix:`
- [ ] **Merger vers `main` avec gestion automatique des versions** ⚡
- [ ] **Merger vers `develop`** 
- [ ] Nettoyer la branche hotfix
- [ ] **Vérifier que le tag de version a été créé et poussé** 🏷️

## 🔗 Ressources utiles

- **GitFlow** : [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)
- **Conventional Commits** : [https://www.conventionalcommits.org/](https://www.conventionalcommits.org/)
- **Netlify Docs** : [https://docs.netlify.com/](https://docs.netlify.com/)

---

**💡 Rappel** : Ce guide doit être lu et suivi pour chaque nouvelle feature ou modification du projet !
