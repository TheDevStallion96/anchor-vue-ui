<template>
  <footer class="bg-gray-950 px-6 py-2 flex items-center justify-between text-sm text-gray-400 border-t border-gray-800">
    <EngineSystemStatus />
    <HostSystemStats />
    <AppVersion />
  </footer>
</template>

<script setup>
import EngineSystemStatus from './components/footer/EngineSystemStatus.vue'
import HostSystemStats from './components/footer/HostSystemStats.vue'
import AppVersion from './components/footer/AppVersion.vue'
</script>