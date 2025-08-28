<template>
  <aside
    :class="[
      'fixed left-0 top-[77px] border-r transition-all duration-500 ease-in-out h-[calc(100vh-77px)] flex flex-col z-10 shadow-lg',
      isSidebarCollapsed ? 'w-14' : 'w-72',
    ]"
    style="border-color: var(--bg-border); background-color: var(--bg-surface)"
    role="navigation"
    aria-label="Navigation des vérifications"
  >
    <div
      :class="[
        'flex-1 min-h-0 overflow-auto',
        isSidebarCollapsed ? 'px-2 pb-0 pt-4' : 'p-4 pb-0 pt-4',
      ]"
    >
      <!-- Sélecteur de projet -->
      <div class="mb-6" v-if="!isSidebarCollapsed">
        <ProjectSelector @project-changed="handleProjectChanged" />
      </div>

      <!-- Navigation générale -->
      <div class="mb-6">
        <h3
          v-if="!isSidebarCollapsed"
          class="text-xs font-semibold mb-3 transition-colors duration-200 hidden sm:block tracking-wide"
          style="color: var(--text-primary)"
        >
          Navigation
        </h3>

        <nav
          class="space-y-1"
          role="navigation"
          aria-label="Navigation générale"
        >
          <!-- Tableau de bord avec sous-menu Vérifications -->
          <div class="space-y-1">
            <NuxtLink
              to="/dashboard"
              class="rounded-xl transition-all duration-200 flex items-center"
              :class="[
                isSidebarCollapsed
                  ? 'w-10 h-10 mx-auto justify-center'
                  : 'w-full text-left px-2 py-2 sm:px-3 sm:py-2',
              ]"
              :style="{
                backgroundColor:
                  $route.path === '/dashboard'
                    ? 'var(--bg-border)'
                    : 'transparent',
                color: 'var(--text-primary)',
              }"
              :aria-current="$route.path === '/dashboard' ? 'page' : undefined"
              :title="isSidebarCollapsed ? 'Tableau de bord' : undefined"
            >
              <Icon
                name="heroicons:home"
                :class="[
                  'flex-shrink-0',
                  isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-0.5',
                ]"
                :style="{ color: 'var(--text-primary)' }"
                aria-hidden="true"
              />
              <span
                v-if="!isSidebarCollapsed"
                class="text-xs sm:text-sm font-medium truncate ml-2"
                >Tableau de bord</span
              >
            </NuxtLink>

            <!-- Sous-menu Vérifications (visible seulement sur la page dashboard avec un projet) -->
            <div
              v-if="
                isClient &&
                hasProjects &&
                currentProject?.checklistType &&
                $route.path === '/dashboard' &&
                !isSidebarCollapsed
              "
              class="ml-6 space-y-1"
            >
              <!-- Skeleton pendant le chargement du projet -->
              <div v-if="isProjectLoading" class="space-y-2">
                <div
                  v-for="i in 5"
                  :key="`skeleton-category-${i}`"
                  class="rounded-xl h-8 animate-pulse"
                  style="background-color: var(--bg-border)"
                ></div>
              </div>

              <!-- Navigation des catégories -->
              <nav
                v-else
                class="space-y-1"
                role="navigation"
                aria-label="Navigation des catégories"
              >
                <button
                  v-for="category in projectCategories"
                  :key="category.id"
                  @click="scrollToCategory(category.id)"
                  @keydown.enter="scrollToCategory(category.id)"
                  @keydown.space.prevent="scrollToCategory(category.id)"
                  class="rounded-lg transition-all duration-200 flex items-center w-full text-left px-2 py-1.5 text-xs"
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
                  :aria-label="
                    $t('common.goToCategory', { name: $t(category.name) })
                  "
                  :title="
                    $t('common.goToCategory', { name: $t(category.name) })
                  "
                  role="menuitem"
                  tabindex="0"
                >
                  <Icon
                    :name="category.icon"
                    class="w-4 h-4 mr-2 flex-shrink-0"
                    :style="{ color: 'var(--text-primary)' }"
                    aria-hidden="true"
                  />
                  <span class="text-xs font-medium truncate">{{
                    $t(category.name)
                  }}</span>
                </button>
              </nav>
            </div>
          </div>

          <NuxtLink
            to="/profile"
            class="rounded-xl transition-all duration-200 flex items-center"
            :class="[
              isSidebarCollapsed
                ? 'w-10 h-10 mx-auto justify-center'
                : 'w-full text-left px-2 py-2 sm:px-3 sm:py-2',
            ]"
            :style="{
              backgroundColor:
                $route.path === '/profile' ? 'var(--bg-border)' : 'transparent',
              color: 'var(--text-primary)',
            }"
            :aria-current="$route.path === '/profile' ? 'page' : undefined"
            :title="isSidebarCollapsed ? 'Mon profil' : undefined"
          >
            <Icon
              name="heroicons:user"
              :class="[
                'flex-shrink-0',
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-0.5',
              ]"
              :style="{ color: 'var(--text-primary)' }"
              aria-hidden="true"
            />
            <span
              v-if="!isSidebarCollapsed"
              class="text-xs sm:text-sm font-medium truncate ml-2"
              >Mon profil</span
            >
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="rounded-xl transition-all duration-200 flex items-center"
            :class="[
              isSidebarCollapsed
                ? 'w-10 h-10 mx-auto justify-center'
                : 'w-full text-left px-2 py-2 sm:px-3 sm:py-2',
            ]"
            :style="{
              backgroundColor:
                $route.path === '/settings'
                  ? 'var(--bg-border)'
                  : 'transparent',
              color: 'var(--text-primary)',
            }"
            :aria-current="$route.path === '/settings' ? 'page' : undefined"
            :title="isSidebarCollapsed ? 'Paramètres' : undefined"
          >
            <Icon
              name="heroicons:cog-6-tooth"
              :class="[
                'flex-shrink-0',
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-0.5',
              ]"
              :style="{ color: 'var(--text-primary)' }"
              aria-hidden="true"
            />
            <span
              v-if="!isSidebarCollapsed"
              class="text-xs sm:text-sm font-medium truncate ml-2"
              >Paramètres</span
            >
          </NuxtLink>

          <NuxtLink
            to="/help"
            class="rounded-xl transition-all duration-200 flex items-center"
            :class="[
              isSidebarCollapsed
                ? 'w-10 h-10 mx-auto justify-center'
                : 'w-full text-left px-2 py-2 sm:px-3 sm:py-2',
            ]"
            :style="{
              backgroundColor:
                $route.path === '/help' ? 'var(--bg-border)' : 'transparent',
              color: 'var(--text-primary)',
            }"
            :aria-current="$route.path === '/help' ? 'page' : undefined"
            :title="isSidebarCollapsed ? 'Aide' : undefined"
          >
            <Icon
              name="heroicons:question-mark-circle"
              :class="[
                'flex-shrink-0',
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-0.5',
              ]"
              :style="{ color: 'var(--text-primary)' }"
              aria-hidden="true"
            />
            <span
              v-if="!isSidebarCollapsed"
              class="text-xs sm:text-sm font-medium truncate ml-2"
              >Aide & Support</span
            >
          </NuxtLink>
        </nav>
      </div>

      <!-- Contenu de la sidebar selon l'état -->
      <div
        v-if="
          isClient &&
          hasProjects &&
          currentProject?.checklistType &&
          $route.path === '/dashboard'
        "
      >
        <!-- Message d'invitation quand aucun projet ou pas de type de checklist -->
        <div
          v-if="
            isClient &&
            !isSidebarCollapsed &&
            (!hasProjects || !currentProject?.checklistType) &&
            $route.path === '/dashboard'
          "
          class="text-center"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style="background-color: var(--bg-border)"
          >
            <Icon
              name="heroicons:folder"
              class="w-8 h-8"
              style="color: var(--accent-primary)"
              aria-hidden="true"
            />
          </div>
          <h3
            class="text-sm font-semibold mb-2 transition-colors duration-200"
            style="color: var(--text-primary)"
          >
            {{
              !hasProjects
                ? $t("sidebar.welcome")
                : "Choisir un type de checklist"
            }}
          </h3>
          <p
            class="text-xs transition-colors duration-200"
            style="color: var(--text-secondary)"
          >
            {{
              !hasProjects
                ? $t("sidebar.createProjectMessage")
                : "Sélectionnez le type de checklist qui correspond à votre projet"
            }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useProjectsStore } from "~/stores/projects";
import { useChecklistData } from "~/composables/useChecklistData";
import ProjectSelector from "~/components/dashboard/ProjectSelector.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-sidebar", "project-changed"]);

const isClient = ref(false);
const isProjectLoading = ref(false);
const activeCategory = ref(null);
const projectsStore = useProjectsStore();
const { t } = useI18n();

// Computed properties
const hasProjects = computed(() => projectsStore.hasProjects);
const currentProjectId = computed(() => projectsStore.currentProjectId);
const currentProject = computed(() => projectsStore.currentProject);

// Initialiser les données de checklist une seule fois
const checklistData = useChecklistData("web-prelaunch");

// Watcher pour mettre à jour le type de checklist quand le projet change
watch(
  () => currentProject.value?.checklistType,
  (newType) => {
    if (newType && checklistData.setChecklistType) {
      checklistData.setChecklistType(newType);
    }
  },
  { immediate: true }
);

// Computed pour les catégories du projet
const projectCategories = computed(() => {
  try {
    if (!checklistData || !currentProject.value?.checklistType) return [];

    const { getAllCategories, getCategoryData } = checklistData;
    const categoryIds = getAllCategories();

    return categoryIds.map((categoryId) => {
      try {
        const categoryData = getCategoryData(categoryId);
        const categoryName = `categories.${categoryId}.name`;

        // Déterminer l'icône selon le type de catégorie
        const icon = getSommaireIcon(categoryId);

        return {
          id: categoryId,
          name: categoryName,
          icon: icon,
        };
      } catch (error) {
        return {
          id: categoryId,
          name: `Catégorie ${categoryId}`,
          icon: "heroicons:document-text",
        };
      }
    });
  } catch (error) {
    return [];
  }
});

// Fonction pour obtenir l'icône de la catégorie
const getSommaireIcon = (categoryId) => {
  const icons = {
    // Catégories principales
    seo: "heroicons:magnifying-glass",
    accessibilite: "heroicons:heart",
    performance: "heroicons:bolt",
    "eco-conception": "heroicons:globe-alt",
    "responsive-ux": "heroicons:device-phone-mobile",
    securite: "heroicons:shield-check",
    analytics: "heroicons:chart-bar",

    // Catégories de sécurité
    "reseau-chiffrement": "heroicons:lock-closed",
    "authentification-acces": "heroicons:key",
    "protection-attaques": "heroicons:shield-exclamation",
    "fichiers-donnees": "heroicons:document-check",
    "maintenance-surveillance": "heroicons:eye",

    // Catégories d'apps
    "app-store": "heroicons:device-phone-mobile",
    "play-store": "heroicons:device-phone-mobile",
    technical: "heroicons:cog",
    legal: "heroicons:scale",
  };
  return icons[categoryId] || "heroicons:document-text";
};

// Gestionnaire de changement de projet
const handleProjectChanged = async (projectId) => {
  try {
    isProjectLoading.value = true;

    // Mettre à jour le projet
    projectsStore.setCurrentProject(projectId);

    // Réinitialiser la catégorie active
    activeCategory.value = null;

    // Émettre l'événement vers le parent
    emit("project-changed", projectId);
  } catch (error) {
  } finally {
    // Petit délai pour l'effet visuel
    setTimeout(() => {
      isProjectLoading.value = false;
    }, 300);
  }
};

// Scroll simple vers la catégorie
const scrollToCategory = (categoryId) => {
  try {
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
          try {
            const headerHeight = 80;
            const elementTop = element.offsetTop;
            const scrollPosition = elementTop - headerHeight - 20;
            window.scrollTo({
              top: Math.max(0, scrollPosition),
              behavior: "smooth",
            });
          } catch (error) {}
        }, 300);
      }
    }
  } catch (error) {}
};

// Gestion du scroll pour mettre à jour la catégorie active
const checkScroll = () => {
  try {
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
        try {
          const element = document.getElementById(`category-${category.id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(rect.top - headerHeight);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestCategory = category.id;
            }
          }
        } catch (error) {}
      });

      if (closestCategory && closestCategory !== activeCategory.value) {
        activeCategory.value = closestCategory;
      }
    }
  } catch (error) {}
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
