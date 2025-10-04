<template>
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-2">
      <h1 class="text-2xl font-semibold text-white">Containers</h1>
      <button 
        @click="$emit('test-connection')"
        class="ml-4 text-green-400 hover:text-green-300 p-2 rounded transition-colors"
        title="Test Docker API connection"
        :disabled="loading"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
        </svg>
      </button>
      <button 
        @click="$emit('refresh')"
        class="text-blue-400 hover:text-blue-300 p-2 rounded transition-colors"
        title="Refresh containers"
        :disabled="loading"
      >
        <svg 
          class="w-5 h-5" 
          :class="{ 'animate-spin': loading }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'test-connection',
  'refresh'
])
</script>