export const checklistData = {
  categories: [
    {
      id: 'seo',
      name: 'SEO',
      description: 'Optimisation pour les moteurs de recherche',
      items: [
        {
          id: 'seo-title',
          title: 'Titre de la page',
          description: 'Le titre de la page doit être optimisé pour le SEO',
          status: 'pending',
          category: 'seo'
        },
        {
          id: 'seo-meta-description',
          title: 'Meta description',
          description: 'Ajouter une meta description unique et descriptive',
          status: 'pending',
          category: 'seo'
        },
        {
          id: 'seo-headings',
          title: 'Structure des titres',
          description: 'Utiliser une hiérarchie claire des titres (H1, H2, H3...)',
          status: 'pending',
          category: 'seo'
        }
      ]
    },
    {
      id: 'accessibilite',
      name: 'Accessibilité',
      description: 'Rendre le site accessible à tous',
      items: [
        {
          id: 'accessibilite-alt-text',
          title: 'Textes alternatifs',
          description: 'Toutes les images ont un attribut alt descriptif',
          status: 'pending',
          category: 'accessibilite'
        },
        {
          id: 'accessibilite-contrast',
          title: 'Contraste des couleurs',
          description: 'Le contraste des couleurs respecte les standards WCAG',
          status: 'pending',
          category: 'accessibilite'
        }
      ]
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Optimiser la vitesse de chargement',
      items: [
        {
          id: 'performance-images',
          title: 'Optimisation des images',
          description: 'Les images sont optimisées et compressées',
          status: 'pending',
          category: 'performance'
        },
        {
          id: 'performance-cache',
          title: 'Cache et compression',
          description: 'Mise en place du cache et de la compression',
          status: 'pending',
          category: 'performance'
        }
      ]
    },
    {
      id: 'eco-conception',
      name: 'Éco-conception',
      description: 'Réduire l\'impact environnemental',
      items: [
        {
          id: 'eco-conception-optimisation',
          title: 'Optimisation du code',
          description: 'Le code est optimisé pour réduire la consommation',
          status: 'pending',
          category: 'eco-conception'
        }
      ]
    },
    {
      id: 'responsive-ux',
      name: 'Responsive & UX',
      description: 'Expérience utilisateur optimale',
      items: [
        {
          id: 'responsive-mobile',
          title: 'Design responsive',
          description: 'Le site s\'adapte correctement aux mobiles',
          status: 'pending',
          category: 'responsive-ux'
        }
      ]
    },
    {
      id: 'securite',
      name: 'Sécurité',
      description: 'Protéger le site et les utilisateurs',
      items: [
        {
          id: 'securite-https',
          title: 'HTTPS',
          description: 'Le site utilise HTTPS',
          status: 'pending',
          category: 'securite'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Mesurer et analyser les performances',
      items: [
        {
          id: 'analytics-google',
          title: 'Google Analytics',
          description: 'Google Analytics est configuré',
          status: 'pending',
          category: 'analytics'
        }
      ]
    }
  ]
}

