<template>
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
      :disabled="loading"
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
      :disabled="loading"
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
      :disabled="loading"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </ActionButton>
  </div>
</template>

<script setup>
import { containerUtils } from '@/utils/containerUtils'
import ActionButton from '@/components/common/ActionButton.vue'

defineProps({
  container: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'start',
  'stop', 
  'remove',
  'view-logs',
  'inspect'
])
</script>