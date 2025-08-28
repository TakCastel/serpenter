<template>
  <div v-if="ressources && ressources.length > 0" class="space-y-3">
    <h4
      class="text-lg font-semibold transition-colors duration-200"
      style="color: var(--accent-primary)"
    >
      {{ $t("items.details.ressources") }}
    </h4>
    <div class="space-y-3">
      <a
        v-for="ressource in ressources"
        :key="ressource.url"
        :href="ressource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:bg-opacity-80"
        style="
          background-color: var(--bg-surface);
          border: 1px solid var(--bg-border);
        "
        :title="ressource.title"
      >
        <Icon
          name="heroicons:arrow-top-right-on-square"
          class="w-5 h-5 flex-shrink-0 transition-colors duration-200"
          style="color: var(--accent-primary)"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0">
          <div
            class="font-medium transition-colors duration-200"
            style="color: var(--text-primary)"
          >
            {{ ressource.titleKey ? $t(ressource.titleKey) : ressource.title }}
          </div>
          <div
            class="text-sm transition-colors durée-200"
            style="color: var(--text-muted)"
          >
            {{
              ressource.descriptionKey
                ? $t(ressource.descriptionKey)
                : ressource.description
            }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ressources: {
    type: Array,
    default: () => [],
  },
});
</script>
