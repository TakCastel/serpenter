<template>
  <div>
    <!-- Bouton pour ouvrir le modal -->
    <button
      @click="isModalOpen = true"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
    >
      Ouvrir le modal
    </button>

    <!-- Modal -->
    <Modal
      v-model:is-open="isModalOpen"
      title="Exemple de modal"
      @close="handleClose"
    >
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Ceci est un exemple de contenu pour le modal. Le scroll derrière est bloqué automatiquement.
      </p>
      
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 class="font-semibold mb-2">Fonctionnalités :</h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Blocage automatique du scroll</li>
            <li>Fermeture avec Escape</li>
            <li>Fermeture en cliquant sur le backdrop</li>
            <li>Transitions fluides</li>
            <li>Accessibilité complète</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <button
          @click="isModalOpen = false"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Fermer
        </button>
        <button
          @click="handleAction"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Action
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

const isModalOpen = ref(false)

const handleClose = () => {
  // Modal fermé
}

const handleAction = () => {
  // Action effectuée
  isModalOpen.value = false
}
</script>

