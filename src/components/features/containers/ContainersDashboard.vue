<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-semibold text-white">Containers</h1>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-400">Container CPU usage</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500 italic text-sm">No containers are running.</p>
      </div>
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-400">Container memory usage</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500 italic text-sm">No containers are running.</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-4 mb-8">
      <div class="relative flex-1 max-w-md">
        <input 
          type="text" 
          placeholder="Search" 
          v-model="searchQuery"
          class="w-full bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-850 border-b border-gray-700">
          <tr class="text-left text-gray-400 text-sm">
            <th class="p-4 w-12">
              <input type="checkbox" class="rounded bg-gray-700 border-gray-600">
            </th>
            <th class="p-4">Name</th>
            <th class="p-4">Container ID</th>
            <th class="p-4">Image</th>
            <th class="p-4">Port(s)</th>
            <th class="p-4">CPU (%)</th>
            <th class="p-4">Memory</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="container in filteredContainers" 
            :key="container.id"
            class="border-b border-gray-700 hover:bg-gray-750"
          >
            <td class="p-4">
              <input type="checkbox" class="rounded bg-gray-700 border-gray-600">
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button class="text-gray-400 hover:text-white">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <div :class="getStatusIndicator(container.status)"></div>
                <span class="text-white">{{ container.name }}</span>
              </div>
            </td>
            <td class="p-4 text-gray-400">{{ container.containerId || '-' }}</td>
            <td class="p-4 text-gray-400">{{ container.image || '-' }}</td>
            <td class="p-4 text-gray-400">{{ container.ports || '-' }}</td>
            <td class="p-4 text-gray-400">{{ container.cpu || 'N/A' }}</td>
            <td class="p-4 text-gray-400">{{ container.memory || '-' }}</td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button class="text-gray-400 hover:text-white p-1" title="View logs">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </button>
                <button 
                  class="text-blue-400 hover:text-blue-300 p-1" 
                  title="Start container"
                  @click="startContainer(container)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
                <button class="text-gray-400 hover:text-white p-1" title="More options">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
                <button 
                  class="text-red-400 hover:text-red-300 p-1" 
                  title="Delete container"
                  @click="deleteContainer(container)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const containers = ref([
  {
    id: 1,
    name: 'pi-hole',
    containerId: null,
    image: null,
    ports: null,
    cpu: null,
    memory: '13',
    status: 'stopped'
  },
  {
    id: 2, 
    name: 'nginx-proxy',
    containerId: 'abc123',
    image: 'nginx:latest',
    ports: '80:80, 443:443',
    cpu: '2.1%',
    memory: '45 MB',
    status: 'running'
  },
  {
    id: 3,
    name: 'mysql-db',
    containerId: 'def456',
    image: 'mysql:8.0',
    ports: '3306:3306',
    cpu: '1.5%',
    memory: '512 MB',
    status: 'running'
  }
])

const filteredContainers = computed(() => {
  if (!searchQuery.value) return containers.value
  return containers.value.filter(container => 
    container.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStatusIndicator = (status) => {
  const baseClasses = 'w-3 h-3 rounded-full border-2'
  if (status === 'running') {
    return `${baseClasses} bg-green-500 border-green-400`
  } else {
    return `${baseClasses} border-gray-500`
  }
}

const startContainer = (container) => {
  console.log('Starting container:', container.name)
  // Add start container logic here
}

const deleteContainer = (container) => {
  console.log('Deleting container:', container.name)
  // Add delete container logic here
}
</script>