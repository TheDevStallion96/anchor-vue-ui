<template>
  <div class="bg-gray-800/50 rounded-lg p-4 space-y-4 border border-gray-700">
    <div class="flex items-center justify-between">
      <h3 class="text-white font-medium">Advanced Filters</h3>
      <button 
        @click="$emit('clear-filters')"
        class="text-gray-400 hover:text-white text-sm"
      >
        Clear All
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select 
          :value="statusFilter"
          @change="$emit('update:status-filter', $event.target.value)"
          class="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
          <option value="exited">Exited</option>
          <option value="created">Created</option>
          <option value="paused">Paused</option>
          <option value="restarting">Restarting</option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
        <select 
          :value="sortBy"
          @change="$emit('update:sort-by', $event.target.value)"
          class="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="status">Status</option>
          <option value="name">Name</option>
          <option value="created">Created Date</option>
          <option value="image">Image</option>
        </select>
      </div>

      <!-- Sort Order -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
        <button 
          @click="$emit('toggle-sort-order')"
          class="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
        >
          <span>{{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}</span>
          <svg 
            class="w-4 h-4 transition-transform" 
            :class="{ 'rotate-180': sortOrder === 'desc' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Syntax Help -->
    <ContainerSearchHelp />
  </div>
</template>

<script setup>
import ContainerSearchHelp from './ContainerSearchHelp.vue'

defineProps({
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
  'update:status-filter', 
  'update:sort-by',
  'toggle-sort-order',
  'clear-filters'
])
</script>