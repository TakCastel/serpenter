<template>
  <div class="version-info">
    <!-- Version badge simple -->
    <div v-if="simple" class="inline-flex items-center gap-1 text-xs">
      <span class="text-gray-500">v</span>
      <span :class="getVersionColor()">{{ getVersionString() }}</span>
      <span v-if="!flags.isProduction" :class="getVersionColor()" class="font-medium">
        {{ getVersionBadge() }}
      </span>
    </div>
    
    <!-- Version détaillée -->
    <div v-else class="space-y-2">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-sm">{{ name }}</h3>
        <span class="text-xs px-2 py-1 rounded-full" :class="getBadgeClasses()">
          v{{ version }} {{ getVersionBadge() }}
        </span>
      </div>
      
      <div v-if="showDetails" class="text-xs text-gray-600 space-y-1">
        <div>Build: {{ buildHash.slice(0, 7) }}</div>
        <div>Date: {{ formatBuildDate() }}</div>
        <div>Env: {{ buildEnv }}</div>
      </div>
      
      <!-- Features disponibles -->
      <div v-if="showFeatures" class="text-xs space-y-1">
        <div class="font-medium text-gray-700">Fonctionnalités:</div>
        <div class="grid grid-cols-2 gap-1">
          <div class="flex items-center gap-1">
            <Icon :name="flags.hasLighthouse ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                  :class="flags.hasLighthouse ? 'text-green-500' : 'text-gray-400'" 
                  size="12" />
            <span>Lighthouse</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon :name="flags.hasSecurityScan ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                  :class="flags.hasSecurityScan ? 'text-green-500' : 'text-gray-400'" 
                  size="12" />
            <span>Security Scan</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon :name="flags.hasAdvancedAnalytics ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                  :class="flags.hasAdvancedAnalytics ? 'text-green-500' : 'text-gray-400'" 
                  size="12" />
            <span>Analytics</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon :name="flags.hasBetaFeatures ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                  :class="flags.hasBetaFeatures ? 'text-green-500' : 'text-gray-400'" 
                  size="12" />
            <span>Beta Features</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  simple?: boolean
  showDetails?: boolean
  showFeatures?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  simple: false,
  showDetails: false,
  showFeatures: false
})

const { 
  version, 
  name, 
  buildHash, 
  buildDate, 
  buildEnv, 
  flags,
  getVersionString,
  getVersionBadge,
  getVersionColor
} = useVersion()

const getBadgeClasses = () => {
  const baseClasses = 'text-xs font-medium'
  
  if (flags.isAlpha) return `${baseClasses} bg-red-100 text-red-800`
  if (flags.isBeta) return `${baseClasses} bg-yellow-100 text-yellow-800`
  if (flags.isStable) return `${baseClasses} bg-green-100 text-green-800`
  return `${baseClasses} bg-gray-100 text-gray-800`
}

const formatBuildDate = () => {
  return new Date(buildDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
