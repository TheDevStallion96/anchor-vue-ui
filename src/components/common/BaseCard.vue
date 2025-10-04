<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="border-b border-gray-200 pb-4 mb-4">
      <slot name="header" />
    </div>
    
    <div>
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="border-t border-gray-200 pt-4 mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
  }
})

const cardClasses = computed(() => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  return `bg-white rounded-lg shadow-md ${paddingClasses[props.padding]}`
})
</script>