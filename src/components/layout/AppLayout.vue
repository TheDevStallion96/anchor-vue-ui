<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>