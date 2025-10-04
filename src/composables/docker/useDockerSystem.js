import { ref, computed } from 'vue'
import { useDockerApi } from './useDockerApi'

/**
 * Composable for Docker system operations
 * Handles system-wide Docker API interactions and monitoring
 */
export function useDockerSystem() {
  const dockerApi = useDockerApi()
  
  // State
  const systemInfo = ref(null)
  const systemVersion = ref(null)
  const systemEvents = ref([])
  const loading = ref(false)
  const error = ref(null)
  const connected = ref(false)

  // Computed
  const systemStats = computed(() => {
    if (!systemInfo.value) return null
    
    return {
      dockerVersion: systemInfo.value.version || 'Unknown',
      containers: systemInfo.value.containers || 0,
      containersRunning: systemInfo.value.containersRunning || 0,
      containersPaused: systemInfo.value.containersPaused || 0,
      containersStopped: systemInfo.value.containersStopped || 0,
      images: systemInfo.value.images || 0,
      memoryTotal: systemInfo.value.memTotal || 0,
      cpuCount: systemInfo.value.ncpu || 0,
      architecture: systemInfo.value.architecture || 'Unknown',
      operatingSystem: systemInfo.value.operatingSystem || 'Unknown',
      kernelVersion: systemInfo.value.kernelVersion || 'Unknown'
    }
  })

  const memoryUsage = computed(() => {
    if (!systemStats.value?.memoryTotal) return null
    
    const total = systemStats.value.memoryTotal
    const totalGB = (total / (1024 * 1024 * 1024)).toFixed(2)
    
    return {
      total: total,
      totalFormatted: `${totalGB} GB`,
      // These would come from real-time stats in a production app
      used: 0,
      usedFormatted: '0 GB',
      available: total,
      availableFormatted: totalGB + ' GB',
      percentage: 0
    }
  })

  const diskUsage = computed(() => {
    // This would require additional API endpoints for disk usage
    return {
      dockerRoot: '/var/lib/docker',
      totalSize: 0,
      totalSizeFormatted: '0 GB',
      imagesSize: 0,
      containersSize: 0,
      volumesSize: 0,
      buildCacheSize: 0
    }
  })

  // Helper functions
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const formatUptime = (uptimeSeconds) => {
    if (!uptimeSeconds) return 'Unknown'
    
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60))
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Core system operations
  const fetchSystemInfo = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await dockerApi.getSystemInfo()
      systemInfo.value = data
      connected.value = true
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      connected.value = false
      console.error('Failed to fetch system info:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const fetchSystemVersion = async () => {
    try {
      const data = await dockerApi.getSystemVersion()
      systemVersion.value = data
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to get system version: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const testConnection = async () => {
    try {
      await dockerApi.testConnection()
      connected.value = true
      return { success: true }
    } catch (err) {
      const errorMessage = `Connection test failed: ${err.message}`
      error.value = errorMessage
      connected.value = false
      return { success: false, error: errorMessage }
    }
  }

  // Event monitoring
  const startEventMonitoring = async () => {
    try {
      // This would implement Server-Sent Events or WebSocket connection
      // For now, we'll simulate periodic polling
      const data = await dockerApi.getSystemEvents()
      
      // In a real implementation, this would be a continuous stream
      if (data.events) {
        systemEvents.value = [...data.events, ...systemEvents.value].slice(0, 100) // Keep last 100 events
      }
      
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to start event monitoring: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const stopEventMonitoring = () => {
    // Stop any active event monitoring
    // In a real implementation, this would close WebSocket/SSE connections
    return { success: true }
  }

  const clearEvents = () => {
    systemEvents.value = []
  }

  // System maintenance operations
  const pruneSystem = async (options = {}) => {
    try {
      // This would require system prune API endpoints
      const results = {
        containersRemoved: 0,
        imagesRemoved: 0,
        volumesRemoved: 0,
        networksRemoved: 0,
        spaceReclaimed: 0
      }
      
      // Simulate system prune operation
      return { success: true, data: results }
    } catch (err) {
      const errorMessage = `Failed to prune system: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const getSystemUsage = async () => {
    try {
      // This would require detailed system usage API endpoints
      const usage = {
        containers: systemStats.value?.containers || 0,
        images: systemStats.value?.images || 0,
        volumes: 0, // Would come from volume stats
        networks: 0, // Would come from network stats
        buildCache: 0
      }
      
      return { success: true, data: usage }
    } catch (err) {
      const errorMessage = `Failed to get system usage: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Docker daemon management
  const getDaemonStatus = () => {
    return {
      running: connected.value,
      version: systemVersion.value?.version || 'Unknown',
      apiVersion: systemVersion.value?.apiVersion || 'Unknown',
      gitCommit: systemVersion.value?.gitCommit || 'Unknown',
      buildTime: systemVersion.value?.buildTime || 'Unknown'
    }
  }

  const restartDaemon = async () => {
    try {
      // This would require daemon management API endpoints
      // For now, just test connection again
      return await testConnection()
    } catch (err) {
      const errorMessage = `Failed to restart daemon: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // System health checks
  const runHealthCheck = async () => {
    const results = {
      apiConnection: false,
      daemonRunning: false,
      diskSpace: true, // Assume OK for now
      permissions: true // Assume OK for now
    }
    
    try {
      // Test API connection
      const connectionResult = await testConnection()
      results.apiConnection = connectionResult.success
      
      // Check daemon status
      if (results.apiConnection) {
        const infoResult = await fetchSystemInfo()
        results.daemonRunning = infoResult.success
      }
      
      const overallHealth = Object.values(results).every(status => status === true)
      
      return {
        success: true,
        data: {
          healthy: overallHealth,
          checks: results,
          timestamp: new Date().toISOString()
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
        data: {
          healthy: false,
          checks: results,
          timestamp: new Date().toISOString()
        }
      }
    }
  }

  return {
    // State
    systemInfo,
    systemVersion,
    systemEvents,
    loading,
    error,
    connected,

    // Computed
    systemStats,
    memoryUsage,
    diskUsage,

    // Helpers
    formatBytes,
    formatUptime,

    // Operations
    fetchSystemInfo,
    fetchSystemVersion,
    testConnection,
    
    // Event monitoring
    startEventMonitoring,
    stopEventMonitoring,
    clearEvents,

    // System maintenance
    pruneSystem,
    getSystemUsage,

    // Daemon management
    getDaemonStatus,
    restartDaemon,

    // Health checks
    runHealthCheck
  }
}