<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <input 
          type="text" 
          placeholder="Search containers... (try: id:abc123, image:nginx, status:running, port:8080)" 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full bg-gray-800 text-white placeholder-gray-500 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <div class="absolute right-3 top-2.5 flex items-center gap-1">
          <button 
            v-if="modelValue"
            @click="$emit('update:modelValue', '')"
            class="text-gray-400 hover:text-white"
            title="Clear search"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Results Count -->
      <div class="text-sm text-gray-400 min-w-fit">
        {{ filteredCount }} of {{ totalCount }} containers
      </div>

      <!-- Toggle Advanced Filters -->
      <button 
        @click="showAdvanced = !showAdvanced"
        class="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-3 py-2 rounded transition-colors"
        :class="{ 'bg-blue-900/20': showAdvanced }"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
        </svg>
        Filters
        <svg 
          class="w-4 h-4 transition-transform" 
          :class="{ 'rotate-180': showAdvanced }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <!-- Advanced Filters -->
    <ContainerAdvancedFilters
      v-if="showAdvanced"
      :status-filter="statusFilter"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @update:status-filter="$emit('update:status-filter', $event)"
      @update:sort-by="$emit('update:sort-by', $event)"
      @toggle-sort-order="$emit('toggle-sort-order')"
      @clear-filters="$emit('clear-filters')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ContainerAdvancedFilters from './ContainerAdvancedFilters.vue'

const showAdvanced = ref(false)

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
  },
  statusFilter: {
    type: String,
    default: 'all'
  },
  sortBy: {
    type: String,
    default: 'status'
  },
  sortOrder: {
    type: String,
    default: 'asc'
  }
})

defineEmits([
  'update:modelValue',
  'update:status-filter', 
  'update:sort-by',
  'toggle-sort-order',
  'clear-filters'
])
</script>