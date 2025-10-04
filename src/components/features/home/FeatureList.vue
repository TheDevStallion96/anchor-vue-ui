<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BaseCard v-for="feature in features" :key="feature.id">
          <template #header>
            <h3 class="text-xl font-semibold text-gray-800">{{ feature.title }}</h3>
          </template>
          <p class="text-gray-600">{{ feature.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const features = ref([
  {
    id: 1,
    title: 'Vue Router',
    description: 'Seamless navigation with Vue Router for building single-page applications.'
  },
  {
    id: 2,
    title: 'Tailwind CSS',
    description: 'Beautiful, responsive designs with utility-first CSS framework.'
  },
  {
    id: 3,
    title: 'Modular Architecture',
    description: 'Clean, maintainable code following Vue.js best practices.'
  }
])
</script>