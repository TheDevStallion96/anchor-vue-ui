<template>
  <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
    <div class="flex items-center gap-2 text-red-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="font-semibold">{{ title }}</span>
    </div>
    <p class="text-red-300 mt-2">{{ message }}</p>
    <div v-if="showRetry" class="mt-3">
      <button 
        @click="$emit('retry')"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        :disabled="loading"
      >
        {{ loading ? 'Retrying...' : 'Retry' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Error'
  },
  message: {
    type: String,
    required: true
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>