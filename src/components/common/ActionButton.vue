<template>
  <button 
    :class="[
      'p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 focus:ring-blue-500'
    ]"
    :disabled="disabled"
    :title="tooltip"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>