import { ref } from 'vue'
import { notificationUtils } from '@/utils/containerUtils'

export function useContainerActions(containersStore) {
  const actionLoading = ref(false)

  const handleTestConnection = async () => {
    const result = await containersStore.testConnection()
    if (result.success) {
      notificationUtils.success('Docker API connection successful!')
    } else {
      notificationUtils.error(`Connection test failed: ${result.error}`)
    }
  }

  const handleStartContainer = async (container) => {
    actionLoading.value = true
    try {
      const result = await containersStore.startContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Started container: ${containersStore.getContainerName(container)}`)
      } else {
        notificationUtils.error(`Failed to start container: ${result.error}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  const handleStopContainer = async (container) => {
    actionLoading.value = true
    try {
      const result = await containersStore.stopContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Stopped container: ${containersStore.getContainerName(container)}`)
      } else {
        notificationUtils.error(`Failed to stop container: ${result.error}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  const handleRemoveContainer = async (container) => {
    const containerName = containersStore.getContainerName(container)
    
    if (!confirm(`Are you sure you want to remove container "${containerName}"?`)) {
      return
    }

    actionLoading.value = true
    try {
      const result = await containersStore.removeContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Removed container: ${containerName}`)
      } else {
        notificationUtils.error(`Failed to remove container: ${result.error}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  const viewLogs = (container) => {
    const containerName = containersStore.getContainerName(container)
    notificationUtils.info(`View logs for: ${containerName}`)
    // TODO: Implement log viewing modal
  }

  const inspectContainer = (container) => {
    const containerName = containersStore.getContainerName(container)
    notificationUtils.info(`Inspect container: ${containerName}`)
    // TODO: Implement container inspection modal
  }

  const handleBulkStart = async (containerIds) => {
    actionLoading.value = true
    try {
      const results = await Promise.allSettled(
        containerIds.map(id => containersStore.startContainer(id))
      )
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful
      
      if (successful > 0) {
        notificationUtils.success(`Started ${successful} container${successful > 1 ? 's' : ''}`)
      }
      if (failed > 0) {
        notificationUtils.error(`Failed to start ${failed} container${failed > 1 ? 's' : ''}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  const handleBulkStop = async (containerIds) => {
    actionLoading.value = true
    try {
      const results = await Promise.allSettled(
        containerIds.map(id => containersStore.stopContainer(id))
      )
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful
      
      if (successful > 0) {
        notificationUtils.success(`Stopped ${successful} container${successful > 1 ? 's' : ''}`)
      }
      if (failed > 0) {
        notificationUtils.error(`Failed to stop ${failed} container${failed > 1 ? 's' : ''}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  const handleBulkRemove = async (containerIds) => {
    if (!confirm(`Are you sure you want to remove ${containerIds.length} container${containerIds.length > 1 ? 's' : ''}?`)) {
      return
    }

    actionLoading.value = true
    try {
      const results = await Promise.allSettled(
        containerIds.map(id => containersStore.removeContainer(id))
      )
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful
      
      if (successful > 0) {
        notificationUtils.success(`Removed ${successful} container${successful > 1 ? 's' : ''}`)
      }
      if (failed > 0) {
        notificationUtils.error(`Failed to remove ${failed} container${failed > 1 ? 's' : ''}`)
      }
    } finally {
      actionLoading.value = false
    }
  }

  return {
    actionLoading,
    handleTestConnection,
    handleStartContainer,
    handleStopContainer,
    handleRemoveContainer,
    viewLogs,
    inspectContainer,
    handleBulkStart,
    handleBulkStop,
    handleBulkRemove
  }
}