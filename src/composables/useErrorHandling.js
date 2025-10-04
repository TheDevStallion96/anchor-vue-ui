import { ref } from 'vue'

export function useErrorHandling() {
  const errors = ref([])
  const isLoading = ref(false)

  const addError = (error, context = '') => {
    const errorObj = {
      id: Date.now(),
      message: error.message || error,
      context,
      timestamp: new Date().toISOString()
    }
    
    errors.value.unshift(errorObj)
    console.error(`[${context}] Error:`, error)
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      removeError(errorObj.id)
    }, 5000)
  }

  const removeError = (errorId) => {
    const index = errors.value.findIndex(err => err.id === errorId)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  const handleAsyncOperation = async (operation, context = 'Operation') => {
    isLoading.value = true
    try {
      const result = await operation()
      return { success: true, data: result }
    } catch (error) {
      addError(error, context)
      return { success: false, error: error.message || error }
    } finally {
      isLoading.value = false
    }
  }

  return {
    errors,
    isLoading,
    addError,
    removeError,
    clearErrors,
    handleAsyncOperation
  }
}