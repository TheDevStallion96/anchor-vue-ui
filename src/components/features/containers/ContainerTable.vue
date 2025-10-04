<template>
  <div v-if="!loading || containers.length > 0" class="bg-gray-800 rounded-lg overflow-hidden">
    <table class="w-full">
      <!-- Table Header -->
      <thead class="bg-gray-850 border-b border-gray-700">
        <tr class="text-left text-gray-400 text-sm">
          <th class="p-4 w-12">
            <input 
              type="checkbox" 
              class="rounded bg-gray-700 border-gray-600"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleSelectAll"
            >
          </th>
          <th class="p-4">Name</th>
          <th class="p-4">Container ID</th>
          <th class="p-4">Image</th>
          <th class="p-4">Status</th>
          <th class="p-4">Port(s)</th>
          <th class="p-4">Created</th>
          <th class="p-4">Actions</th>
        </tr>
      </thead>
      
      <!-- Table Body -->
      <tbody>
        <!-- Empty State -->
        <tr v-if="containers.length === 0 && !loading">
          <td colspan="8" class="p-8 text-center text-gray-500">
            <div class="flex flex-col items-center gap-2">
              <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span>{{ emptyMessage || 'No containers found.' }}</span>
              <p class="text-sm text-gray-600 mt-1">
                {{ searchQuery ? 'Try adjusting your search criteria' : 'Start a container to see it here' }}
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Container Rows -->
        <ContainerRow
          v-for="container in containers"
          :key="container.id"
          :container="container"
          :selected="selectedContainers.has(container.id)"
          :action-loading="actionLoading"
          @select="toggleSelect(container.id)"
          @start="$emit('start-container', container)"
          @stop="$emit('stop-container', container)"
          @remove="$emit('remove-container', container)"
          @view-logs="$emit('view-logs', container)"
          @inspect="$emit('inspect-container', container)"
        />
      </tbody>
    </table>
    
    <!-- Bulk Actions Bar -->
    <div 
      v-if="selectedContainers.size > 0"
      class="bg-gray-750 border-t border-gray-700 p-4 flex items-center justify-between"
    >
      <div class="flex items-center gap-2 text-gray-300">
        <span>{{ selectedContainers.size }} container{{ selectedContainers.size > 1 ? 's' : '' }} selected</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          @click="$emit('bulk-start', Array.from(selectedContainers))"
          class="text-green-400 hover:text-green-300 px-3 py-1 rounded transition-colors"
          :disabled="actionLoading"
        >
          Start All
        </button>
        <button 
          @click="$emit('bulk-stop', Array.from(selectedContainers))"
          class="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded transition-colors"
          :disabled="actionLoading"
        >
          Stop All
        </button>
        <button 
          @click="$emit('bulk-remove', Array.from(selectedContainers))"
          class="text-red-400 hover:text-red-300 px-3 py-1 rounded transition-colors"
          :disabled="actionLoading"
        >
          Remove All
        </button>
        <button 
          @click="clearSelection"
          class="text-gray-400 hover:text-white px-3 py-1 rounded transition-colors"
        >
          Clear Selection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ContainerRow from './ContainerRow.vue'

const props = defineProps({
  containers: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  actionLoading: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  },
  emptyMessage: {
    type: String,
    default: ''
  }
})

defineEmits([
  'start-container',
  'stop-container', 
  'remove-container',
  'view-logs',
  'inspect-container',
  'bulk-start',
  'bulk-stop',
  'bulk-remove'
])

// Selection state
const selectedContainers = ref(new Set())

// Selection computed properties
const allSelected = computed(() => {
  return props.containers.length > 0 && selectedContainers.value.size === props.containers.length
})

const someSelected = computed(() => {
  return selectedContainers.value.size > 0 && selectedContainers.value.size < props.containers.length
})

// Selection methods
const toggleSelect = (containerId) => {
  if (selectedContainers.value.has(containerId)) {
    selectedContainers.value.delete(containerId)
  } else {
    selectedContainers.value.add(containerId)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedContainers.value.clear()
  } else {
    selectedContainers.value = new Set(props.containers.map(c => c.id))
  }
}

const clearSelection = () => {
  selectedContainers.value.clear()
}
</script>