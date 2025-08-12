<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        />
        
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-4"
        >
          <div
            v-if="isOpen"
            ref="modalRef"
            class="relative w-full max-w-md mx-auto rounded-xl shadow-2xl border"
            :class="contentClass"
            style="background-color: var(--bg-surface); border-color: var(--bg-border);"
            @click.stop
            role="dialog"
            :aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            tabindex="-1"
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b" style="border-color: var(--bg-border);">
              <slot name="header">
                <h2 v-if="title" :id="titleId" class="text-lg font-semibold" style="color: var(--text-primary);">
                  {{ title }}
                </h2>
              </slot>
              <button
                @click="$emit('close')"
                class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style="background-color: var(--bg-surface); border: 1px solid var(--bg-border);"
                :title="t('modal.close')"
                :aria-label="t('modal.close')"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t" style="border-color: var(--bg-border);">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  contentClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'update:isOpen'])

// Références
const modalRef = ref(null)

// Générer des IDs uniques pour l'accessibilité
const titleId = ref(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = ref(`modal-description-${Math.random().toString(36).substr(2, 9)}`)

// Gérer le scroll du body
const originalOverflow = ref('')
const originalPaddingRight = ref('')

const blockScroll = () => {
  if (typeof document !== 'undefined') {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    originalOverflow.value = document.body.style.overflow
    originalPaddingRight.value = document.body.style.paddingRight
    
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }
}

const restoreScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = originalOverflow.value
    document.body.style.paddingRight = originalPaddingRight.value
  }
}

// Gérer la fermeture avec la touche Escape
const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.isOpen) {
    close()
  }
}

// Gérer le clic sur le backdrop
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Fermer le modal
const close = () => {
  emit('close')
  emit('update:isOpen', false)
}

// Surveiller l'état d'ouverture
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    blockScroll()
    nextTick(() => {
      // Focus sur le modal
      if (modalRef.value) {
        modalRef.value.focus()
      }
    })
  } else {
    restoreScroll()
  }
})

// Gérer les événements clavier
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleEscape)
    restoreScroll()
  }
})
</script>

<style scoped>
/* Styles pour empêcher le scroll sur le body quand le modal est ouvert */
:deep(body.modal-open) {
  overflow: hidden;
}
</style>
