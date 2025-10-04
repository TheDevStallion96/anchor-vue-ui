<template>
  <AppLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-semibold text-white">Volumes</h1>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-8 text-center">
        <IconVolumes class="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-300 mb-2">Volumes</h2>
        <p class="text-gray-500">Docker volumes management will be available here.</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import IconVolumes from '@/components/icons/IconVolumes.vue'
</script>