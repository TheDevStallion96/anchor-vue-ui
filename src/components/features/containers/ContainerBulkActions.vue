<template>
  <div 
    v-if="selectedCount > 0"
    class="bg-gray-750 border-t border-gray-700 p-4 flex items-center justify-between"
  >
    <div class="flex items-center gap-2 text-gray-300">
      <span>{{ selectedCount }} container{{ selectedCount > 1 ? 's' : '' }} selected</span>
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        @click="$emit('bulk-start')"
        class="text-green-400 hover:text-green-300 px-3 py-1 rounded transition-colors"
        :disabled="loading"
      >
        Start All
      </button>
      <button 
        @click="$emit('bulk-stop')"
        class="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded transition-colors"
        :disabled="loading"
      >
        Stop All
      </button>
      <button 
        @click="$emit('bulk-remove')"
        class="text-red-400 hover:text-red-300 px-3 py-1 rounded transition-colors"
        :disabled="loading"
      >
        Remove All
      </button>
      <button 
        @click="$emit('clear-selection')"
        class="text-gray-400 hover:text-white px-3 py-1 rounded transition-colors"
      >
        Clear Selection
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedCount: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'bulk-start',
  'bulk-stop',
  'bulk-remove',
  'clear-selection'
])
</script>