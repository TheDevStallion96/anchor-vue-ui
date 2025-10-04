<template>
  <section class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-5xl font-bold mb-6">Welcome to MyApp</h1>
      <p class="text-xl mb-8 text-blue-100">
        A modern Vue.js application with best practices
      </p>
      <div class="flex justify-center gap-4">
        <BaseButton @click="handleGetStarted">
          Get Started
        </BaseButton>
        <BaseButton variant="secondary" @click="handleLearnMore">
          Learn More
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const handleGetStarted = () => {
  console.log('Get started clicked')
}

const handleLearnMore = () => {
  router.push('/about')
}
</script>