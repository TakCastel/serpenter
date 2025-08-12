# Test du changement de projet - Accordéons

## Problème résolu
Quand on changeait de projet, les accordéons gardaient l'état du projet précédent au lieu de se réinitialiser.

## Changements apportés

### 1. AppPreflightAccordion.vue
- ✅ Ajout d'écouteurs d'événements pour `project-checklist-changed`
- ✅ Méthode `reset()` qui remet à zéro tous les champs
- ✅ Gestion du cycle de vie avec `onMounted` et `onUnmounted`
- ✅ Exposition de la méthode `reset` via `defineExpose`

### 2. SecurityScannerAccordion.vue
- ✅ Ajout d'écouteurs d'événements pour `project-checklist-changed`
- ✅ Amélioration de la méthode `reset()` pour fermer les panels
- ✅ Gestion du cycle de vie avec `onMounted` et `onUnmounted`
- ✅ Réinitialisation des panels enfants

### 3. dashboard.vue
- ✅ Ajout de références `appPreflightAccordion` et `securityScannerAccordion`
- ✅ Modification du watcher `currentProjectId` pour réinitialiser selon le type
- ✅ Appel de `reset()` sur les bons accordéons selon le type de projet

## Test manuel à effectuer

1. **Créer/sélectionner un projet de type "security-checker"**
   - Remplir l'URL dans SecurityScannerAccordion
   - Ouvrir quelques panels
   - Lancer des scans

2. **Changer vers un projet de type "appstore-preflight"**
   - Vérifier que SecurityScannerAccordion n'est plus visible
   - Vérifier que AppPreflightAccordion est visible et vide

3. **Remplir des données dans AppPreflightAccordion**
   - Remplir les métadonnées
   - Coller du code iOS/Android
   - Lancer des analyses

4. **Changer vers un projet normal (SEO)**
   - Vérifier que AppPreflightAccordion n'est plus visible
   - Vérifier que LighthouseAccordion est visible et réinitialisé

5. **Revenir au projet "security-checker"**
   - Vérifier que SecurityScannerAccordion est vide (URL effacée, panels fermés)

## Événements utilisés
- `project-checklist-changed` : Émis par ProjectSelector quand on change de projet
- Écouté par tous les accordéons pour se réinitialiser automatiquement
