# Configuration Firebase pour Serpenter

## Problème actuel
L'erreur `Missing or insufficient permissions` indique que les règles de sécurité Firestore ne sont pas configurées correctement.

## Solution

### 1. Installer Firebase CLI (si pas déjà fait)
```bash
npm install -g firebase-tools
```

### 2. Se connecter à Firebase
```bash
firebase login
```

### 3. Initialiser Firebase dans le projet (si pas déjà fait)
```bash
firebase init
```
- Sélectionner Firestore et Hosting
- Choisir le projet Firebase existant
- Utiliser les fichiers de configuration existants

### 4. Déployer les règles Firestore
```bash
npm run deploy:firebase
```

Ou manuellement :
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Vérifier les règles dans la console Firebase
- Aller sur [console.firebase.google.com](https://console.firebase.google.com)
- Sélectionner votre projet
- Aller dans Firestore Database > Rules
- Vérifier que les règles sont bien déployées

## Règles Firestore déployées
Les règles permettent :
- Lecture/écriture des projets uniquement pour l'utilisateur propriétaire
- Création de projets pour les utilisateurs authentifiés
- Accès refusé par défaut pour tout le reste

## Structure des données
```javascript
// Collection: projects
{
  id: "auto-generated",
  name: "Nom du projet",
  checklistType: "web-prelaunch|appstore-preflight|security-checker",
  userId: "uid-de-lutilisateur",
  createdAt: "2025-08-12T...",
  updatedAt: "2025-08-12T..."
}
```

## Test
Après déploiement des règles, redémarrer l'application et vérifier dans la console que :
1. Plus d'erreur `permission-denied`
2. Les projets se chargent correctement
3. La création de projets fonctionne

