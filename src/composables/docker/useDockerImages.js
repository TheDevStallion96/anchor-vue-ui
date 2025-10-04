import { ref, computed } from 'vue'
import { useDockerApi } from './useDockerApi'

/**
 * Composable for Docker image operations
 * Handles all image-specific Docker API interactions
 */
export function useDockerImages() {
  const dockerApi = useDockerApi()
  
  // State
  const images = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pullProgress = ref(null)
  const buildProgress = ref(null)

  // Computed
  const imageStats = computed(() => ({
    total: images.value.length,
    totalSize: images.value.reduce((acc, img) => acc + (img.size || 0), 0),
    dangling: images.value.filter(img => !img.repository || img.repository === '<none>').length,
    tagged: images.value.filter(img => img.repository && img.repository !== '<none>').length
  }))

  const sortedImages = computed(() => {
    return [...images.value].sort((a, b) => {
      // Sort by repository, then by tag
      const aRepo = a.repository || '<none>'
      const bRepo = b.repository || '<none>'
      
      if (aRepo !== bRepo) {
        return aRepo.localeCompare(bRepo)
      }
      
      const aTag = a.tag || 'latest'
      const bTag = b.tag || 'latest'
      return aTag.localeCompare(bTag)
    })
  })

  // Helper functions
  const getImageName = (image) => {
    if (!image) return 'Unknown'
    
    if (image.repository && image.repository !== '<none>') {
      return image.tag && image.tag !== '<none>' 
        ? `${image.repository}:${image.tag}`
        : image.repository
    }
    
    return image.id?.substring(7, 19) || 'Unknown'
  }

  const getImageSize = (sizeInBytes) => {
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

  // Core image operations
  const fetchImages = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await dockerApi.getAllImages()
      images.value = data || []
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch images:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getImageDetails = async (imageId) => {
    try {
      const data = await dockerApi.getImageDetails(imageId)
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to get image details: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const pullImage = async (imageName, onProgress = null) => {
    pullProgress.value = { imageName, status: 'starting' }
    
    try {
      // If onProgress callback is provided, we could implement streaming here
      if (onProgress) {
        onProgress({ status: 'pulling', imageName })
      }
      
      const data = await dockerApi.pullImage(imageName)
      pullProgress.value = { imageName, status: 'completed' }
      
      // Refresh images list
      await fetchImages()
      
      if (onProgress) {
        onProgress({ status: 'completed', imageName })
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to pull image: ${err.message}`
      error.value = errorMessage
      pullProgress.value = { imageName, status: 'error', error: errorMessage }
      
      if (onProgress) {
        onProgress({ status: 'error', imageName, error: errorMessage })
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const removeImage = async (imageId, force = false) => {
    try {
      await dockerApi.removeImage(imageId, force)
      await fetchImages() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = `Failed to remove image: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const buildImage = async (context, dockerfile, tag, onProgress = null) => {
    buildProgress.value = { tag, status: 'starting' }
    
    try {
      if (onProgress) {
        onProgress({ status: 'building', tag })
      }
      
      const data = await dockerApi.buildImage(context, dockerfile, tag)
      buildProgress.value = { tag, status: 'completed' }
      
      // Refresh images list
      await fetchImages()
      
      if (onProgress) {
        onProgress({ status: 'completed', tag })
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = `Failed to build image: ${err.message}`
      error.value = errorMessage
      buildProgress.value = { tag, status: 'error', error: errorMessage }
      
      if (onProgress) {
        onProgress({ status: 'error', tag, error: errorMessage })
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Bulk operations
  const removeMultipleImages = async (imageIds, force = false) => {
    const results = await Promise.allSettled(
      imageIds.map(id => removeImage(id, force))
    )
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    return {
      successful,
      failed,
      total: results.length
    }
  }

  const pruneImages = async (dangling = true) => {
    try {
      // Note: This would require a new API endpoint for pruning
      // For now, we'll simulate by removing dangling images
      if (dangling) {
        const danglingImages = images.value
          .filter(img => !img.repository || img.repository === '<none>')
          .map(img => img.id)
        
        return await removeMultipleImages(danglingImages, true)
      }
      
      return { success: true, removed: 0 }
    } catch (err) {
      const errorMessage = `Failed to prune images: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Image inspection and history
  const getImageHistory = async (imageId) => {
    try {
      // This would require a new API endpoint
      // For now, return a placeholder
      return { 
        success: true, 
        data: { 
          layers: [], 
          message: 'Image history not yet implemented' 
        } 
      }
    } catch (err) {
      const errorMessage = `Failed to get image history: ${err.message}`
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const searchImages = (query) => {
    if (!query) return images.value
    
    const searchTerm = query.toLowerCase()
    return images.value.filter(image => {
      const name = getImageName(image).toLowerCase()
      const repo = (image.repository || '').toLowerCase()
      const tag = (image.tag || '').toLowerCase()
      const id = (image.id || '').toLowerCase()
      
      return name.includes(searchTerm) ||
             repo.includes(searchTerm) ||
             tag.includes(searchTerm) ||
             id.includes(searchTerm)
    })
  }

  return {
    // State
    images,
    loading,
    error,
    pullProgress,
    buildProgress,

    // Computed
    imageStats,
    sortedImages,

    // Helpers
    getImageName,
    getImageSize,
    searchImages,

    // Operations
    fetchImages,
    getImageDetails,
    pullImage,
    removeImage,
    buildImage,
    getImageHistory,

    // Bulk operations
    removeMultipleImages,
    pruneImages
  }
}