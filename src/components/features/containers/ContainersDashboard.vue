<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-semibold text-white">Containers</h1>
        <button 
          @click="handleTestConnection"
          class="ml-4 text-green-400 hover:text-green-300 p-2 rounded transition-colors"
          title="Test Docker API connection"
          :disabled="containersStore.loading"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
          </svg>
        </button>
        <button 
          @click="containersStore.fetchContainers"
          class="text-blue-400 hover:text-blue-300 p-2 rounded transition-colors"
          title="Refresh containers"
          :disabled="containersStore.loading"
        >
          <svg 
            class="w-5 h-5" 
            :class="{ 'animate-spin': containersStore.loading }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner 
      v-if="containersStore.loading && containersStore.containers.length === 0" 
      message="Loading containers..."
    />

    <!-- Error State -->
    <ErrorAlert
      v-else-if="containersStore.error"
      title="Error loading containers"
      :message="containersStore.error"
      :show-retry="true"
      :loading="containersStore.loading"
      @retry="containersStore.fetchContainers"
    />

    <!-- Main Content -->
    <template v-else>
      <!-- Stats Cards -->
      <ContainerStats :stats="containersStore.containerStats" class="mb-8" />

      <!-- Search and Filters -->
          <!-- Search -->
    <ContainerSearch 
      v-model="containersStore.searchQuery" 
      :filtered-count="containersStore.filteredContainers.length"
      :total-count="containersStore.containers.length"
      :status-filter="containersStore.statusFilter"
      :sort-by="containersStore.sortBy"
      :sort-order="containersStore.sortOrder"
      @update:status-filter="containersStore.setStatusFilter"
      @update:sort-by="containersStore.setSortBy"
      @toggle-sort-order="containersStore.toggleSortOrder"
      @clear-filters="containersStore.clearFilters"
    />

      <!-- Container Table -->
      <ContainerTable
        :containers="containersStore.filteredContainers"
        :loading="containersStore.loading"
        :action-loading="actionLoading"
        :search-query="containersStore.searchQuery"
        :empty-message="containersStore.searchQuery ? 'No containers match your search.' : 'No containers found.'"
        @start-container="handleStartContainer"
        @stop-container="handleStopContainer"
        @remove-container="handleRemoveContainer"
        @view-logs="viewLogs"
        @inspect-container="inspectContainer"
        @bulk-start="handleBulkStart"
        @bulk-stop="handleBulkStop"
        @bulk-remove="handleBulkRemove"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContainersStore } from '@/stores/containers'
import { containerUtils, notificationUtils } from '@/utils/containerUtils'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ContainerStats from '@/components/features/containers/ContainerStats.vue'
import ContainerSearch from '@/components/features/containers/ContainerSearch.vue'
import ContainerTable from '@/components/features/containers/ContainerTable.vue'

// Store
const containersStore = useContainersStore()

// Local state for action loading
const actionLoading = ref(false)

// Action handlers with improved error handling and user feedback
const handleTestConnection = async () => {
  const result = await containersStore.testConnection()
  if (result.success) {
    notificationUtils.success('Docker API connection successful!')
  } else {
    notificationUtils.error(`Connection test failed: ${result.error}`)
  }
}

const handleStartContainer = async (container) => {
  actionLoading.value = true
  try {
    const result = await containersStore.startContainer(container.id)
    if (result.success) {
      notificationUtils.success(`Started container: ${containersStore.getContainerName(container)}`)
    } else {
      notificationUtils.error(`Failed to start container: ${result.error}`)
    }
  } finally {
    actionLoading.value = false
  }
}

const handleStopContainer = async (container) => {
  actionLoading.value = true
  try {
    const result = await containersStore.stopContainer(container.id)
    if (result.success) {
      notificationUtils.success(`Stopped container: ${containersStore.getContainerName(container)}`)
    } else {
      notificationUtils.error(`Failed to stop container: ${result.error}`)
    }
  } finally {
    actionLoading.value = false
  }
}

const handleRemoveContainer = async (container) => {
  const containerName = containersStore.getContainerName(container)
  
  if (!confirm(`Are you sure you want to remove container "${containerName}"?`)) {
    return
  }

  actionLoading.value = true
  try {
    const result = await containersStore.removeContainer(container.id)
    if (result.success) {
      notificationUtils.success(`Removed container: ${containerName}`)
    } else {
      notificationUtils.error(`Failed to remove container: ${result.error}`)
    }
  } finally {
    actionLoading.value = false
  }
}

const viewLogs = (container) => {
  const containerName = containersStore.getContainerName(container)
  notificationUtils.info(`View logs for: ${containerName}`)
  // TODO: Implement log viewing modal
}

const inspectContainer = (container) => {
  const containerName = containersStore.getContainerName(container)
  notificationUtils.info(`Inspect container: ${containerName}`)
  // TODO: Implement container inspection modal
}

// Bulk action handlers
const handleBulkStart = async (containerIds) => {
  actionLoading.value = true
  try {
    const results = await Promise.allSettled(
      containerIds.map(id => containersStore.startContainer(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    if (successful > 0) {
      notificationUtils.success(`Started ${successful} container${successful > 1 ? 's' : ''}`)
    }
    if (failed > 0) {
      notificationUtils.error(`Failed to start ${failed} container${failed > 1 ? 's' : ''}`)
    }
  } finally {
    actionLoading.value = false
  }
}

const handleBulkStop = async (containerIds) => {
  actionLoading.value = true
  try {
    const results = await Promise.allSettled(
      containerIds.map(id => containersStore.stopContainer(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    if (successful > 0) {
      notificationUtils.success(`Stopped ${successful} container${successful > 1 ? 's' : ''}`)
    }
    if (failed > 0) {
      notificationUtils.error(`Failed to stop ${failed} container${failed > 1 ? 's' : ''}`)
    }
  } finally {
    actionLoading.value = false
  }
}

const handleBulkRemove = async (containerIds) => {
  if (!confirm(`Are you sure you want to remove ${containerIds.length} container${containerIds.length > 1 ? 's' : ''}?`)) {
    return
  }

  actionLoading.value = true
  try {
    const results = await Promise.allSettled(
      containerIds.map(id => containersStore.removeContainer(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    if (successful > 0) {
      notificationUtils.success(`Removed ${successful} container${successful > 1 ? 's' : ''}`)
    }
    if (failed > 0) {
      notificationUtils.error(`Failed to remove ${failed} container${failed > 1 ? 's' : ''}`)
    }
  } finally {
    actionLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  containersStore.fetchContainers()
})
</script>