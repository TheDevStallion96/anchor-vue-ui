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
      <ContainerSearch
        v-if="!containersStore.loading || containersStore.containers.length > 0"
        v-model="containersStore.searchQuery"
        :filtered-count="containersStore.filteredContainers.length"
        :total-count="containersStore.containers.length"
        class="mb-8"
      />

      <!-- Table -->
      <div v-if="!containersStore.loading || containersStore.containers.length > 0" class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-850 border-b border-gray-700">
            <tr class="text-left text-gray-400 text-sm">
              <th class="p-4 w-12">
                <input type="checkbox" class="rounded bg-gray-700 border-gray-600">
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
          <tbody>
            <tr v-if="containersStore.filteredContainers.length === 0 && !containersStore.loading">
              <td colspan="8" class="p-8 text-center text-gray-500">
                {{ containersStore.searchQuery ? 'No containers match your search.' : 'No containers found.' }}
              </td>
            </tr>
            <tr 
              v-for="container in sortedContainers" 
              :key="container.id"
              class="border-b border-gray-700 hover:bg-gray-750"
            >
              <td class="p-4">
                <input type="checkbox" class="rounded bg-gray-700 border-gray-600">
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button class="text-gray-400 hover:text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <div :class="containerUtils.getStatusIndicator(container.status)"></div>
                  <span class="text-white">{{ containersStore.getContainerName(container) }}</span>
                </div>
              </td>
              <td class="p-4 text-gray-400 font-mono text-sm">{{ container.id.substring(0, 12) }}</td>
              <td class="p-4 text-gray-400">{{ containerUtils.getImageName(container.image) }}</td>
              <td class="p-4">
                <span :class="containerUtils.getStatusBadgeClasses(container.status)">
                  {{ container.status }}
                </span>
              </td>
              <td class="p-4 text-gray-400">{{ containerUtils.getContainerPorts(container) }}</td>
              <td class="p-4 text-gray-400 text-sm">{{ containerUtils.formatDate(container.created) }}</td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button 
                    class="text-gray-400 hover:text-white p-1" 
                    title="View logs"
                    @click="viewLogs(container)"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="containerUtils.canPerformAction(container, 'start')"
                    class="text-green-400 hover:text-green-300 p-1" 
                    title="Start container"
                    @click="handleStartContainer(container)"
                    :disabled="actionLoading"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="containerUtils.canPerformAction(container, 'stop')"
                    class="text-yellow-400 hover:text-yellow-300 p-1" 
                    title="Stop container"
                    @click="handleStopContainer(container)"
                    :disabled="actionLoading"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
                    </svg>
                  </button>
                  <button class="text-gray-400 hover:text-white p-1" title="More options">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="containerUtils.canPerformAction(container, 'remove')"
                    class="text-red-400 hover:text-red-300 p-1" 
                    title="Remove container"
                    @click="handleRemoveContainer(container)"
                    :disabled="actionLoading"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContainersStore } from '@/stores/containers'
import { containerUtils, notificationUtils } from '@/utils/containerUtils'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ContainerStats from '@/components/features/containers/ContainerStats.vue'
import ContainerSearch from '@/components/features/containers/ContainerSearch.vue'

// Store
const containersStore = useContainersStore()

// Local state for action loading
const actionLoading = ref(false)

// Computed properties
const sortedContainers = computed(() => {
  return containerUtils.sortContainers(containersStore.filteredContainers)
})

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

// Lifecycle
onMounted(() => {
  containersStore.fetchContainers()
})
</script>