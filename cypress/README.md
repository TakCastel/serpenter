# Tests Cypress pour Serpenter

## 📋 Vue d'ensemble

Cette suite de tests Cypress couvre toutes les fonctionnalités principales de l'application Serpenter :

- 🔐 **Authentification** - Login, register, logout, protection des routes
- 📁 **Gestion des projets** - Création, sélection, synchronisation
- ✅ **Système de checklist** - Accordéons, progression, types de checklist
- 🎨 **Interface utilisateur** - Thème, responsive, navigation
- 🏠 **Pages publiques** - Accueil, aide, navigation

## 🚀 Commandes disponibles

```bash
# Ouvrir l'interface Cypress (mode interactif)
npm run cypress:open

# Exécuter tous les tests en mode headless
npm run test:e2e

# Exécuter les tests avec un navigateur spécifique
npm run test:e2e:chrome
npm run test:e2e:firefox

# Exécuter les tests en mode headless
npm run test:e2e:headless
```

## 📁 Structure des tests

```
cypress/
├── e2e/                          # Tests end-to-end
│   ├── auth.cy.js               # Tests d'authentification
│   ├── projects.cy.js           # Tests de gestion des projets
│   ├── checklist.cy.js          # Tests du système de checklist
│   ├── checklist-types.cy.js    # Tests des types de checklist
│   ├── ui.cy.js                 # Tests d'interface utilisateur
│   ├── public-pages.cy.js       # Tests des pages publiques
│   └── integration.cy.js        # Tests d'intégration
├── fixtures/                     # Données de test
│   ├── users.json               # Utilisateurs de test
│   ├── projects.json            # Projets de test
│   ├── auth-response.json       # Réponses Firebase mockées
│   ├── firestore-response.json  # Réponses Firestore mockées
│   ├── checklist-web.json       # Données checklist web
│   ├── checklist-app.json       # Données checklist app
│   └── checklist-security.json  # Données checklist sécurité
└── support/                      # Configuration et commandes
    ├── e2e.js                   # Configuration globale
    └── commands.js              # Commandes personnalisées
```

## 🔧 Configuration

### Variables d'environnement

Les tests utilisent ces variables d'environnement (définies dans `cypress.config.js`) :

- `TEST_EMAIL` - Email de test par défaut
- `TEST_PASSWORD` - Mot de passe de test par défaut
- `TEST_EMAIL_2` - Email de test secondaire
- `TEST_PASSWORD_2` - Mot de passe de test secondaire

### Mocking Firebase

Les tests utilisent des mocks pour Firebase afin d'éviter les dépendances externes :

- `cy.mockLogin()` - Simule un utilisateur connecté
- `cy.mockLogout()` - Simule la déconnexion
- Interception des requêtes Firebase avec des fixtures

## 📝 Commandes personnalisées

### Authentification
- `cy.login(email, password)` - Connexion utilisateur
- `cy.register(email, password)` - Inscription utilisateur
- `cy.logout()` - Déconnexion
- `cy.mockLogin()` - Simulation de connexion
- `cy.mockLogout()` - Simulation de déconnexion

### Projets
- `cy.createProject(name, description, type)` - Création de projet
- `cy.selectProject(name)` - Sélection de projet

### Interface
- `cy.toggleTheme()` - Basculer le thème
- `cy.toggleSidebar()` - Basculer la sidebar
- `cy.setMobileViewport()` - Vue mobile
- `cy.setTabletViewport()` - Vue tablet
- `cy.setDesktopViewport()` - Vue desktop

### Checklist
- `cy.toggleChecklistItem(id)` - Cocher/décocher un élément
- `cy.openAccordion(id)` - Ouvrir un accordéon
- `cy.resetChecklistProgress()` - Réinitialiser la progression

### Navigation
- `cy.navigateToPage(page)` - Navigation vers une page
- `cy.waitForPageLoad()` - Attendre le chargement
- `cy.waitForProjectLoad()` - Attendre le chargement des projets

## 🎯 Attributs data-cy requis

Pour que les tests fonctionnent, vous devez ajouter ces attributs `data-cy` dans vos composants :

### Authentification
- `data-cy="email-input"` - Champ email
- `data-cy="password-input"` - Champ mot de passe
- `data-cy="login-button"` - Bouton de connexion
- `data-cy="register-button"` - Bouton d'inscription
- `data-cy="google-login-button"` - Bouton Google
- `data-cy="logout-button"` - Bouton de déconnexion
- `data-cy="user-menu"` - Menu utilisateur
- `data-cy="error-message"` - Message d'erreur

### Projets
- `data-cy="project-selector"` - Sélecteur de projet
- `data-cy="project-dropdown"` - Dropdown des projets
- `data-cy="project-option"` - Option de projet
- `data-cy="project-name-input"` - Champ nom du projet
- `data-cy="project-description-input"` - Champ description
- `data-cy="create-project-button"` - Bouton de création
- `data-cy="empty-state"` - État vide

### Checklist
- `data-cy="checklist-item"` - Élément de checklist
- `data-cy="checklist-checkbox"` - Checkbox d'élément
- `data-cy="accordion-header"` - En-tête d'accordéon
- `data-cy="accordion-content"` - Contenu d'accordéon
- `data-cy="progress-percentage"` - Pourcentage de progression
- `data-cy="progress-bar"` - Barre de progression
- `data-cy="reset-progress-button"` - Bouton de réinitialisation

### Interface
- `data-cy="theme-toggle"` - Bouton de thème
- `data-cy="sidebar"` - Sidebar
- `data-cy="sidebar-toggle"` - Bouton sidebar
- `data-cy="app-header"` - Header de l'app
- `data-cy="mobile-menu"` - Menu mobile
- `data-cy="mobile-menu-toggle"` - Bouton menu mobile

## 🏃‍♂️ Exécution des tests

1. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

2. **Exécuter les tests** (dans un autre terminal) :
   ```bash
   # Mode interactif
   npm run cypress:open
   
   # Mode headless
   npm run test:e2e
   ```

## ⚠️ Notes importantes

1. **Firebase** : Les tests utilisent des mocks pour éviter les dépendances Firebase réelles
2. **Données** : Les fixtures contiennent des données de test réalistes
3. **Responsive** : Tests automatiques sur mobile, tablet et desktop
4. **Accessibilité** : Vérifications ARIA et navigation clavier
5. **Performance** : Tests de temps de chargement et optimisations

## 🐛 Dépannage

Si les tests échouent :

1. Vérifiez que l'application fonctionne en local (`npm run dev`)
2. Vérifiez que les attributs `data-cy` sont présents dans les composants
3. Vérifiez les mocks Firebase dans `cypress/support/e2e.js`
4. Consultez les screenshots dans `cypress/screenshots/` en cas d'échec
