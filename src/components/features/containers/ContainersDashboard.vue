<template>
  <div class="p-6">
    <!-- Header -->
    <ContainerHeader 
      :loading="containersStore.loading"
      @test-connection="containerActions.handleTestConnection"
      @refresh="containersStore.fetchContainers"
    />

    <!-- Loading State -->
    <LoadingSpinner 
      v-if="containersStore.loading && containersStore.containers.length === 0" 
      message="Loading containers..."
    />

    <!-- Error State -->
    <ErrorAlert
      v-else-if="containersStore.error"
      title="Error loading containers"
      :message="containersStore.error"
      :show-retry="true"
      :loading="containersStore.loading"
      @retry="containersStore.fetchContainers"
    />

    <!-- Main Content -->
    <template v-else>
      <!-- Stats Cards -->
      <ContainerStats :stats="containersStore.containerStats" class="mb-8" />

      <!-- Search and Filters -->
          <!-- Search -->
    <ContainerSearch 
      v-model="containersStore.searchQuery" 
      :filtered-count="containersStore.filteredContainers.length"
      :total-count="containersStore.containers.length"
      :status-filter="containersStore.statusFilter"
      :sort-by="containersStore.sortBy"
      :sort-order="containersStore.sortOrder"
      @update:status-filter="containersStore.setStatusFilter"
      @update:sort-by="containersStore.setSortBy"
      @toggle-sort-order="containersStore.toggleSortOrder"
      @clear-filters="containersStore.clearFilters"
    />

      <!-- Container Table -->
      <ContainerTable
        :containers="containersStore.filteredContainers"
        :loading="containersStore.loading"
        :action-loading="containerActions.actionLoading.value"
        :search-query="containersStore.searchQuery"
        :empty-message="containersStore.searchQuery ? 'No containers match your search.' : 'No containers found.'"
        @start-container="containerActions.handleStartContainer"
        @stop-container="containerActions.handleStopContainer"
        @remove-container="containerActions.handleRemoveContainer"
        @view-logs="containerActions.viewLogs"
        @inspect-container="containerActions.inspectContainer"
        @bulk-start="containerActions.handleBulkStart"
        @bulk-stop="containerActions.handleBulkStop"
        @bulk-remove="containerActions.handleBulkRemove"
      />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useContainersStore } from '@/stores/containers'
import { useContainerActions } from '@/composables/useContainerActions'
import { useDockerContainers } from '@/composables/docker'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ContainerHeader from '@/components/features/containers/ContainerHeader.vue'
import ContainerStats from '@/components/features/containers/ContainerStats.vue'
import ContainerSearch from '@/components/features/containers/ContainerSearch.vue'
import ContainerTable from '@/components/features/containers/ContainerTable.vue'

// Store (UI state management)
const containersStore = useContainersStore()

// Docker operations composable
const dockerContainers = useDockerContainers()

// Container actions composable (UI handlers)
const containerActions = useContainerActions(dockerContainers)

// Lifecycle
onMounted(() => {
  containersStore.fetchContainers()
})
</script>