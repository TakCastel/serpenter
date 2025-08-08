<template>
  <div 
    :id="`item-details-${item.id}`"
    class="border-t transition-all duration-700 ease-out overflow-hidden"
    style="border-color: var(--bg-border); background-color: var(--bg-primary);"
    :class="{ 'max-h-0 opacity-0': !isExpanded, 'max-h-[10000px] opacity-100': isExpanded }"
    role="region"
    :aria-label="`Détails de ${item.label}`"
  >
    <div class="p-6 space-y-6">
      <!-- Message si pas de détails -->
      <div v-if="!item.details" class="text-center py-8">
        <p class="text-base transition-colors duration-200" style="color: var(--text-muted);">
          {{ $t('items.details.noDetails') }}
        </p>
      </div>
      
      <!-- Explication -->
      <ItemExplication 
        v-if="item.details && item.details.explication"
        :explication="item.details.explication"
      />

      <!-- Comment faire -->
      <ItemCommentFaire 
        v-if="item.details && item.details.commentFaire"
        :comment-faire="item.details.commentFaire"
      />

      <!-- Exemple -->
      <ItemExemple 
        v-if="item.details && item.details.exemple"
        :exemple="item.details.exemple"
      />

      <!-- Bonnes pratiques -->
      <ItemBonnesPratiques 
        v-if="item.details && item.details.bonnesPratiques"
        :bonnes-pratiques="item.details.bonnesPratiques"
      />

      <!-- Ressources -->
      <ItemRessources 
        v-if="item.details && item.details.ressources"
        :ressources="item.details.ressources"
      />

      <!-- Conseils -->
      <ItemConseils 
        v-if="item.details && item.details.conseils"
        :conseils="item.details.conseils"
      />
    </div>
  </div>
</template>

<script setup>
import ItemExplication from './ItemExplication.vue'
import ItemCommentFaire from './ItemCommentFaire.vue'
import ItemExemple from './ItemExemple.vue'
import ItemBonnesPratiques from './ItemBonnesPratiques.vue'
import ItemRessources from './ItemRessources.vue'
import ItemConseils from './ItemConseils.vue'

defineProps({
  item: {
    type: Object,
    required: true
  },
  isExpanded: {
    type: Boolean,
    required: true
  }
})
</script>
