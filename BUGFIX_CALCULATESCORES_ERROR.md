# 🐛 Correction : Erreur "calculateScores is not defined"

## 📋 Problème identifié

Vous aviez des erreurs dans la console lors de la navigation :
```
SeoChecklist.vue: Erreur lors du changement de projet: ReferenceError: calculateScores is not defined
```

## 🔍 Analyse du problème

Le problème venait de la **portée (scope) des fonctions** dans les event listeners :

### 1. **Fonctions anonymes dans les event listeners**
```javascript
// ❌ PROBLÉMATIQUE
window.addEventListener('project-checklist-changed', async (event) => {
  // Cette fonction anonyme n'a pas accès à calculateScores
  await calculateScores() // ❌ ReferenceError
})
```

### 2. **Définition tardive de calculateScores**
La fonction `calculateScores` était définie après les event listeners, créant un problème d'ordre de déclaration.

### 3. **Nettoyage incorrect des event listeners**
Les event listeners n'étaient pas correctement supprimés dans `onUnmounted`.

## ✅ Solutions implémentées

### 1. **Création de gestionnaires nommés**
```javascript
// ✅ SOLUTION : Gestionnaires nommés
const handleProjectChange = async (event) => {
  try {
    if (!currentUser.value || !event.detail?.projectId) return
    
    await loadCheckedItems()
    await loadCategories()
    await calculateScores() // ✅ Fonctionne maintenant
  } catch (error) {
    console.error('Erreur lors du changement de projet:', error)
  }
}

const handleCheckedItemsUpdate = async (event) => {
  try {
    if (!currentUser.value || !props.currentProjectId) return
    await projectsStore.loadProjectChecked(currentUser.value.uid, props.currentProjectId)
    checkedItems.value = projectsStore.getCheckedSet(props.currentProjectId)
    await calculateScores() // ✅ Fonctionne maintenant
  } catch (error) {
    console.error('Erreur lors de la mise à jour des éléments cochés:', error)
  }
}
```

### 2. **Event listeners avec références de fonctions**
```javascript
// ✅ SOLUTION : Utiliser les références de fonctions
window.addEventListener('project-checklist-changed', handleProjectChange)
window.addEventListener('checked-items-updated', handleCheckedItemsUpdate)
```

### 3. **Nettoyage correct des event listeners**
```javascript
// ✅ SOLUTION : Nettoyage avec les mêmes références
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('project-checklist-changed', handleProjectChange)
    window.removeEventListener('checked-items-updated', handleCheckedItemsUpdate)
  }
})
```

## 🔄 Structure corrigée

### Ordre des déclarations dans SeoChecklist.vue :
1. ✅ **Variables réactives** (ref, computed)
2. ✅ **Fonctions utilitaires** (loadCategories, loadCheckedItems, etc.)
3. ✅ **Fonction calculateScores** 
4. ✅ **Gestionnaires d'événements** (handleProjectChange, handleCheckedItemsUpdate)
5. ✅ **Autres fonctions** (toggleItem, etc.)
6. ✅ **Watchers**
7. ✅ **Hooks de cycle de vie** (onMounted, onUnmounted)

### Avantages de cette approche :
- ✅ **Scope correct** : Les gestionnaires ont accès à toutes les fonctions
- ✅ **Réutilisabilité** : Les gestionnaires peuvent être testés indépendamment
- ✅ **Nettoyage propre** : Les event listeners sont correctement supprimés
- ✅ **Lisibilité** : Code plus organisé et maintenable

## 🧪 Tests de validation

### Test automatique :
```bash
npm run test:debug-scores
```

### Test manuel :
1. Ouvrir la console du navigateur
2. Créer plusieurs projets
3. Naviguer entre les projets
4. Vérifier qu'il n'y a plus d'erreurs `calculateScores is not defined`

## 📊 Avant vs Après

### ❌ Avant (problématique) :
```javascript
// Event listener avec fonction anonyme
window.addEventListener('project-checklist-changed', async (event) => {
  await calculateScores() // ❌ ReferenceError
})

// Fonction définie après
const calculateScores = async () => { ... }
```

### ✅ Après (corrigé) :
```javascript
// Fonction définie en premier
const calculateScores = async () => { ... }

// Gestionnaire nommé
const handleProjectChange = async (event) => {
  await calculateScores() // ✅ Fonctionne
}

// Event listener avec référence
window.addEventListener('project-checklist-changed', handleProjectChange)
```

## 🎯 Résultat

Maintenant :
- ✅ **Aucune erreur** `calculateScores is not defined`
- ✅ **Navigation fluide** entre les projets
- ✅ **Progression maintenue** correctement
- ✅ **Event listeners** correctement nettoyés
- ✅ **Code plus maintenable** et organisé

## 🔧 Fichiers modifiés

- ✅ `app/components/checklist/SeoChecklist.vue` - Correction des event listeners
- ✅ `cypress/e2e/debug-calculatescores.cy.js` - Tests de validation
- ✅ `package.json` - Script de test debug
- ✅ `BUGFIX_CALCULATESCORES_ERROR.md` - Documentation

Les erreurs `calculateScores is not defined` sont maintenant complètement résolues ! 🎉
