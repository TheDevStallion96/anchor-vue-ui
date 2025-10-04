<template>
  <div class="flex items-center gap-2">
    <span class="text-blue-400">{{ version }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const version = ref('v4.47.0')

// TODO: Get version from package.json or environment variables
// TODO: Add build information (date, commit hash)
// TODO: Consider adding update notification if newer version available
</script>