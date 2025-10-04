import { ref } from 'vue'
import { DOCKER_API_BASE_URL } from '@/utils/constants'

export function useDockerApi() {
  const loading = ref(false)
  const error = ref(null)
  
  const API_BASE_URL = DOCKER_API_BASE_URL
  
  const handleApiCall = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      let errorMessage = err.message
      
      // Handle common network errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to Docker API. Make sure the API server is running on http://localhost:3000'
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The Docker API server needs to allow cross-origin requests'
      }
      
      error.value = errorMessage
      console.error('Docker API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Helper function to handle API responses
  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'API request failed')
    }
    
    return result.data
  }
  
  // Test API connectivity
  const testConnection = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/system/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      return handleResponse(response)
    })
  }
  
  // Container operations
  const getAllContainers = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/all`)
      return handleResponse(response)
    })
  }
  
  const getRunningContainers = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers`)
      return handleResponse(response)
    })
  }
  
  const getContainerDetails = async (containerId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}`)
      return handleResponse(response)
    })
  }
  
  const startContainer = async (containerId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/start`, {
        method: 'POST'
      })
      return handleResponse(response)
    })
  }
  
  const stopContainer = async (containerId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/stop`, {
        method: 'POST'
      })
      return handleResponse(response)
    })
  }
  
  const restartContainer = async (containerId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/restart`, {
        method: 'POST'
      })
      return handleResponse(response)
    })
  }
  
  const removeContainer = async (containerId, force = false) => {
    return handleApiCall(async () => {
      const url = `${API_BASE_URL}/containers/${containerId}${force ? '?force=true' : ''}`
      const response = await fetch(url, {
        method: 'DELETE'
      })
      return handleResponse(response)
    })
  }
  
  const getContainerLogs = async (containerId, lines = 100) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/logs?lines=${lines}`)
      return handleResponse(response)
    })
  }
  
  const getContainerStats = async (containerId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/stats`)
      return handleResponse(response)
    })
  }
  
  // Image operations
  const getAllImages = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/images`)
      return handleResponse(response)
    })
  }
  
  const getImageDetails = async (imageId) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}`)
      return handleResponse(response)
    })
  }
  
  const pullImage = async (imageName) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/images/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageName })
      })
      return handleResponse(response)
    })
  }
  
  const removeImage = async (imageId, force = false) => {
    return handleApiCall(async () => {
      const url = `${API_BASE_URL}/images/${imageId}${force ? '?force=true' : ''}`
      const response = await fetch(url, {
        method: 'DELETE'
      })
      return handleResponse(response)
    })
  }
  
  const buildImage = async (context, dockerfile, tag) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/images/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context, dockerfile, tag })
      })
      return handleResponse(response)
    })
  }
  
  // Volume operations  
  const getAllVolumes = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/volumes`)
      return handleResponse(response)
    })
  }
  
  // System operations
  const getSystemInfo = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/system/info`)
      return handleResponse(response)
    })
  }
  
  const getSystemVersion = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/system/version`)
      return handleResponse(response)
    })
  }
  
  const getSystemEvents = async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/system/events`)
      return handleResponse(response)
    })
  }
    
  return {
    // Reactive state
    loading,
    error,
    // API functions
    testConnection,
    // Container operations
    getAllContainers,
    getRunningContainers,
    getContainerDetails,
    startContainer,
    stopContainer,
    restartContainer,
    removeContainer,
    getContainerLogs,
    getContainerStats,
    // Image operations
    getAllImages,
    getImageDetails,
    pullImage,
    removeImage,
    buildImage,
    // Volume operations  
    getAllVolumes,
    // System operations
    getSystemInfo,
    getSystemVersion,
    getSystemEvents
  }
}