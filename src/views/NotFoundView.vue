<template>
  <AppLayout>
    <div class="flex items-center justify-center min-h-[60vh]">
      <BaseCard padding="lg" class="text-center max-w-md">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-6">Page not found</p>
        <BaseButton @click="goHome">Go Home</BaseButton>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>