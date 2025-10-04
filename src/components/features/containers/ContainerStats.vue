<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-gray-400">Container CPU usage</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p v-if="stats.running === 0" class="text-gray-500 italic text-sm">No containers are running.</p>
      <p v-else class="text-2xl font-semibold text-white">{{ stats.cpuUsage }}</p>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-gray-400">Container memory usage</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p v-if="stats.running === 0" class="text-gray-500 italic text-sm">No containers are running.</p>
      <p v-else class="text-2xl font-semibold text-white">{{ stats.memoryUsage }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    validator: (stats) => {
      return typeof stats.total === 'number' &&
             typeof stats.running === 'number' &&
             typeof stats.cpuUsage === 'string' &&
             typeof stats.memoryUsage === 'string'
    }
  }
})
</script>