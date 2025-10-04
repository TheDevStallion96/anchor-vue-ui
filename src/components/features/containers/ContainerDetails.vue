<template>
  <div class="flex items-center gap-3">
    <!-- Expand/Collapse Toggle -->
    <button 
      @click="$emit('toggle-expanded')"
      class="text-gray-400 hover:text-white transition-colors"
      :class="{ 'rotate-90': expanded }"
    >
      <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
    
    <!-- Status Indicator -->
    <div :class="containerUtils.getStatusIndicator(container.status)"></div>
    
    <!-- Container Name and Details -->
    <div class="flex flex-col">
      <span class="text-white font-medium">{{ containerName }}</span>
      <span v-if="expanded" class="text-xs text-gray-500 mt-1">
        ID: {{ container.id }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { containerUtils } from '@/utils/containerUtils'

const props = defineProps({
  container: {
    type: Object,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'toggle-expanded'
])

const containerName = computed(() => {
  return containerUtils.getContainerName(props.container)
})
</script>