import { ref, computed } from 'vue'
import { useDockerApi } from './useDockerApi'

/**
 * Composable for Docker volume operations
 * Handles all volume-specific Docker API interactions
 */
export function useDockerVolumes() {
  const dockerApi = useDockerApi()
  
  // State
  const volumes = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const volumeStats = computed(() => ({
    total: volumes.value.length,
    inUse: volumes.value.filter(vol => vol.mountPoint || vol.usageData?.refCount > 0).length,
    unused: volumes.value.filter(vol => !vol.mountPoint && (!vol.usageData || vol.usageData.refCount === 0)).length,
    totalSize: volumes.value.reduce((acc, vol) => acc + (vol.usageData?.size || 0), 0)
  }))

  const sortedVolumes = computed(() => {
    return [...volumes.value].sort((a, b) => {
      // Sort by name, with anonymous volumes at the end
      const aName = a.name || ''
      const bName = b.name || ''
      
      // Check if volumes are anonymous (hash-like names)
      const aIsAnonymous = /^[a-f0-9]{64}$/.test(aName)
      const bIsAnonymous = /^[a-f0-9]{64}$/.test(bName)
      
      if (aIsAnonymous && !bIsAnonymous) return 1
      if (!aIsAnonymous && bIsAnonymous) return -1
      
      return aName.localeCompare(bName)
    })
  })

  // Helper functions
  const getVolumeName = (volume) => {
    if (!volume) return 'Unknown'
    return volume.name || volume.id?.substring(0, 12) || 'Unknown'
  }

  const getVolumeSize = (sizeInBytes) => {
    if (!sizeInBytes) return '0 B'
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = sizeInBytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const getVolumeType = (volume) => {
    if (!volume) return 'unknown'
    
    // Check if it's an anonymous volume (64-character hash)
    if (/^[a-f0-9]{64}$/.test(volume.name)) {
      return 'anonymous'
    }
    
    // Check if it's a bind mount
    if (volume.driver === 'local' && volume.mountPoint?.startsWith('/')) {
      return 'bind'
    }
    
    return 'named'
  }

  const isVolumeInUse = (volume) => {
    return volume.mountPoint || (volume.usageData?.refCount > 0)
  }

  // Core volume operations
  const fetchVolumes = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await dockerApi.getAllVolumes()
      volumes.value = data || []
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch volumes:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getVolumeDetails = async (volumeName) => {
    try {
      // This would require a new API endpoint for volume details
      const volume = volumes.value.find(v => v.name === volumeName)
      if (!volume) {
        throw new Error(`Volume ${volumeName} not found`)
      }
      
      return { success: true, data: volume }
    } catch (err) {
      const errorMessage = `Failed to get volume details: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const createVolume = async (volumeName, driver = 'local', options = {}) => {
    try {
      // This would require a new API endpoint for creating volumes
      // For now, we'll simulate the operation
      const newVolume = {
        name: volumeName,
        driver,
        mountPoint: `/var/lib/docker/volumes/${volumeName}/_data`,
        created: new Date().toISOString(),
        options
      }
      
      volumes.value.push(newVolume)
      return { success: true, data: newVolume }
    } catch (err) {
      const errorMessage = `Failed to create volume: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const removeVolume = async (volumeName, force = false) => {
    try {
      // Check if volume is in use
      const volume = volumes.value.find(v => v.name === volumeName)
      if (!force && volume && isVolumeInUse(volume)) {
        throw new Error('Volume is in use by one or more containers')
      }
      
      // This would require a new API endpoint for removing volumes
      volumes.value = volumes.value.filter(v => v.name !== volumeName)
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to remove volume: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Bulk operations
  const removeMultipleVolumes = async (volumeNames, force = false) => {
    const results = await Promise.allSettled(
      volumeNames.map(name => removeVolume(name, force))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    return {
      successful,
      failed,
      total: results.length
    }
  }

  const pruneVolumes = async () => {
    try {
      const unusedVolumes = volumes.value
        .filter(vol => !isVolumeInUse(vol))
        .map(vol => vol.name)
      
      const result = await removeMultipleVolumes(unusedVolumes, true)
      return { 
        success: true, 
        removed: result.successful,
        spaceReclaimed: 0 // Would be calculated from actual API
      }
    } catch (err) {
      const errorMessage = `Failed to prune volumes: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Volume inspection and usage
  const getVolumeUsage = async (volumeName) => {
    try {
      // This would require a new API endpoint for volume usage stats
      const volume = volumes.value.find(v => v.name === volumeName)
      if (!volume) {
        throw new Error(`Volume ${volumeName} not found`)
      }
      
      return { 
        success: true, 
        data: {
          size: volume.usageData?.size || 0,
          refCount: volume.usageData?.refCount || 0,
          containers: [] // Would list containers using this volume
        }
      }
    } catch (err) {
      const errorMessage = `Failed to get volume usage: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const searchVolumes = (query) => {
    if (!query) return volumes.value
    
    const searchTerm = query.toLowerCase()
    return volumes.value.filter(volume => {
      const name = getVolumeName(volume).toLowerCase()
      const driver = (volume.driver || '').toLowerCase()
      const mountPoint = (volume.mountPoint || '').toLowerCase()
      
      return name.includes(searchTerm) ||
             driver.includes(searchTerm) ||
             mountPoint.includes(searchTerm)
    })
  }

  // Volume filtering
  const filterVolumesByType = (type) => {
    return volumes.value.filter(volume => getVolumeType(volume) === type)
  }

  const filterVolumesByUsage = (inUse) => {
    return volumes.value.filter(volume => isVolumeInUse(volume) === inUse)
  }

  return {
    // State
    volumes,
    loading,
    error,

    // Computed
    volumeStats,
    sortedVolumes,

    // Helpers
    getVolumeName,
    getVolumeSize,
    getVolumeType,
    isVolumeInUse,
    searchVolumes,
    filterVolumesByType,
    filterVolumesByUsage,

    // Operations
    fetchVolumes,
    getVolumeDetails,
    createVolume,
    removeVolume,
    getVolumeUsage,

    // Bulk operations
    removeMultipleVolumes,
    pruneVolumes
  }
}