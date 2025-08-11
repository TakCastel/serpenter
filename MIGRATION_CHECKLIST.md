# Migration du système de données de checklist

## 🎯 Objectif

Résoudre le problème d'accès aux fichiers JSON sur Netlify en centralisant les données dans des fichiers statiques et en utilisant le système i18n pour les traductions.

## 🔄 Changements effectués

### Avant (ancien système)
```
server/data/
├── i18n/
│   ├── seo-items-fr.json
│   ├── seo-items-en.json
│   ├── accessibilite-items-fr.json
│   └── ...
└── seo-checklist.json
```

### Après (nouveau système)
```
app/data/
└── checklist-items-web.json

i18n/locales/
├── fr.json (avec traductions intégrées)
└── en.json (avec traductions intégrées)
```

## 📁 Structure du nouveau système

### 1. Fichier de données global (`app/data/checklist-items-web.json`)
```json
{
  "seo": {
    "items": [
      {
        "id": "title-tag",
        "labelKey": "items.seo.titletag.label",
        "descriptionKey": "items.seo.titletag.description",
        "details": {
          "explicationKey": "items.seo.titletag.explication",
          "commentFaireKey": "items.seo.titletag.commentFaire",
          "bonnesPratiquesKey": "items.seo.titletag.bonnesPratiques",
          "exempleKey": "items.seo.titletag.exemple"
        }
      }
    ]
  }
}
```

### 2. Traductions dans i18n (`i18n/locales/fr.json`)
```json
{
  "items": {
    "seo": {
      "titletag": {
        "label": "Balise <title> présente et optimisée",
        "description": "Titre unique et pertinent, avec mots-clés",
        "explication": "...",
        "commentFaire": [...],
        "bonnesPratiques": [...],
        "exemple": {...}
      }
    }
  }
}
```

### 3. Composable pour l'accès aux données (`app/composables/useChecklistData.js`)
```javascript
export const useChecklistData = () => {
  const { $t } = useNuxtApp()
  
  const getCategoryItems = (category) => {
    // Retourne les items avec les traductions appliquées
  }
  
  return { getCategoryItems, getAllCategories, getCategoryData }
}
```

## 🚀 Avantages du nouveau système

1. **✅ Accessible sur Netlify** : Les fichiers sont maintenant statiques et servis correctement
2. **🌍 Gestion centralisée des traductions** : Utilise le système i18n existant
3. **📦 Données unifiées** : Un seul fichier JSON pour toutes les données
4. **🔧 Maintenance simplifiée** : Plus besoin de gérer des fichiers séparés par langue
5. **⚡ Performance améliorée** : Moins de requêtes API, données chargées côté client

## 📊 Statistiques de migration

- **7 catégories** migrées
- **44 items** au total
- **2 langues** (FR/EN)
- **0 fichier** restant dans `server/data/`

## 🛠️ Utilisation

### Dans un composant
```javascript
import { useChecklistData } from '~/composables/useChecklistData'

const { getCategoryItems, getAllCategories } = useChecklistData()

// Obtenir tous les items d'une catégorie
const seoItems = getCategoryItems('seo')

// Obtenir toutes les catégories
const categories = getAllCategories()
```

### Ajouter un nouvel item
1. Ajouter l'item dans `app/data/checklist-items-web.json`
2. Ajouter les traductions dans `i18n/locales/fr.json` et `i18n/locales/en.json`

## 🔧 Scripts de migration

- `scripts/migrate-checklist-data.mjs` : Migration automatique des données
- `scripts/cleanup-old-data.mjs` : Nettoyage des anciens fichiers

## ✅ Tests

Une page de test est disponible sur `/test-checklist` pour vérifier le bon fonctionnement du nouveau système.

## 🎉 Résultat

Le problème d'accès aux fichiers JSON sur Netlify est maintenant résolu. Les données sont accessibles et les traductions fonctionnent correctement.

