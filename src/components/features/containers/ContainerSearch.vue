<template>
  <div class="flex items-center gap-4">
    <div class="relative flex-1 max-w-md">
      <input 
        type="text" 
        placeholder="Search containers..." 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    
    <div class="text-sm text-gray-400">
      {{ filteredCount }} of {{ totalCount }} containers
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  filteredCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>