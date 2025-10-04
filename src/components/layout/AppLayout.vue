<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <AppHeader />
    
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar />
      
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
</script>