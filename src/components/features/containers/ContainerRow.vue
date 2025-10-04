<template>
  <tr 
    class="border-b border-gray-700 hover:bg-gray-750 transition-colors"
    :class="{ 'bg-blue-900/20': selected }"
  >
    <!-- Selection Checkbox -->
    <td class="p-4">
      <input 
        type="checkbox" 
        class="rounded bg-gray-700 border-gray-600"
        :checked="selected"
        @change="$emit('select')"
      >
    </td>
    
    <!-- Container Name with Status Indicator -->
    <td class="p-4">
      <ContainerDetails 
        :container="container"
        :expanded="expanded"
        @toggle-expanded="expanded = !expanded"
      />
    </td>
    
    <!-- Container ID -->
    <td class="p-4">
      <div class="flex items-center gap-2">
        <code class="text-gray-400 font-mono text-sm">{{ shortId }}</code>
        <button 
          @click="copyToClipboard(container.id)"
          class="text-gray-500 hover:text-gray-300 transition-colors"
          title="Copy full ID"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
      </div>
    </td>
    
    <!-- Image -->
    <td class="p-4">
      <div class="flex items-center gap-2">
        <span class="text-gray-400">{{ imageName }}</span>
        <span v-if="imageTag" class="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
          {{ imageTag }}
        </span>
      </div>
    </td>
    
    <!-- Status -->
    <td class="p-4">
      <span :class="containerUtils.getStatusBadgeClasses(container.status)">
        {{ container.status }}
      </span>
      <div v-if="expanded && container.state" class="text-xs text-gray-500 mt-1">
        {{ containerUtils.formatUptime(container.state) }}
      </div>
    </td>
    
    <!-- Ports -->
    <td class="p-4">
      <div class="space-y-1">
        <div 
          v-for="port in formattedPorts" 
          :key="port"
          class="text-gray-400 text-sm font-mono"
        >
          {{ port }}
        </div>
        <span v-if="!formattedPorts.length" class="text-gray-600 text-sm">-</span>
      </div>
    </td>
    
    <!-- Created Date -->
    <td class="p-4">
      <div class="text-gray-400 text-sm">
        {{ containerUtils.formatDate(container.created) }}
      </div>
      <div v-if="expanded" class="text-xs text-gray-500 mt-1">
        {{ containerUtils.formatRelativeTime(container.created) }}
      </div>
    </td>
    
    <!-- Actions -->
    <td class="p-4">
      <ContainerActions
        :container="container"
        :loading="actionLoading"
        @view-logs="$emit('view-logs')"
        @start="$emit('start')"
        @stop="$emit('stop')"
        @inspect="$emit('inspect')"
        @remove="$emit('remove')"
      />
    </td>
  </tr>
</template>

<script setup>
import { ref, computed } from 'vue'
import { containerUtils } from '@/utils/containerUtils'
import ContainerDetails from './ContainerDetails.vue'
import ContainerActions from './ContainerActions.vue'

const props = defineProps({
  container: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  actionLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'select',
  'start',
  'stop', 
  'remove',
  'view-logs',
  'inspect'
])

// Local state
const expanded = ref(false)

// Computed properties - now only need the ones used in this component

const shortId = computed(() => {
  return props.container.id.substring(0, 12)
})

const imageName = computed(() => {
  return containerUtils.getImageName(props.container.image)
})

const imageTag = computed(() => {
  return containerUtils.getImageTag(props.container.image)
})

const formattedPorts = computed(() => {
  const ports = containerUtils.getContainerPorts(props.container)
  return ports ? ports.split(', ').filter(Boolean) : []
})

// Methods
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // TODO: Show toast notification
  } catch (err) {
    console.warn('Failed to copy to clipboard:', err)
  }
}
</script>