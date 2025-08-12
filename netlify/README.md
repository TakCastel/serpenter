# Déploiement Netlify - Mode SPA

Ce dossier contient la configuration pour déployer l'application Serpenter sur Netlify en mode SPA (Single Page Application).

## 🚀 Déploiement rapide

### Option 1 : Déploiement automatique via Git
1. Connectez votre repository GitHub à Netlify
2. Configurez les variables d'environnement dans l'interface Netlify
3. Le déploiement se fera automatiquement à chaque push sur `main`

### Option 2 : Déploiement manuel
```bash
# Build et déploiement en mode SPA
npm run publish:netlify:spa

# Ou étape par étape
npm run build:netlify:spa
npm run deploy:netlify
```

## ⚙️ Configuration requise

### Variables d'environnement Netlify
Configurez ces variables dans l'interface Netlify :

```bash
# Firebase
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Configuration de l'application
NUXT_APP_ENV=production
NUXT_SSR=false
NODE_ENV=production

# URL Netlify (optionnel, auto-détectée)
NUXT_PUBLIC_NETLIFY_URL=https://your-site.netlify.app
```

### Configuration du build
- **Build command** : `npm run build:netlify:spa`
- **Publish directory** : `.netlify/publish`
- **Node version** : `18` (configuré automatiquement)

## 🔧 Scripts disponibles

- `npm run build:netlify:spa` : Build optimisé pour Netlify en mode SPA
- `npm run deploy:netlify` : Déploiement sur Netlify
- `npm run publish:netlify:spa` : Build + déploiement complet

## 📁 Structure des fichiers

```
netlify/
├── functions/           # Netlify Functions (API nécessitant un serveur)
│   ├── lh.js          # Lighthouse audit
│   ├── security-headers.js
│   ├── security-observatory.js
│   └── package.json   # Dépendances des fonctions
├── environment.production  # Variables d'environnement
└── README.md           # Ce fichier
```

## 🌐 Architecture SPA

L'application fonctionne maintenant en mode SPA avec :

### ✅ **Côté client (composables) :**
- **`useSecurityHeaders`** - Vérification des en-têtes de sécurité
- **`useSecurityObservatory`** - Appel à l'API Mozilla Observatory
- **`useNetlifyFunctions`** - Gestion des appels aux Netlify Functions

### 🔧 **Netlify Functions (serveur) :**
- **`lh`** - Audit Lighthouse (nécessite Chrome/Chromium)
- **`security-headers`** - Vérification serveur des en-têtes
- **`security-observatory`** - Appel serveur à Mozilla Observatory

### 📱 **Avantages du mode SPA :**
- **Déploiement statique** - Pas de serveur Node.js
- **Performance** - Tout côté client sauf si nécessaire
- **Scalabilité** - Netlify gère automatiquement la charge
- **Coût** - Gratuit pour la plupart des usages

## 🚨 Dépannage

### Erreur de build
- Vérifiez que Node.js 18+ est installé
- Vérifiez les variables d'environnement Firebase
- Consultez les logs de build dans Netlify

### Erreur 404 sur les routes
- Vérifiez que le fichier `_redirects` est bien généré
- Assurez-vous que le mode SPA est activé (`ssr: false`)

### Problèmes avec les Netlify Functions
- Vérifiez que les dépendances sont installées dans `netlify/functions/`
- Consultez les logs des fonctions dans Netlify
- Testez en local avec `netlify dev`

### Problèmes de performance
- Vérifiez la configuration du cache dans `_headers`
- Optimisez la taille des bundles avec `npm run build:analyze`

## 📚 Ressources

- [Documentation Netlify](https://docs.netlify.com/)
- [Configuration Nuxt pour Netlify](https://nuxt.com/docs/deployment/netlify)
- [Mode SPA Nuxt](https://nuxt.com/docs/guide/concepts/rendering#client-side-only-rendering)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
