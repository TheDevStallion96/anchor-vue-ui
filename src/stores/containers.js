import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDockerContainers } from '@/composables/docker'

export const useContainersStore = defineStore('containers', () => {
  // Use the dedicated Docker containers composable
  const dockerContainers = useDockerContainers()
  
  // Additional UI state (not Docker-specific)
  const searchQuery = ref('')
  const statusFilter = ref('all') // 'all', 'running', 'stopped', 'exited', 'created'
  const sortBy = ref('status') // 'name', 'status', 'created', 'image'
  const sortOrder = ref('asc') // 'asc', 'desc'

  // Enhanced computed properties that combine Docker data with UI filtering/sorting
  const filteredContainers = computed(() => {
    let filtered = dockerContainers.containers.value

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
          const name = dockerContainers.getContainerName(container).toLowerCase()
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
          aValue = dockerContainers.getContainerName(a).toLowerCase()
          bValue = dockerContainers.getContainerName(b).toLowerCase()
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

  // UI state management actions
  const clearError = () => {
    dockerContainers.error.value = null
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
    // UI State
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,

    // Docker state (from composable)
    containers: dockerContainers.containers,
    loading: dockerContainers.loading,
    error: dockerContainers.error,
    
    // Enhanced computed properties
    filteredContainers,
    runningContainers: dockerContainers.runningContainers,
    stoppedContainers: dockerContainers.stoppedContainers,
    containerStats: dockerContainers.containerStats,
    
    // Docker operations (from composable)
    fetchContainers: dockerContainers.fetchContainers,
    getContainerDetails: dockerContainers.getContainerDetails,
    getContainerLogs: dockerContainers.getContainerLogs,
    getContainerStats: dockerContainers.getContainerStats,
    startContainer: dockerContainers.startContainer,
    stopContainer: dockerContainers.stopContainer,
    restartContainer: dockerContainers.restartContainer,
    removeContainer: dockerContainers.removeContainer,
    startMultipleContainers: dockerContainers.startMultipleContainers,
    stopMultipleContainers: dockerContainers.stopMultipleContainers,
    removeMultipleContainers: dockerContainers.removeMultipleContainers,
    testConnection: dockerContainers.testConnection,
    
    // Helpers
    getContainerName: dockerContainers.getContainerName,
    
    // UI actions
    clearError,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    toggleSortOrder,
    clearFilters
  }
})