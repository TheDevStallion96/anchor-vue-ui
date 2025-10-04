<template>
  <header class="bg-blue-900 px-6 py-3 flex items-center justify-between">
    <!-- Header Logo -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold text-lg">{{ APP_NAME }}</span>
      </div>
    </div>
    
    <!-- Header Search -->
    <div class="flex-1 max-w-md mx-8">
      <div class="relative">
        <input 
          type="text" 
          placeholder="Search" 
          v-model="searchQuery"
          class="w-full bg-blue-800 text-white placeholder-blue-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <svg class="w-5 h-5 absolute right-3 top-2.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Header Action Button Group -->
    <div class="flex items-center gap-4">
      <button class="text-white hover:bg-blue-800 p-2 rounded" title="Help">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
      <button class="text-white hover:bg-blue-800 p-2 rounded" title="Notifications">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </button>
      <button class="text-white hover:bg-blue-800 p-2 rounded" title="Settings">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { APP_NAME } from '@/utils/constants'

const searchQuery = ref('')
</script>