import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDockerApi } from '@/composables/useDockerApi'

export const useContainersStore = defineStore('containers', () => {
  // State
  const containers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // Docker API
  const dockerApi = useDockerApi()

  // Getters (computed)
  const filteredContainers = computed(() => {
    if (!searchQuery.value) return containers.value
    
    const query = searchQuery.value.toLowerCase()
    return containers.value.filter(container => {
      const name = getContainerName(container).toLowerCase()
      const image = container.image?.toLowerCase() || ''
      const id = container.id?.toLowerCase() || ''
      
      return name.includes(query) || image.includes(query) || id.includes(query)
    })
  })

  const runningContainers = computed(() => {
    return containers.value.filter(container => container.status === 'running')
  })

  const containerStats = computed(() => ({
    total: containers.value.length,
    running: runningContainers.value.length,
    stopped: containers.value.filter(c => c.status === 'exited' || c.status === 'stopped').length,
    cpuUsage: '2.5%', // TODO: Implement real stats
    memoryUsage: '512 MB' // TODO: Implement real stats
  }))

  // Helper function (moved from component)
  const getContainerName = (container) => {
    if (container.name) {
      return container.name
    }
    return container.id?.substring(0, 12) || 'Unknown'
  }

  // Actions
  const fetchContainers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await dockerApi.getAllContainers()
      containers.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch containers:', err)
    } finally {
      loading.value = false
    }
  }

  const startContainer = async (containerId) => {
    try {
      await dockerApi.startContainer(containerId)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      error.value = `Failed to start container: ${err.message}`
      return { success: false, error: err.message }
    }
  }

  const stopContainer = async (containerId) => {
    try {
      await dockerApi.stopContainer(containerId)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      error.value = `Failed to stop container: ${err.message}`
      return { success: false, error: err.message }
    }
  }

  const removeContainer = async (containerId, force = false) => {
    try {
      await dockerApi.removeContainer(containerId, force)
      await fetchContainers() // Refresh list
      return { success: true }
    } catch (err) {
      error.value = `Failed to remove container: ${err.message}`
      return { success: false, error: err.message }
    }
  }

  const testConnection = async () => {
    try {
      await dockerApi.testConnection()
      return { success: true }
    } catch (err) {
      error.value = `Connection test failed: ${err.message}`
      return { success: false, error: err.message }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  return {
    // State
    containers,
    loading,
    error,
    searchQuery,
    // Getters
    filteredContainers,
    runningContainers,
    containerStats,
    // Actions
    fetchContainers,
    startContainer,
    stopContainer,
    removeContainer,
    testConnection,
    clearError,
    setSearchQuery,
    // Helpers
    getContainerName
  }
})