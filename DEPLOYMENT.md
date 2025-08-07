# 🚀 Guide de Déploiement

## Déploiement avec Fichiers Pré-buildés

Ce projet est configuré pour faire un build local et déployer les fichiers générés sur Vercel, évitant ainsi les problèmes de mémoire lors du build sur Vercel.

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **npm** ou **yarn**
3. **Vercel CLI** installé globalement :
   ```bash
   npm install -g vercel
   ```

## 🔧 Déploiement

### Option 1 : Script automatique (recommandé)

```bash
# Déploiement complet avec build local
npm run deploy
```

### Option 2 : Préparation manuelle puis déploiement

```bash
# 1. Préparer les fichiers pour Vercel
npm run prepare:vercel

# 2. Déployer sur Vercel
vercel --prod
```

### Option 3 : Build local puis déploiement

```bash
# 1. Build local
npm run build

# 2. Préparer pour Vercel
npm run build:vercel

# 3. Déployer
vercel --prod
```

## 📁 Structure des fichiers

- `.output/` : Fichiers générés par Nuxt (local)
- `.vercel/output/` : Fichiers copiés pour Vercel
- `scripts/prepare-vercel.sh` : Script de préparation
- `scripts/deploy.sh` : Script de déploiement automatique

## ⚙️ Configuration

### vercel.json
```json
{
  "buildCommand": "echo 'Using pre-built files'",
  "installCommand": "npm ci",
  "outputDirectory": ".vercel/output"
}
```

**Note :** Vercel n'exécute plus de build, il utilise directement les fichiers pré-buildés.

### package.json
- `prepare:vercel` : Préparation des fichiers pour Vercel
- `build:vercel` : Build + copie vers `.vercel/output`
- `deploy` : Script de déploiement complet

## 🔍 Avantages

1. **Évite les erreurs OOM** : Build local avec plus de mémoire
2. **Plus rapide** : Pas de build sur Vercel
3. **Contrôle total** : Debug local possible
4. **Fiabilité** : Moins de dépendance aux ressources Vercel
5. **Pas de timeout** : Build local sans limite de temps

## 🐛 Dépannage

### Erreur de mémoire locale
```bash
# Augmenter la mémoire Node.js
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

### Erreur de permissions
```bash
# Rendre les scripts exécutables
chmod +x scripts/deploy.sh
chmod +x scripts/prepare-vercel.sh
```

### Vérifier les fichiers générés
```bash
# Vérifier que les fichiers existent
ls -la .vercel/output/
```

## 📝 Notes

- Les fichiers `.vercel/output` sont ignorés par Git
- Le build local utilise 6GB de mémoire par défaut
- Vercel utilise directement les fichiers pré-buildés
- Vérifiez toujours le build local avant de déployer
- Le build sur Vercel est désactivé pour éviter les erreurs OOM
