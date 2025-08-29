<template>
  <div
    class="min-h-screen p-8"
    :style="{ backgroundColor: 'var(--bg-primary)' }"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Navigation de la page -->
      <PageNavigation page-title="Paramètres" />

      <!-- Contenu de la page -->
      <div class="space-y-6">
        <!-- Section Projet actuel -->
        <div
          class="rounded-lg shadow-sm border p-6"
          :style="{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--bg-border)',
          }"
        >
          <h2
            class="text-lg font-semibold mb-4"
            :style="{ color: 'var(--text-primary)' }"
          >
            Projet actuel
          </h2>

          <div v-if="currentProject" class="space-y-4">
            <!-- Nom du projet -->
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium mb-2"
                :style="{ color: 'var(--text-primary)' }"
              >
                Nom du projet
              </label>
              <input
                id="project-name"
                v-model="projectName"
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :style="{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--bg-border)',
                  color: 'var(--text-primary)',
                }"
                placeholder="Nom du projet"
                :disabled="isUpdating"
              />
            </div>

            <!-- Description du projet -->
            <div>
              <label
                for="project-description"
                class="block text-sm font-medium mb-2"
                :style="{ color: 'var(--text-primary)' }"
              >
                Description du projet
              </label>
              <textarea
                id="project-description"
                v-model="projectDescription"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :style="{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--bg-border)',
                  color: 'var(--text-primary)',
                }"
                placeholder="Description du projet"
                :disabled="isUpdating"
              ></textarea>
            </div>

            <!-- Bouton de sauvegarde -->
            <div class="flex justify-end">
              <button
                @click="updateProject"
                :disabled="isUpdating || !hasChanges"
                class="px-4 py-2 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor:
                    isUpdating || !hasChanges
                      ? 'var(--text-muted)'
                      : 'var(--accent-primary)',
                }"
              >
                <Icon
                  v-if="isUpdating"
                  name="heroicons:arrow-path"
                  class="animate-spin mr-2"
                  size="16"
                />
                {{ isUpdating ? "Mise à jour..." : "Mettre à jour le projet" }}
              </button>
            </div>
          </div>

          <div
            v-else
            class="text-center py-8"
            :style="{ color: 'var(--text-muted)' }"
          >
            <Icon
              name="heroicons:exclamation-triangle"
              class="w-12 h-12 mx-auto mb-4"
              :style="{ color: 'var(--text-muted)' }"
            />
            <p>Aucun projet sélectionné</p>
          </div>
        </div>

        <!-- Section Général -->
        <div
          class="rounded-lg shadow-sm border p-6"
          :style="{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--bg-border)',
          }"
        >
          <h2
            class="text-lg font-semibold mb-4"
            :style="{ color: 'var(--text-primary)' }"
          >
            Général
          </h2>
          <p :style="{ color: 'var(--text-secondary)' }">
            Paramètres généraux - contenu à venir
          </p>
        </div>

        <!-- Section Version & Informations -->
        <div
          class="rounded-lg shadow-sm border p-6"
          :style="{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--bg-border)',
          }"
        >
          <h2
            class="text-lg font-semibold mb-4"
            :style="{ color: 'var(--text-primary)' }"
          >
            Version & Informations
          </h2>
          <VersionInfo :show-details="true" :show-features="true" />

          <!-- Actions de version -->
          <div
            class="mt-6 pt-4 border-t"
            :style="{ borderColor: 'var(--bg-border)' }"
          >
            <h3
              class="text-sm font-medium mb-3"
              :style="{ color: 'var(--text-primary)' }"
            >
              Actions
            </h3>
            <div class="flex gap-3">
              <button
                @click="checkForUpdates"
                :disabled="checkingUpdates"
                class="px-4 py-2 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: checkingUpdates
                    ? 'var(--text-muted)'
                    : 'var(--accent-primary)',
                }"
              >
                <Icon
                  v-if="checkingUpdates"
                  name="heroicons:arrow-path"
                  class="animate-spin mr-2"
                  size="16"
                />
                {{
                  checkingUpdates
                    ? "Vérification..."
                    : "Vérifier les mises à jour"
                }}
              </button>

              <button
                @click="showVersionDetails = !showVersionDetails"
                class="px-4 py-2 text-sm rounded-lg"
                :style="{
                  backgroundColor: 'var(--button-bg)',
                  borderColor: 'var(--button-border)',
                  color: 'var(--text-primary)',
                }"
              >
                {{ showVersionDetails ? "Masquer" : "Voir" }} les détails
              </button>
            </div>
          </div>

          <!-- Détails techniques -->
          <div
            v-if="showVersionDetails"
            class="mt-4 p-4 rounded-lg"
            :style="{ backgroundColor: 'var(--bg-primary)' }"
          >
            <h4
              class="text-sm font-medium mb-2"
              :style="{ color: 'var(--text-primary)' }"
            >
              Détails techniques
            </h4>
            <div
              class="text-xs space-y-1 font-mono"
              :style="{ color: 'var(--text-secondary)' }"
            >
              <div>User Agent: {{ userAgent }}</div>
              <div>Viewport: {{ viewport.width }}x{{ viewport.height }}</div>
              <div>Timezone: {{ timezone }}</div>
              <div>Language: {{ language }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageNavigation from "~/components/common/PageNavigation.vue";
import VersionInfo from "~/components/common/VersionInfo.vue";
import { useProjectsStore } from "~/stores/projects";
import { useNotificationsStore } from "~/stores/notifications";

const projectsStore = useProjectsStore();
const notificationsStore = useNotificationsStore();
const showVersionDetails = ref(false);
const checkingUpdates = ref(false);

// État du projet
const projectName = ref("");
const projectDescription = ref("");
const isUpdating = ref(false);

// Projet actuel
const currentProject = computed(() => projectsStore.currentProject);

// Vérifier s'il y a des changements
const hasChanges = computed(() => {
  if (!currentProject.value) return false;
  return (
    projectName.value !== currentProject.value.name ||
    projectDescription.value !== (currentProject.value.description || "")
  );
});

// Initialiser les valeurs
watch(
  currentProject,
  (project) => {
    if (project) {
      projectName.value = project.name || "";
      projectDescription.value = project.description || "";
    }
  },
  { immediate: true }
);

// Mettre à jour le projet
const updateProject = async () => {
  if (!currentProject.value || !hasChanges.value) return;

  try {
    isUpdating.value = true;

    await projectsStore.updateProjectRemote(
      window._currentUserId,
      currentProject.value.id,
      {
        name: projectName.value,
        description: projectDescription.value,
      }
    );

    // Afficher une notification de succès
    notificationsStore.success("Succès", "Projet mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    notificationsStore.error(
      "Erreur",
      "Erreur lors de la mise à jour du projet"
    );
  } finally {
    isUpdating.value = false;
  }
};

// Informations système
const userAgent = process.client ? navigator.userAgent : "Server";
const viewport = reactive({
  width: process.client ? window.innerWidth : 0,
  height: process.client ? window.innerHeight : 0,
});
const timezone = process.client
  ? Intl.DateTimeFormat().resolvedOptions().timeZone
  : "UTC";
const language = process.client ? navigator.language : "fr-FR";

// Mettre à jour le viewport en temps réel
if (process.client) {
  const updateViewport = () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
  };

  window.addEventListener("resize", updateViewport);
  onUnmounted(() => window.removeEventListener("resize", updateViewport));
}

// Vérifier les mises à jour (simulation)
const checkForUpdates = async () => {
  checkingUpdates.value = true;

  // Simulation d'une vérification
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Ici vous pourriez faire un appel API pour vérifier les mises à jour
  notificationsStore.success(
    "Mise à jour",
    "Vous utilisez la dernière version disponible !"
  );

  checkingUpdates.value = false;
};

definePageMeta({
  layout: "dashboard",
});
</script>
