import { useDockerContainers } from './useDockerContainers'
import { useDockerImages } from './useDockerImages'
import { useDockerVolumes } from './useDockerVolumes'
import { useDockerSystem } from './useDockerSystem'

/**
 * Master Docker composable that provides unified access to all Docker operations
 * This is the main entry point for all Docker-related functionality
 */
export function useDocker() {
  // Initialize all Docker composables
  const containers = useDockerContainers()
  const images = useDockerImages()
  const volumes = useDockerVolumes()
  const system = useDockerSystem()

  // Unified initialization function
  const initialize = async () => {
    const results = {
      system: { success: false },
      containers: { success: false },
      images: { success: false },
      volumes: { success: false }
    }

    try {
      // Test connection first
      const connectionResult = await system.testConnection()
      if (!connectionResult.success) {
        throw new Error(connectionResult.error)
      }

      // Fetch system info
      results.system = await system.fetchSystemInfo()

      // Fetch all resources in parallel
      const [containersResult, imagesResult, volumesResult] = await Promise.allSettled([
        containers.fetchContainers(),
        images.fetchImages(),
        volumes.fetchVolumes()
      ])

      results.containers = containersResult.status === 'fulfilled' 
        ? containersResult.value 
        : { success: false, error: containersResult.reason?.message }

      results.images = imagesResult.status === 'fulfilled' 
        ? imagesResult.value 
        : { success: false, error: imagesResult.reason?.message }

      results.volumes = volumesResult.status === 'fulfilled' 
        ? volumesResult.value 
        : { success: false, error: volumesResult.reason?.message }

      return {
        success: true,
        results
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
        results
      }
    }
  }

  // Unified refresh function
  const refreshAll = async () => {
    const results = await Promise.allSettled([
      containers.fetchContainers(),
      images.fetchImages(),
      volumes.fetchVolumes(),
      system.fetchSystemInfo()
    ])

    const successful = results.filter(r => 
      r.status === 'fulfilled' && r.value.success
    ).length

    return {
      success: successful > 0,
      total: results.length,
      successful,
      failed: results.length - successful
    }
  }

  // Global search across all resources
  const searchAll = (query) => {
    if (!query) return null

    return {
      containers: containers.containers.value.filter(container => {
        const name = containers.getContainerName(container).toLowerCase()
        const image = (container.image || '').toLowerCase()
        const id = (container.id || '').toLowerCase()
        return name.includes(query.toLowerCase()) || 
               image.includes(query.toLowerCase()) || 
               id.includes(query.toLowerCase())
      }),
      images: images.searchImages(query),
      volumes: volumes.searchVolumes(query)
    }
  }

  // Global statistics
  const getGlobalStats = () => {
    return {
      containers: containers.containerStats.value,
      images: images.imageStats.value,
      volumes: volumes.volumeStats.value,
      system: system.systemStats.value
    }
  }

  // Global cleanup operations
  const cleanup = async (options = {}) => {
    const {
      containers: cleanContainers = false,
      images: cleanImages = false,
      volumes: cleanVolumes = false,
      system: cleanSystem = false
    } = options

    const results = []

    try {
      if (cleanContainers) {
        // Remove stopped containers
        const stoppedContainers = containers.containers.value
          .filter(c => c.status === 'exited' || c.status === 'stopped')
          .map(c => c.id)
        
        if (stoppedContainers.length > 0) {
          const result = await containers.removeMultipleContainers(stoppedContainers)
          results.push({ type: 'containers', ...result })
        }
      }

      if (cleanImages) {
        const result = await images.pruneImages()
        results.push({ type: 'images', ...result })
      }

      if (cleanVolumes) {
        const result = await volumes.pruneVolumes()
        results.push({ type: 'volumes', ...result })
      }

      if (cleanSystem) {
        const result = await system.pruneSystem()
        results.push({ type: 'system', ...result })
      }

      return {
        success: true,
        results
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
        results
      }
    }
  }

  // Resource dependencies check
  const checkDependencies = async (resourceType, resourceId) => {
    try {
      const dependencies = {
        containers: [],
        images: [],
        volumes: []
      }

      if (resourceType === 'image') {
        // Find containers using this image
        dependencies.containers = containers.containers.value
          .filter(container => container.image === resourceId)
          .map(container => ({
            id: container.id,
            name: containers.getContainerName(container),
            status: container.status
          }))
      }

      if (resourceType === 'volume') {
        // Find containers using this volume
        dependencies.containers = containers.containers.value
          .filter(container => 
            container.mounts?.some(mount => mount.source === resourceId)
          )
          .map(container => ({
            id: container.id,
            name: containers.getContainerName(container),
            status: container.status
          }))
      }

      return {
        success: true,
        dependencies,
        canRemove: dependencies.containers.length === 0
      }
    } catch (err) {
      return {
        success: false,
        error: err.message
      }
    }
  }

  return {
    // Sub-composables - direct access when needed
    containers,
    images,
    volumes,
    system,

    // Unified operations
    initialize,
    refreshAll,
    searchAll,
    getGlobalStats,
    cleanup,
    checkDependencies
  }
}