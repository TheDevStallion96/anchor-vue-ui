import { ref } from 'vue'
import { notificationUtils } from '@/utils/containerUtils'

/**
 * Composable for handling container action UI logic and user feedback
 * Works with Docker composables to provide user-friendly interfaces
 */
export function useContainerActions(dockerContainers) {
  const actionLoading = ref(false)

  const handleTestConnection = async () => {
    const result = await dockerContainers.testConnection()
    if (result.success) {
      notificationUtils.success('Docker API connection successful!')
    } else {
      notificationUtils.error(`Connection test failed: ${result.error}`)
    }
    return result
  }

  const handleStartContainer = async (container) => {
    actionLoading.value = true
    try {
      const result = await dockerContainers.startContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Started container: ${dockerContainers.getContainerName(container)}`)
      } else {
        notificationUtils.error(`Failed to start container: ${result.error}`)
      }
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const handleStopContainer = async (container) => {
    actionLoading.value = true
    try {
      const result = await dockerContainers.stopContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Stopped container: ${dockerContainers.getContainerName(container)}`)
      } else {
        notificationUtils.error(`Failed to stop container: ${result.error}`)
      }
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const handleRemoveContainer = async (container) => {
    const containerName = dockerContainers.getContainerName(container)
    
    if (!confirm(`Are you sure you want to remove container "${containerName}"?`)) {
      return { success: false, cancelled: true }
    }

    actionLoading.value = true
    try {
      const result = await dockerContainers.removeContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Removed container: ${containerName}`)
      } else {
        notificationUtils.error(`Failed to remove container: ${result.error}`)
      }
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const handleRestartContainer = async (container) => {
    actionLoading.value = true
    try {
      const result = await dockerContainers.restartContainer(container.id)
      if (result.success) {
        notificationUtils.success(`Restarted container: ${dockerContainers.getContainerName(container)}`)
      } else {
        notificationUtils.error(`Failed to restart container: ${result.error}`)
      }
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const viewLogs = async (container) => {
    const containerName = dockerContainers.getContainerName(container)
    
    try {
      const result = await dockerContainers.getContainerLogs(container.id, 100)
      if (result.success) {
        notificationUtils.info(`Viewing logs for: ${containerName}`)
        // TODO: Open logs in modal or new view
        console.log('Container logs:', result.data)
        return result
      } else {
        notificationUtils.error(`Failed to get logs: ${result.error}`)
        return result
      }
    } catch (err) {
      notificationUtils.error(`Failed to get logs: ${err.message}`)
      return { success: false, error: err.message }
    }
  }

  const inspectContainer = async (container) => {
    const containerName = dockerContainers.getContainerName(container)
    
    try {
      const result = await dockerContainers.getContainerDetails(container.id)
      if (result.success) {
        notificationUtils.info(`Inspecting container: ${containerName}`)
        // TODO: Open inspection in modal or new view
        console.log('Container details:', result.data)
        return result
      } else {
        notificationUtils.error(`Failed to inspect container: ${result.error}`)
        return result
      }
    } catch (err) {
      notificationUtils.error(`Failed to inspect container: ${err.message}`)
      return { success: false, error: err.message }
    }
  }

  const handleBulkStart = async (containerIds) => {
    if (!containerIds.length) return { successful: 0, failed: 0, total: 0 }

    actionLoading.value = true
    try {
      const result = await dockerContainers.startMultipleContainers(containerIds)
      
      if (result.successful > 0) {
        notificationUtils.success(`Started ${result.successful} container${result.successful > 1 ? 's' : ''}`)
      }
      if (result.failed > 0) {
        notificationUtils.error(`Failed to start ${result.failed} container${result.failed > 1 ? 's' : ''}`)
      }
      
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const handleBulkStop = async (containerIds) => {
    if (!containerIds.length) return { successful: 0, failed: 0, total: 0 }

    actionLoading.value = true
    try {
      const result = await dockerContainers.stopMultipleContainers(containerIds)
      
      if (result.successful > 0) {
        notificationUtils.success(`Stopped ${result.successful} container${result.successful > 1 ? 's' : ''}`)
      }
      if (result.failed > 0) {
        notificationUtils.error(`Failed to stop ${result.failed} container${result.failed > 1 ? 's' : ''}`)
      }
      
      return result
    } finally {
      actionLoading.value = false
    }
  }

  const handleBulkRemove = async (containerIds) => {
    if (!containerIds.length) return { successful: 0, failed: 0, total: 0 }

    if (!confirm(`Are you sure you want to remove ${containerIds.length} container${containerIds.length > 1 ? 's' : ''}?`)) {
      return { successful: 0, failed: 0, total: 0, cancelled: true }
    }

    actionLoading.value = true
    try {
      const result = await dockerContainers.removeMultipleContainers(containerIds)
      
      if (result.successful > 0) {
        notificationUtils.success(`Removed ${result.successful} container${result.successful > 1 ? 's' : ''}`)
      }
      if (result.failed > 0) {
        notificationUtils.error(`Failed to remove ${result.failed} container${result.failed > 1 ? 's' : ''}`)
      }
      
      return result
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
    handleRestartContainer,
    viewLogs,
    inspectContainer,
    handleBulkStart,
    handleBulkStop,
    handleBulkRemove
  }
}