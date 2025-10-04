<template>
  <AppLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-semibold text-white">Kubernetes</h1>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-8 text-center">
        <IconKubernetes class="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-300 mb-2">Kubernetes</h2>
        <p class="text-gray-500">Kubernetes cluster management will be available here.</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import IconKubernetes from '@/components/icons/IconKubernetes.vue'
</script>