<template>
  <div
    v-if="isClient && hasProjects && currentProject?.checklistType"
    class="mb-6"
  >
    <!-- Navigation des catégories -->
    <div
      class="card p-4"
      style="
        background-color: var(--bg-surface);
        border: 1px solid var(--bg-border);
      "
    >
      <h3
        class="text-sm font-semibold mb-3 transition-colors duration-200 tracking-wide"
        style="color: var(--text-primary)"
      >
        {{ $t("app.navigation.verifications") }}
      </h3>

      

      <!-- Navigation des catégories -->
      <nav
        v-else
        class="flex flex-wrap gap-2"
        role="navigation"
        :aria-label="$t('app.navigation.verificationsDescription')"
      >
        <button
          v-for="category in projectCategories"
          :key="category.id"
          @click="scrollToCategory(category.id)"
          @keydown.enter="scrollToCategory(category.id)"
          @keydown.space.prevent="scrollToCategory(category.id)"
          class="rounded-lg transition-all duration-200 flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100"
          :style="{
            backgroundColor:
              activeCategory === category.id
                ? 'var(--bg-border)'
                : 'transparent',
            color: 'var(--text-primary)',
            borderColor: 'transparent',
          }"
          :aria-current="
            activeCategory === category.id ? 'location' : undefined
          "
          :aria-label="$t('common.goToCategory', { name: $t(category.name) })"
          :title="$t('common.goToCategory', { name: $t(category.name) })"
          role="menuitem"
          tabindex="0"
        >
          <Icon
            :name="category.icon"
            class="w-4 h-4 mr-2 flex-shrink-0"
            :style="{ color: 'var(--text-primary)' }"
            aria-hidden="true"
          />
          <span class="text-sm font-medium">{{ $t(category.name) }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProjectsStore } from "~/stores/projects";
import { useChecklistData } from "~/composables/useChecklistData";
import { useI18n } from "vue-i18n";



const isClient = ref(false);
const activeCategory = ref(null);
const projectsStore = useProjectsStore();
const { t } = useI18n();

// Computed properties
const hasProjects = computed(() => projectsStore.hasProjects);
const currentProject = computed(() => projectsStore.currentProject);

// Charger les données de checklist au niveau du setup
const checklistData = computed(() => {
  if (!currentProject.value?.checklistType) return null;
  try {
    return useChecklistData(currentProject.value.checklistType);
  } catch (error) {
    // Erreur lors du chargement des données de checklist
    return null;
  }
});

// Computed pour les catégories du projet
const projectCategories = computed(() => {
  if (!checklistData.value) return [];

  const { getAllCategories, getCategoryData } = checklistData.value;
  const categoryIds = getAllCategories();

  return categoryIds.map((categoryId) => {
    const categoryData = getCategoryData(categoryId);
    const categoryName = `categories.${categoryId}.name`;

    // Déterminer l'icône selon le type de catégorie
    const icon = getSommaireIcon(categoryId);

    return {
      id: categoryId,
      name: categoryName,
      icon: icon,
    };
  });
});

// Fonction pour obtenir l'icône de la catégorie
const getSommaireIcon = (categoryId) => {
  const icons = {
    seo: "heroicons:magnifying-glass",
    accessibilite: "heroicons:heart",
    performance: "heroicons:bolt",
    "eco-conception": "heroicons:globe-alt",
    "responsive-ux": "heroicons:device-phone-mobile",
    securite: "heroicons:shield-check",
    analytics: "heroicons:chart-bar",
    preparation: "heroicons:clipboard-document-list",
    conformite: "heroicons:check-circle",
    installation: "heroicons:cog",
    updates: "heroicons:arrow-path",
    backups: "heroicons:cloud-arrow-up",
    latestVersion: "heroicons:star",
    themeChild: "heroicons:paint-brush",
  };
  return icons[categoryId] || "heroicons:document-text";
};

// Scroll simple vers la catégorie
const scrollToCategory = (categoryId) => {
  if (process.client) {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Mettre à jour la catégorie active
      activeCategory.value = categoryId;

      // Ouvrir l'accordéon de la catégorie
      window.dispatchEvent(
        new CustomEvent("open-category", {
          detail: { categoryId },
        })
      );

      // Scroll vers l'élément
      setTimeout(() => {
        const headerHeight = 80;
        const elementTop = element.offsetTop;
        const scrollPosition = elementTop - headerHeight - 20;
        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }, 300);
    }
  }
};

// Gestion du scroll pour mettre à jour la catégorie active
const checkScroll = () => {
  if (
    process.client &&
    projectCategories.value &&
    Array.isArray(projectCategories.value)
  ) {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const headerHeight = 80;

    let closestCategory = null;
    let closestDistance = Infinity;

    projectCategories.value.forEach((category) => {
      const element = document.getElementById(`category-${category.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - headerHeight);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCategory = category.id;
        }
      }
    });

    if (closestCategory && closestCategory !== activeCategory.value) {
      activeCategory.value = closestCategory;
    }
  }
};

onMounted(() => {
  if (process.client) {
    isClient.value = true;
    window.addEventListener("scroll", checkScroll);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", checkScroll);
  }
});
</script>
