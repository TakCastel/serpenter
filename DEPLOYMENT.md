# 🚀 Guide de Déploiement

## Déploiement Local vers Vercel

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

### Option 2 : Déploiement manuel

```bash
# 1. Installation des dépendances
npm ci

# 2. Build local
npm run build

# 3. Préparation pour Vercel
npm run build:vercel

# 4. Déploiement
vercel --prod
```

## 📁 Structure des fichiers

- `.output/` : Fichiers générés par Nuxt (local)
- `.vercel/output/` : Fichiers copiés pour Vercel
- `scripts/deploy.sh` : Script de déploiement automatique

## ⚙️ Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build:vercel",
  "installCommand": "npm ci",
  "outputDirectory": ".vercel/output"
}
```

### package.json
- `build:vercel` : Build + copie vers `.vercel/output`
- `deploy` : Script de déploiement complet

## 🔍 Avantages

1. **Évite les erreurs OOM** : Build local avec plus de mémoire
2. **Plus rapide** : Pas de build sur Vercel
3. **Contrôle total** : Debug local possible
4. **Fiabilité** : Moins de dépendance aux ressources Vercel

## 🐛 Dépannage

### Erreur de mémoire locale
```bash
# Augmenter la mémoire Node.js
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

### Erreur de permissions
```bash
# Rendre le script exécutable
chmod +x scripts/deploy.sh
```

## 📝 Notes

- Les fichiers `.vercel/output` sont ignorés par Git
- Le build local utilise 6GB de mémoire par défaut
- Vérifiez toujours le build local avant de déployer
