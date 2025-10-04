/**
 * Utility functions for container data formatting and manipulation
 */

export const containerUtils = {
  /**
   * Extract image name without registry/tag details
   */
  getImageName(image) {
    if (!image) return '-'
    const parts = image.split('/')
    const nameWithTag = parts[parts.length - 1]
    return nameWithTag.split(':')[0] || nameWithTag
  },

  /**
   * Extract image tag from full image string
   */
  getImageTag(image) {
    if (!image) return null
    const parts = image.split(':')
    return parts.length > 1 ? parts[parts.length - 1] : 'latest'
  },

  /**
   * Get container name with fallback to ID
   */
  getContainerName(container) {
    if (!container) return 'Unknown'
    
    if (container.names && container.names.length > 0) {
      // Remove leading slash from Docker container names
      return container.names[0].replace(/^\//, '')
    }
    
    // Fallback to short ID
    return container.id?.substring(0, 12) || 'Unknown'
  },

  /**
   * Format container ports for display
   */
  getContainerPorts(container) {
    if (!container.ports || container.ports.length === 0) {
      return '-'
    }
    
    return container.ports
      .filter(port => port.publicPort && port.privatePort)
      .map(port => `${port.publicPort}:${port.privatePort}`)
      .join(', ') || '-'
  },

  /**
   * Get status indicator CSS classes
   */
  getStatusIndicator(status) {
    const baseClasses = 'w-3 h-3 rounded-full border-2'
    
    const statusMap = {
      running: `${baseClasses} bg-green-500 border-green-400`,
      exited: `${baseClasses} bg-red-500 border-red-400`,
      stopped: `${baseClasses} bg-red-500 border-red-400`,
      created: `${baseClasses} bg-yellow-500 border-yellow-400`,
      paused: `${baseClasses} bg-orange-500 border-orange-400`,
      restarting: `${baseClasses} bg-blue-500 border-blue-400`,
    }
    
    return statusMap[status] || `${baseClasses} border-gray-500`
  },

  /**
   * Get status badge CSS classes
   */
  getStatusBadgeClasses(status) {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
    
    const statusMap = {
      running: `${baseClasses} bg-green-900/30 text-green-400 border border-green-500/30`,
      exited: `${baseClasses} bg-red-900/30 text-red-400 border border-red-500/30`,
      stopped: `${baseClasses} bg-red-900/30 text-red-400 border border-red-500/30`,
      created: `${baseClasses} bg-yellow-900/30 text-yellow-400 border border-yellow-500/30`,
      paused: `${baseClasses} bg-orange-900/30 text-orange-400 border border-orange-500/30`,
      restarting: `${baseClasses} bg-blue-900/30 text-blue-400 border border-blue-500/30`,
    }
    
    return statusMap[status] || `${baseClasses} bg-gray-900/30 text-gray-400 border border-gray-500/30`
  },

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return '-'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now - date
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInHours / 24)

      // Show relative time for recent dates
      if (diffInDays === 0) {
        if (diffInHours === 0) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
          return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`
        }
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
      } else if (diffInDays === 1) {
        return 'Yesterday'
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`
      }

      // Show full date for older entries
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    } catch (error) {
      console.warn('Invalid date string:', dateString)
      return '-'
    }
  },

  /**
   * Get container status priority for sorting
   */
  getStatusPriority(status) {
    const priorityMap = {
      running: 1,
      restarting: 2,
      paused: 3,
      created: 4,
      exited: 5,
      stopped: 6
    }
    return priorityMap[status] || 7
  },

  /**
   * Sort containers by status, then by name
   */
  sortContainers(containers, sortBy = 'status') {
    return [...containers].sort((a, b) => {
      if (sortBy === 'status') {
        const aPriority = this.getStatusPriority(a.status)
        const bPriority = this.getStatusPriority(b.status)
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority
        }
      }
      
      // Secondary sort by name
      const aName = a.name || a.id?.substring(0, 12) || ''
      const bName = b.name || b.id?.substring(0, 12) || ''
      return aName.localeCompare(bName)
    })
  },

  /**
   * Validate container action availability
   */
  canPerformAction(container, action) {
    const actions = {
      start: ['exited', 'stopped', 'created'],
      stop: ['running'],
      restart: ['running'],
      pause: ['running'],
      unpause: ['paused'],
      remove: ['exited', 'stopped', 'created'],
      forceRemove: ['running', 'paused', 'restarting']
    }
    
    return actions[action]?.includes(container.status) || false
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(dateString) {
    if (!dateString) return '-'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now - date
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      const diffInHours = Math.floor(diffInMinutes / 60)
      const diffInDays = Math.floor(diffInHours / 24)

      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInHours < 24) return `${diffInHours}h ago`
      if (diffInDays < 30) return `${diffInDays}d ago`
      
      const diffInMonths = Math.floor(diffInDays / 30)
      if (diffInMonths < 12) return `${diffInMonths}mo ago`
      
      const diffInYears = Math.floor(diffInMonths / 12)
      return `${diffInYears}y ago`
    } catch (error) {
      console.warn('Invalid date string:', dateString)
      return '-'
    }
  },

  /**
   * Format container uptime from state info
   */
  formatUptime(state) {
    if (!state?.startedAt) return '-'
    
    try {
      const startTime = new Date(state.startedAt)
      const now = new Date()
      const uptimeMs = now - startTime
      
      const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) return `Up ${days}d ${hours}h`
      if (hours > 0) return `Up ${hours}h ${minutes}m`
      if (minutes > 0) return `Up ${minutes}m`
      return 'Up < 1m'
    } catch (error) {
      console.warn('Invalid uptime calculation:', error)
      return '-'
    }
  }
}

/**
 * Notification utilities
 */
export const notificationUtils = {
  success(message) {
    // TODO: Integrate with a toast notification system
    console.log('✅ Success:', message)
  },

  error(message) {
    // TODO: Integrate with a toast notification system
    console.error('❌ Error:', message)
  },

  warning(message) {
    // TODO: Integrate with a toast notification system
    console.warn('⚠️ Warning:', message)
  },

  info(message) {
    // TODO: Integrate with a toast notification system
    console.info('ℹ️ Info:', message)
  }
}