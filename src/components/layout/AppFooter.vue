<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">MyApp</h3>
          <p class="text-gray-400">Building amazing experiences with Vue.js</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="item in navigation" :key="item.name">
              <RouterLink :to="item.path" class="text-gray-400 hover:text-white transition">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <p class="text-gray-400">info@myapp.com</p>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} MyApp. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { NAVIGATION_ITEMS } from '@/utils/constants'

const navigation = NAVIGATION_ITEMS
const currentYear = computed(() => new Date().getFullYear())
</script>