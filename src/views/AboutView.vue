<template>
  <AppLayout>
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BaseCard padding="lg">
          <template #header>
            <h1 class="text-4xl font-bold text-gray-800">About Us</h1>
          </template>
          
          <div class="prose max-w-none">
            <p class="text-gray-600 mb-4">
              This is a modular Vue.js application following best practices.
            </p>
            <p class="text-gray-600 mb-6">
              The counter value is: <strong>{{ count }}</strong>
            </p>
            <div class="flex gap-2">
              <BaseButton @click="increment">Increment</BaseButton>
              <BaseButton variant="secondary" @click="decrement">Decrement</BaseButton>
              <BaseButton variant="danger" @click="reset">Reset</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment, decrement, reset } = counterStore
</script>