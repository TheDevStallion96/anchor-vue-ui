# Architecture Documentation

This document provides a comprehensive overview of the Anchor Vue UI architecture, design patterns, and technical decisions.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [State Management](#state-management)
- [Routing](#routing)
- [Component Architecture](#component-architecture)
- [API Integration](#api-integration)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Considerations](#performance-considerations)

## Overview

Anchor Vue UI is a single-page application (SPA) built with Vue.js 3 that provides a modern interface for Docker container management. The application follows a component-based architecture with clear separation of concerns.

### Key Principles

1. **Component-Based Architecture**: Modular, reusable components
2. **Composition API**: Modern Vue 3 patterns for logic reuse
3. **Reactive State Management**: Centralized state with Pinia
4. **Type Safety**: Props validation and type checking
5. **Clean Code**: Following Vue.js best practices and style guide

## Technology Stack

### Core Dependencies

- **Vue.js 3.5.22**: Progressive JavaScript framework
- **Vue Router 4.5.1**: Official routing library
- **Pinia 3.0.3**: State management library
- **Vite 7.1.7**: Build tool and development server
- **Tailwind CSS 4.1.14**: Utility-first CSS framework

### Development Tools

- **@vitejs/plugin-vue**: Vite plugin for Vue SFC support
- **PostCSS & Autoprefixer**: CSS processing
- **Vue DevTools**: Browser extension for debugging

## Application Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│           Browser (Client)              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      Vue.js Application           │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │    Views (Pages)             │ │ │
│  │  │  ┌────────────────────────┐  │ │ │
│  │  │  │   Components           │  │ │ │
│  │  │  │  - Layout              │  │ │ │
│  │  │  │  - Features            │  │ │ │
│  │  │  │  - Common              │  │ │ │
│  │  │  └────────────────────────┘  │ │ │
│  │  └──────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │    State (Pinia Stores)      │ │ │
│  │  └──────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │    Composables               │ │ │
│  │  │  - useDockerApi              │ │ │
│  │  │  - useErrorHandling          │ │ │
│  │  └──────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                   │
                   │ HTTP/REST API
                   ▼
┌─────────────────────────────────────────┐
│        Docker API Backend               │
│     (http://localhost:3000/api/v1)      │
│                                         │
│  - Container Management                 │
│  - Image Management                     │
│  - Volume Management                    │
│  - System Information                   │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           Docker Engine                 │
└─────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── main.js                 # Application entry point
├── App.vue                 # Root component
│
├── views/                  # Page-level components
│   ├── HomeView.vue       # Containers dashboard
│   ├── ImagesView.vue     # Images management
│   ├── VolumesView.vue    # Volumes management
│   └── ...
│
├── components/             # Reusable components
│   ├── common/            # Generic UI components
│   ├── layout/            # Application layout
│   ├── features/          # Feature-specific components
│   └── icons/             # SVG icon components
│
├── composables/           # Composition functions
│   ├── useDockerApi.js   # Docker API integration
│   ├── useApi.js         # Generic API wrapper
│   └── useToggle.js      # State toggle utility
│
├── stores/                # Pinia state stores
│   ├── containers.js     # Container state management
│   └── counter.js        # Example store
│
├── router/                # Routing configuration
│   ├── index.js          # Router instance
│   └── routes.js         # Route definitions
│
├── utils/                 # Utility functions
│   ├── constants.js      # Application constants
│   ├── helpers.js        # Helper functions
│   └── containerUtils.js # Container-specific utilities
│
└── assets/                # Static assets
    └── styles/
        └── tailwind.css  # Tailwind configuration
```

## State Management

### Pinia Store Architecture

Anchor uses Pinia for centralized state management. Each store follows the Composition API pattern.

#### Containers Store

```javascript
// stores/containers.js
export const useContainersStore = defineStore('containers', () => {
  // State
  const containers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const statusFilter = ref('all')
  
  // Getters (computed)
  const filteredContainers = computed(() => {
    // Filter and search logic
  })
  
  const runningCount = computed(() => 
    containers.value.filter(c => c.status === 'running').length
  )
  
  // Actions
  async function fetchContainers() {
    loading.value = true
    try {
      const data = await dockerApi.getContainers()
      containers.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    containers,
    loading,
    error,
    searchQuery,
    statusFilter,
    // Getters
    filteredContainers,
    runningCount,
    // Actions
    fetchContainers
  }
})
```

### Store Usage in Components

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useContainersStore } from '@/stores/containers'

const store = useContainersStore()
const { containers, loading } = storeToRefs(store)
const { fetchContainers } = store

// Fetch on mount
onMounted(() => {
  fetchContainers()
})
</script>
```

## Routing

### Route Structure

```javascript
// router/routes.js
export const routes = [
  {
    path: '/',
    name: 'containers',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Containers' }
  },
  {
    path: '/images',
    name: 'images',
    component: () => import('@/views/ImagesView.vue'),
    meta: { title: 'Images' }
  },
  // ... more routes
]
```

### Navigation Guards

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title 
    ? `${to.meta.title} - Anchor` 
    : 'Anchor'
  next()
})
```

### Lazy Loading

All views are lazy-loaded using dynamic imports to reduce initial bundle size:

```javascript
component: () => import('@/views/HomeView.vue')
```

## Component Architecture

### Component Hierarchy

```
App.vue
└── RouterView
    └── AppLayout
        ├── AppHeader
        │   └── Navigation
        ├── AppSidebar
        │   └── Navigation Icons
        └── Main Content (slot)
            └── View Component
                └── Feature Components
                    └── Common Components
```

### Component Types

#### 1. Layout Components (`components/layout/`)

Provide structure for the application:

```vue
<!-- AppLayout.vue -->
<template>
  <div class="flex h-screen">
    <AppSidebar />
    <div class="flex-1 flex flex-col">
      <AppHeader />
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
```

#### 2. Common Components (`components/common/`)

Reusable UI elements:

- `BaseButton.vue` - Configurable button component
- `BaseCard.vue` - Card container with slots
- `LoadingSpinner.vue` - Loading indicator
- `ErrorAlert.vue` - Error message display

#### 3. Feature Components (`components/features/`)

Domain-specific components:

```
features/
└── containers/
    ├── ContainersDashboard.vue    # Main container view
    ├── ContainerTable.vue         # Container list table
    ├── ContainerRow.vue           # Single container row
    ├── ContainerSearch.vue        # Search component
    └── ContainerStats.vue         # Stats display
```

#### 4. Icon Components (`components/icons/`)

SVG icon components for consistent styling

## API Integration

### Docker API Composable

The `useDockerApi` composable provides a clean interface for Docker operations:

```javascript
// composables/useDockerApi.js
export function useDockerApi() {
  const API_BASE_URL = DOCKER_API_BASE_URL
  
  // Helper for API calls
  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error?.message)
    }
    return result.data
  }
  
  // Container operations
  const getContainers = async () => {
    const response = await fetch(`${API_BASE_URL}/containers/all`)
    return handleResponse(response)
  }
  
  const startContainer = async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/containers/${id}/start`,
      { method: 'POST' }
    )
    return handleResponse(response)
  }
  
  return {
    getContainers,
    startContainer,
    // ... more operations
  }
}
```

### Error Handling

```javascript
// composables/useErrorHandling.js
export function useErrorHandling() {
  const handleError = (error) => {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Cannot connect to Docker API'
    }
    return error.message
  }
  
  return { handleError }
}
```

## Data Flow

### Typical Data Flow Pattern

1. **User Action** → Component emits event
2. **Component** → Calls store action
3. **Store Action** → Uses composable to call API
4. **Composable** → Makes HTTP request
5. **API Response** → Returns data
6. **Store** → Updates reactive state
7. **Component** → Automatically re-renders

### Example Flow: Starting a Container

```
User clicks "Start" button
    ↓
ContainerRow.vue emits 'start' event
    ↓
ContainerTable.vue calls store.startContainer(id)
    ↓
Store action calls dockerApi.startContainer(id)
    ↓
API request: POST /containers/:id/start
    ↓
API returns success response
    ↓
Store updates container status
    ↓
Component re-renders with updated status
```

## Design Patterns

### 1. Composition API Pattern

```javascript
// Reusable composition function
export function useContainerActions() {
  const store = useContainersStore()
  
  const startContainer = async (id) => {
    await store.startContainer(id)
    await store.fetchContainers()
  }
  
  return { startContainer }
}
```

### 2. Provider/Consumer Pattern

```vue
<!-- Provider -->
<script setup>
import { provide } from 'vue'
const theme = ref('dark')
provide('theme', theme)
</script>

<!-- Consumer -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme')
</script>
```

### 3. Renderless Components

Components that provide logic without UI:

```vue
<script setup>
const props = defineProps(['containers'])
const emit = defineEmits(['filtered'])

const filtered = computed(() => {
  // Filter logic
})

watch(filtered, (value) => {
  emit('filtered', value)
})
</script>

<template>
  <slot :filtered="filtered" />
</template>
```

### 4. Slots for Composition

```vue
<BaseCard>
  <template #header>
    <h2>Container Details</h2>
  </template>
  
  <div>Content here</div>
  
  <template #footer>
    <button>Action</button>
  </template>
</BaseCard>
```

## Performance Considerations

### 1. Code Splitting

- Route-based code splitting with lazy loading
- Dynamic imports for views

### 2. Computed Properties

- Use computed for derived state
- Automatic caching and dependency tracking

### 3. Virtual Scrolling (Future)

For large container lists, consider implementing virtual scrolling

### 4. Debouncing

```javascript
import { debounce } from '@/utils/helpers'

const handleSearch = debounce((query) => {
  store.searchQuery = query
}, 300)
```

### 5. Memoization

Use computed properties for expensive calculations

## Build Configuration

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
```

### Build Output

- Optimized JavaScript bundles
- CSS extraction and minification
- Asset optimization
- Tree-shaking for unused code

## Security Considerations

1. **API Communication**: All API calls should validate responses
2. **Input Sanitization**: User inputs are validated before processing
3. **CORS**: Backend must allow cross-origin requests
4. **Error Messages**: Don't expose sensitive information in error messages

## Future Enhancements

- **TypeScript**: Add TypeScript for better type safety
- **Unit Tests**: Add Vitest for component testing
- **E2E Tests**: Add Playwright/Cypress for end-to-end testing
- **WebSocket Support**: Real-time updates via WebSockets
- **Dark/Light Theme**: Theme toggle support
- **Internationalization**: Multi-language support

## References

- [Vue.js Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
