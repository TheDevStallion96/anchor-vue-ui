import { ref, computed } from 'vue'
import { useDockerApi } from './useDockerApi'

/**
 * Composable for Docker container operations
 * Handles all container-specific Docker API interactions
 */
export function useDockerContainers() {
  const dockerApi = useDockerApi()
  
  // State
  const containers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const runningContainers = computed(() => 
    containers.value.filter(container => container.status === 'running')
  )

  const stoppedContainers = computed(() => 
    containers.value.filter(container => 
      container.status === 'exited' || container.status === 'stopped'
    )
  )

  const containerStats = computed(() => ({
    total: containers.value.length,
    running: runningContainers.value.length,
    stopped: stoppedContainers.value.length,
    created: containers.value.filter(c => c.status === 'created').length,
    paused: containers.value.filter(c => c.status === 'paused').length,
    restarting: containers.value.filter(c => c.status === 'restarting').length
  }))

  // Container name helper
  const getContainerName = (container) => {
    if (!container) return 'Unknown'
    
    if (container.names && container.names.length > 0) {
      return container.names[0].replace(/^\//, '')
    }
    
    return container.id?.substring(0, 12) || 'Unknown'
  }

  // Core container operations
  const fetchContainers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await dockerApi.getAllContainers()
      containers.value = data || []
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch containers:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getContainerDetails = async (containerId) => {
    try {
      const data = await dockerApi.getContainerDetails(containerId)
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to get container details: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const getContainerLogs = async (containerId, lines = 100) => {
    try {
      const data = await dockerApi.getContainerLogs(containerId, lines)
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to get container logs: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const getContainerStats = async (containerId) => {
    try {
      const data = await dockerApi.getContainerStats(containerId)
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to get container stats: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Container lifecycle operations
  const startContainer = async (containerId) => {
    try {
      await dockerApi.startContainer(containerId)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to start container: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const stopContainer = async (containerId) => {
    try {
      await dockerApi.stopContainer(containerId)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to stop container: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const restartContainer = async (containerId) => {
    try {
      await dockerApi.restartContainer(containerId)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to restart container: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const removeContainer = async (containerId, force = false) => {
    try {
      await dockerApi.removeContainer(containerId, force)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to remove container: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Bulk operations
  const startMultipleContainers = async (containerIds) => {
    const results = await Promise.allSettled(
      containerIds.map(id => startContainer(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    return {
      successful,
      failed,
      total: results.length
    }
  }

  const stopMultipleContainers = async (containerIds) => {
    const results = await Promise.allSettled(
      containerIds.map(id => stopContainer(id))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    return {
      successful,
      failed,
      total: results.length
    }
  }

  const removeMultipleContainers = async (containerIds, force = false) => {
    const results = await Promise.allSettled(
      containerIds.map(id => removeContainer(id, force))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    return {
      successful,
      failed,
      total: results.length
    }
  }

  // Connection testing
  const testConnection = async () => {
    try {
      await dockerApi.testConnection()
      return { success: true }
    } catch (err) {
      const errorMessage = `Connection test failed: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  return {
    // State
    containers,
    loading,
    error,

    // Computed
    runningContainers,
    stoppedContainers,
    containerStats,

    // Helpers
    getContainerName,

    // Operations
    fetchContainers,
    getContainerDetails,
    getContainerLogs,
    getContainerStats,
    startContainer,
    stopContainer,
    restartContainer,
    removeContainer,

    // Bulk operations
    startMultipleContainers,
    stopMultipleContainers,
    removeMultipleContainers,

    // Connection
    testConnection
  }
}