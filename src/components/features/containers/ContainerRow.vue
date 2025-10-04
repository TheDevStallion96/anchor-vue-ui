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
      <div class="flex items-center gap-3">
        <!-- Expand/Collapse Toggle -->
        <button 
          @click="expanded = !expanded"
          class="text-gray-400 hover:text-white transition-colors"
          :class="{ 'rotate-90': expanded }"
        >
          <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Status Indicator -->
        <div :class="containerUtils.getStatusIndicator(container.status)"></div>
        
        <!-- Container Name -->
        <div class="flex flex-col">
          <span class="text-white font-medium">{{ containerName }}</span>
          <span v-if="expanded" class="text-xs text-gray-500 mt-1">
            ID: {{ container.id }}
          </span>
        </div>
      </div>
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
      <div class="flex items-center gap-1">
        <!-- View Logs -->
        <ActionButton
          @click="$emit('view-logs')"
          tooltip="View logs"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </ActionButton>
        
        <!-- Start Container -->
        <ActionButton
          v-if="containerUtils.canPerformAction(container, 'start')"
          @click="$emit('start')"
          tooltip="Start container"
          class="text-green-400 hover:text-green-300"
          :disabled="actionLoading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </ActionButton>
        
        <!-- Stop Container -->
        <ActionButton
          v-if="containerUtils.canPerformAction(container, 'stop')"
          @click="$emit('stop')"
          tooltip="Stop container"
          class="text-yellow-400 hover:text-yellow-300"
          :disabled="actionLoading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
          </svg>
        </ActionButton>
        
        <!-- Inspect Container -->
        <ActionButton
          @click="$emit('inspect')"
          tooltip="Inspect container"
          class="text-blue-400 hover:text-blue-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </ActionButton>
        
        <!-- Remove Container -->
        <ActionButton
          v-if="containerUtils.canPerformAction(container, 'remove')"
          @click="$emit('remove')"
          tooltip="Remove container"
          class="text-red-400 hover:text-red-300"
          :disabled="actionLoading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </ActionButton>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed } from 'vue'
import { containerUtils } from '@/utils/containerUtils'
import ActionButton from '@/components/common/ActionButton.vue'

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

// Computed properties
const containerName = computed(() => {
  return containerUtils.getContainerName(props.container)
})

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