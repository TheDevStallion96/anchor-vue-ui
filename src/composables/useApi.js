import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  
  const execute = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      data.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    data,
    execute
  }
}