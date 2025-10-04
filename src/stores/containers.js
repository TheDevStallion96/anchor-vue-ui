import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDockerApi } from '@/composables/useDockerApi'

export const useContainersStore = defineStore('containers', () => {
  // State
  const containers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const statusFilter = ref('all') // 'all', 'running', 'stopped', 'exited', 'created'
  const sortBy = ref('status') // 'name', 'status', 'created', 'image'
  const sortOrder = ref('asc') // 'asc', 'desc'

  // Docker API
  const dockerApi = useDockerApi()

  // Getters (computed)
  const filteredContainers = computed(() => {
    let filtered = containers.value

    // Apply status filter
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(container => {
        if (statusFilter.value === 'stopped') {
          return container.status === 'exited' || container.status === 'stopped'
        }
        return container.status === statusFilter.value
      })
    }

    // Apply search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase().trim()
      
      // Support advanced search syntax
      if (query.startsWith('id:')) {
        const searchId = query.substring(3).trim()
        filtered = filtered.filter(container => 
          container.id?.toLowerCase().includes(searchId)
        )
      } else if (query.startsWith('image:')) {
        const searchImage = query.substring(6).trim()
        filtered = filtered.filter(container => 
          container.image?.toLowerCase().includes(searchImage)
        )
      } else if (query.startsWith('status:')) {
        const searchStatus = query.substring(7).trim()
        filtered = filtered.filter(container => 
          container.status?.toLowerCase().includes(searchStatus)
        )
      } else if (query.startsWith('port:')) {
        const searchPort = query.substring(5).trim()
        filtered = filtered.filter(container => {
          if (!container.ports || container.ports.length === 0) return false
          return container.ports.some(port => 
            port.publicPort?.toString().includes(searchPort) ||
            port.privatePort?.toString().includes(searchPort)
          )
        })
      } else {
        // Default search: name, image, id, status
        filtered = filtered.filter(container => {
          const name = getContainerName(container).toLowerCase()
          const image = container.image?.toLowerCase() || ''
          const id = container.id?.toLowerCase() || ''
          const status = container.status?.toLowerCase() || ''
          
          return name.includes(query) || 
                 image.includes(query) || 
                 id.includes(query) ||
                 status.includes(query)
        })
      }
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy.value) {
        case 'name':
          aValue = getContainerName(a).toLowerCase()
          bValue = getContainerName(b).toLowerCase()
          break
        case 'status':
          // Custom status priority for better UX
          const statusPriority = { running: 1, created: 2, restarting: 3, paused: 4, exited: 5, stopped: 6 }
          aValue = statusPriority[a.status] || 7
          bValue = statusPriority[b.status] || 7
          break
        case 'created':
          aValue = new Date(a.created || 0)
          bValue = new Date(b.created || 0)
          break
        case 'image':
          aValue = a.image?.toLowerCase() || ''
          bValue = b.image?.toLowerCase() || ''
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
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

  const setStatusFilter = (status) => {
    statusFilter.value = status
  }

  const setSortBy = (field) => {
    if (sortBy.value === field) {
      // Toggle sort order if same field
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    sortBy.value = 'status'
    sortOrder.value = 'asc'
  }

  return {
    // State
    containers,
    loading,
    error,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
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
    setStatusFilter,
    setSortBy,
    toggleSortOrder,
    clearFilters,
    // Helpers
    getContainerName
  }
})