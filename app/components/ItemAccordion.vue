<template>
  <div class="item-accordion">
    <div class="item-content">
      <input
        type="checkbox"
        :id="item.id"
        :checked="isItemChecked"
        @change="toggleItem"
        class="checkbox"
      />
      <div class="item-text">
        <label 
          :for="item.id" 
          class="item-label"
        >
          {{ item.label }}
        </label>
        <p class="item-description">{{ item.description }}</p>
      </div>
      <button 
        @click="toggleAccordion"
        class="accordion-toggle"
        :class="{ 'expanded': isExpanded }"
        :aria-expanded="isExpanded"
        :aria-controls="`accordion-${item.id}`"
      >
        <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
      </button>
    </div>

    <!-- Accordion Content -->
    <div 
      v-show="isExpanded"
      :id="`accordion-${item.id}`"
      class="accordion-content"
      :class="{ 'expanded': isExpanded }"
    >
      <div class="details-container">
        <!-- Explication -->
        <div v-if="item.details?.explication" class="detail-section">
          <h3 class="detail-title">Explication</h3>
          <p class="detail-text">{{ item.details.explication }}</p>
        </div>

        <!-- Exemple -->
        <div v-if="item.details?.exemple" class="detail-section">
          <h3 class="detail-title">Exemple</h3>
          <div class="detail-example">{{ item.details.exemple }}</div>
        </div>

        <!-- Bonnes pratiques -->
        <div v-if="item.details?.bonnesPratiques" class="detail-section">
          <h3 class="detail-title">Bonnes pratiques</h3>
          <ul class="practices-list">
            <li v-for="(practice, index) in item.details.bonnesPratiques" :key="index">
              {{ practice }}
            </li>
          </ul>
        </div>

        <!-- Exemples de code -->
        <div v-if="item.details?.codeExemple" class="detail-section">
          <h3 class="detail-title">Exemples de code</h3>
          <div v-for="(code, language) in item.details.codeExemple" :key="language" class="code-section">
            <div class="code-title">{{ getCodeTitle(language) }}</div>
            <pre class="code-block">{{ code }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  isItemChecked: { type: Boolean, required: true }
})

const emit = defineEmits(['toggle-item'])
const isExpanded = ref(false)

const toggleAccordion = () => {
  isExpanded.value = !isExpanded.value
}

const toggleItem = () => {
  emit('toggle-item', props.item.id)
}

const getCodeTitle = (language) => {
  const titles = {
    'html': 'HTML',
    'vue': 'Vue.js',
    'js': 'JavaScript',
    'css': 'CSS',
    'php': 'PHP',
    'python': 'Python'
  }
  return titles[language] || language.toUpperCase()
}
</script> 