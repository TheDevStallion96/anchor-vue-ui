<template>
  <div v-if="!loading || containers.length > 0" class="bg-gray-800 rounded-lg overflow-hidden">
    <table class="w-full">
      <!-- Table Header -->
      <ContainerTableHeader 
        :all-selected="allSelected"
        :some-selected="someSelected"
        @toggle-select-all="toggleSelectAll"
      />
      
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
    <ContainerBulkActions
      :selected-count="selectedContainers.size"
      :loading="actionLoading"
      @bulk-start="$emit('bulk-start', Array.from(selectedContainers))"
      @bulk-stop="$emit('bulk-stop', Array.from(selectedContainers))"
      @bulk-remove="$emit('bulk-remove', Array.from(selectedContainers))"
      @clear-selection="clearSelection"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ContainerRow from './ContainerRow.vue'
import ContainerTableHeader from './ContainerTableHeader.vue'
import ContainerBulkActions from './ContainerBulkActions.vue'

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