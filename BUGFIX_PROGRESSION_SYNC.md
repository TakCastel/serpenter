# 🐛 Correction : Perte de progression lors du changement de projet

## 📋 Problème identifié

Vous avez signalé que :
1. ✅ L'audit Lighthouse précoche bien les éléments
2. ❌ Mais quand vous naviguez vers un autre projet, vous perdez la progression
3. ❌ Les pourcentages ne se mettent pas à jour correctement

## 🔍 Analyse du problème

Le problème venait de plusieurs manques de synchronisation :

### 1. **Événements manquants**
Le composant `SeoChecklist.vue` n'écoutait pas l'événement `project-checklist-changed` émis par `ProjectSelector.vue` lors du changement de projet.

### 2. **Fonction `calculateScores` manquante**
La fonction était appelée mais pas définie, causant des erreurs silencieuses.

### 3. **Rechargement incomplet**
Lors du changement de projet, seules les données cochées étaient rechargées, mais pas les scores.

## ✅ Solutions implémentées

### 1. **Ajout de l'écoute d'événements**
```javascript
// Dans SeoChecklist.vue - onMounted()
window.addEventListener('project-checklist-changed', async (event) => {
  try {
    if (!currentUser.value || !event.detail?.projectId) return
    
    // Recharger complètement les données pour le nouveau projet
    await loadCheckedItems()
    await loadCategories()
    
    // Recalculer les scores
    await calculateScores()
  } catch (error) {
    console.error('Erreur lors du changement de projet:', error)
  }
})
```

### 2. **Création de la fonction `calculateScores`**
```javascript
// Fonction pour calculer et mettre à jour les scores
const calculateScores = async () => {
  try {
    if (!props.currentProjectId) return
    
    const allItems = []
    categories.value.forEach(category => {
      if (category.items) allItems.push(...category.items)
    })
    
    projectsStore.calculateScoresFromItems(props.currentProjectId, allItems, checkedItems.value)
  } catch (error) {
    console.error('Erreur lors du calcul des scores:', error)
  }
}
```

### 3. **Watcher sur le changement de projet**
```javascript
// Watcher sur le changement de projet
watch(() => props.currentProjectId, async (newProjectId, oldProjectId) => {
  if (newProjectId && newProjectId !== oldProjectId) {
    try {
      // Recharger les données pour le nouveau projet
      await loadCheckedItems()
      await calculateScores()
    } catch (error) {
      console.error('Erreur lors du changement de projet (watcher):', error)
    }
  }
}, { immediate: false })
```

### 4. **Calcul des scores après chargement des catégories**
```javascript
// Dans loadCategories()
// Calculer les scores après le chargement des catégories
await calculateScores()
```

## 🧪 Tests ajoutés

Un nouveau fichier de test `cypress/e2e/project-progression-sync.cy.js` a été créé avec :

- ✅ Test de maintien de progression entre projets
- ✅ Test de mise à jour des pourcentages dans ProjectSelector
- ✅ Test des auto-checks depuis Lighthouse
- ✅ Test de synchronisation des événements
- ✅ Test de recalcul après rechargement
- ✅ Tests de performance et robustesse

### Commande de test spécifique :
```bash
npm run test:progression
```

## 🔄 Flux de synchronisation corrigé

### Avant (problématique) :
1. Utilisateur change de projet via ProjectSelector
2. ProjectSelector émet `project-checklist-changed`
3. ❌ SeoChecklist n'écoute pas cet événement
4. ❌ Les données restent celles de l'ancien projet
5. ❌ Les scores ne sont pas recalculés

### Après (corrigé) :
1. Utilisateur change de projet via ProjectSelector
2. ProjectSelector émet `project-checklist-changed`
3. ✅ SeoChecklist écoute l'événement
4. ✅ Rechargement des données : `loadCheckedItems()`
5. ✅ Rechargement des catégories : `loadCategories()`
6. ✅ Recalcul des scores : `calculateScores()`
7. ✅ Mise à jour de l'affichage

## 📊 Points de synchronisation

### 1. **Changement de projet**
- Événement : `project-checklist-changed`
- Actions : Recharger données + recalculer scores

### 2. **Auto-check Lighthouse**
- Événement : `checked-items-updated`
- Actions : Recharger état + recalculer scores

### 3. **Changement de prop**
- Watcher : `props.currentProjectId`
- Actions : Recharger données + recalculer scores

### 4. **Chargement initial**
- Hook : `onMounted`
- Actions : Charger tout + calculer scores

## 🎯 Résultat attendu

Maintenant, quand vous :
1. ✅ Lancez un audit Lighthouse → éléments précochés
2. ✅ Changez de projet → progression sauvegardée
3. ✅ Revenez au projet initial → progression restaurée
4. ✅ Regardez ProjectSelector → pourcentages corrects

## 🚀 Test de validation

Pour vérifier que le problème est résolu :

```bash
# 1. Démarrer l'application
npm run dev

# 2. Tester la synchronisation
npm run test:progression

# 3. Test manuel :
# - Créer un projet
# - Cocher des éléments ou lancer Lighthouse
# - Créer un second projet
# - Revenir au premier projet
# - Vérifier que la progression est maintenue
```

## 🔧 Fichiers modifiés

- ✅ `app/components/checklist/SeoChecklist.vue` - Ajout synchronisation
- ✅ `cypress/e2e/project-progression-sync.cy.js` - Tests spécifiques
- ✅ `package.json` - Script de test
- ✅ `BUGFIX_PROGRESSION_SYNC.md` - Documentation

Le problème de perte de progression devrait maintenant être complètement résolu ! 🎉
