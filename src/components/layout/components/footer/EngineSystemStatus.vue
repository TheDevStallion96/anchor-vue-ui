<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-1">
      <!-- Loading state -->
      <div 
        v-if="isChecking" 
        class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"
      ></div>
      <!-- Connected state -->
      <div 
        v-else-if="engineStatus.connected" 
        class="w-2 h-2 bg-green-500 rounded-full"
      ></div>
      <!-- Disconnected state -->
      <div 
        v-else 
        class="w-2 h-2 bg-red-500 rounded-full"
      ></div>
      
      <span 
        :class="{
          'text-gray-400': isChecking,
          'text-green-400': engineStatus.connected && !isChecking,
          'text-red-400': !engineStatus.connected && !isChecking
        }"
      >
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDockerApi } from '@/composables/docker'

// Props for customization
const props = defineProps({
  checkInterval: {
    type: Number,
    default: 30000, // Check every 30 seconds
    validator: (value) => value >= 5000 // Minimum 5 seconds
  },
  autoCheck: {
    type: Boolean,
    default: true
  }
})

// Reactive state
const engineStatus = ref({
  connected: false,
  lastChecked: null,
  error: null
})

const isChecking = ref(false)
const checkTimer = ref(null)

// Composables
const dockerApi = useDockerApi()

// Computed properties
const statusText = computed(() => {
  if (isChecking.value) {
    return 'Checking engine...'
  }
  
  if (engineStatus.value.connected) {
    return 'Engine running'
  }
  
  return 'Engine disconnected'
})

// Methods
const checkEngineStatus = async () => {
  if (isChecking.value) return
  
  isChecking.value = true
  
  try {
    // Try to get system info to verify Docker engine is running
    await dockerApi.testConnection()
    
    engineStatus.value = {
      connected: true,
      lastChecked: new Date(),
      error: null
    }
  } catch (error) {
    engineStatus.value = {
      connected: false,
      lastChecked: new Date(),
      error: error.message
    }
  } finally {
    isChecking.value = false
  }
}

const startPeriodicCheck = () => {
  if (!props.autoCheck) return
  
  stopPeriodicCheck()
  checkTimer.value = setInterval(checkEngineStatus, props.checkInterval)
}

const stopPeriodicCheck = () => {
  if (checkTimer.value) {
    clearInterval(checkTimer.value)
    checkTimer.value = null
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initial check
  checkEngineStatus()
  
  // Start periodic checks if enabled
  if (props.autoCheck) {
    startPeriodicCheck()
  }
})

onUnmounted(() => {
  stopPeriodicCheck()
})

// Expose methods for parent components
defineExpose({
  checkEngineStatus,
  engineStatus,
  isChecking
})
</script>