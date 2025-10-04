<template>
  <footer class="bg-gray-950 px-6 py-2 flex items-center justify-between text-sm text-gray-400 border-t border-gray-800">
    <!-- TODO: Extract docker engine status indicator into a separate component layout/components/footer/EngineSystemStatus.vue -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-green-400">Engine running</span>
      </div>
    </div>
    <!-- TODO: Extract host system stats into a separate component layout/components/footer/HostSystemStats.vue -->
    <div class="flex items-center gap-6">
      <span>RAM {{ systemStats.ram }}</span>
      <span>CPU {{ systemStats.cpu }}</span>
      <span>Disk: {{ systemStats.diskUsed }} used (limit {{ systemStats.diskLimit }})</span>
    </div>
    <!-- TODO: Extract platform version info into a separate component layout/components/footer/AppVersion.vue -->
    <div class="flex items-center gap-2">
      <span class="text-blue-400">{{ version }}</span>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const systemStats = ref({
  ram: '0.79 GB',
  cpu: '0.50%',
  diskUsed: '6.44 GB',
  diskLimit: '1006.85 GB'
})

const version = ref('v4.47.0')
</script>