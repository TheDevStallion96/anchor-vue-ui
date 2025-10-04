<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="text-2xl font-bold text-blue-600">
            MyApp
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="text-gray-700 hover:text-blue-600 transition font-medium"
            active-class="text-blue-600"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          @click="closeMobileMenu"
          class="block py-2 text-gray-700 hover:text-blue-600 transition font-medium"
          active-class="text-blue-600"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { NAVIGATION_ITEMS } from '@/utils/constants'

const navigation = NAVIGATION_ITEMS
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>