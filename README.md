# 🐍 Serpenter - Application de Sécurité Web

Application Nuxt.js pour l'analyse de sécurité et l'audit de sites web.

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

## 📖 Pour commencer

1. **Lire le [Guide du Workflow](WORKFLOW_GUIDE.md)** - Essentiel pour comprendre le processus de développement
2. **Suivre les conventions GitFlow** pour chaque feature
3. **Tester localement** avant de merger
4. **Utiliser `npm run generate`** pour le build de production

---

**💡 Important** : Consultez toujours le [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) avant de commencer une nouvelle feature !
