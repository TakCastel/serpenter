<template>
  <div class="card" role="region" :aria-label="$t('common.item', { label: item.label })">
    <!-- Item Header -->
    <ItemHeader
      :item="item"
      :is-item-checked="isItemChecked"
      :is-expanded="isExpanded"
      @toggle-accordion="toggleAccordion"
      @toggle-item="toggleItem"
    />

    <!-- Item Details -->
    <ItemDetails
      :item="item"
      :is-expanded="isExpanded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ItemHeader from './ItemHeader.vue'
import ItemDetails from './ItemDetails.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isItemChecked: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-item', 'accordion-opened', 'accordion-closed'])

const isExpanded = ref(false)

const toggleAccordion = () => {
  // Si l'item est cochée, ne pas permettre l'ouverture de l'accordéon
  if (props.isItemChecked) {
    return
  }
  isExpanded.value = !isExpanded.value
  
  // Émettre l'événement approprié
  if (isExpanded.value) {
    emit('accordion-opened', props.item.id)
  } else {
    emit('accordion-closed', props.item.id)
  }
}

const toggleItem = () => {
  const wasChecked = props.isItemChecked
  
  // Si on va cocher l'item, fermer l'accordéon automatiquement
  if (!wasChecked) {
    isExpanded.value = false
  } else {
    // Si on va décocher l'item, ouvrir l'accordéon automatiquement
    isExpanded.value = true
  }
  
  emit('toggle-item', props.item.id)
}

const handleCloseItemAccordion = (event) => {
  if (event.detail.itemId === props.item.id) {
    isExpanded.value = false
  }
}

const handleOpenItemAccordion = (event) => {
  if (event.detail.itemId === props.item.id) {
    isExpanded.value = true
  }
}

// Watcher pour gérer les changements d'état de l'item
watch(() => props.isItemChecked, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Item vient d'être cochée, fermer l'accordéon
    isExpanded.value = false
  } else if (!newValue && oldValue) {
    // Item vient d'être décochée, ouvrir l'accordéon
    isExpanded.value = true
  }
})

onMounted(() => {
  if (process.client) {
    window.addEventListener('close-item-accordion', handleCloseItemAccordion)
    window.addEventListener('open-item-accordion', handleOpenItemAccordion)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('close-item-accordion', handleCloseItemAccordion)
    window.removeEventListener('open-item-accordion', handleOpenItemAccordion)
  }
})
</script> 