# Anchor Vue UI - AI Coding Instructions

## Project Overview
Anchor is a Docker Desktop management UI built with Vue.js 3, providing container, image, volume, and Kubernetes management through a Docker API backend running on `http://localhost:3000`.

## Architecture & Patterns

### Vue.js 3 Composition API
- **Always use `<script setup>` syntax** - this is the standard pattern across all components
- **Props validation required** - use `defineProps()` with validators like `variant: { validator: (value) => ['primary', 'secondary', 'danger'].includes(value) }`
- **Emit declarations** - use `defineEmits(['click', 'update:modelValue'])` for all component events

### Component Organization
```
src/components/
├── common/          # Reusable UI components (BaseButton, BaseCard, BaseInput)
├── features/        # Domain-specific components grouped by feature area
│   └── containers/  # ContainersDashboard, ContainerTable, ContainerSearch
├── layout/          # AppHeader, AppSidebar, AppLayout
└── icons/           # SVG icon components (IconContainers, IconImages)
```

### State Management (Pinia)
- **Store pattern**: Use `defineStore('storeName', () => {})` with Composition API
- **Naming**: Stores follow `use[Feature]Store` pattern (e.g., `useContainersStore`)
- **Structure**: State as `ref()`, getters as `computed()`, actions as functions
- **Example**: See `src/stores/containers.js` for advanced filtering/search patterns

### Docker API Integration
- **Use `useDockerApi` composable** - never call Docker API directly
- **Error handling pattern**: API calls wrapped in `handleApiCall()` with standardized error messages
- **Base URL**: Always use `DOCKER_API_BASE_URL` from constants
- **Response format**: API returns `{ success: boolean, data: any, error?: object }`

### Search & Filtering Patterns
Advanced search syntax supported:
- `id:abc123` - Search by container ID
- `image:nginx` - Search by image name  
- `status:running` - Search by status
- `port:8080` - Search by port mapping
- Implement in computed properties with `.toLowerCase()` matching

### Routing & Navigation
- **Route definitions**: Use lazy loading with `() => import('@/views/ViewName.vue')`
- **Meta titles**: Include `meta: { title: 'Page Name' }` for browser titles
- **Navigation**: Update `NAVIGATION_ITEMS` in `src/utils/constants.js` for sidebar

## Development Workflow

### Adding New Features
1. Create view in `src/views/[FeatureName]View.vue`
2. Add route in `src/router/routes.js` with lazy loading
3. Create feature components in `src/components/features/[feature]/`
4. Add Pinia store if state management needed
5. Update navigation in `src/utils/constants.js`

### Component Development
- **Base components**: Extend existing patterns from `src/components/common/`
- **Styling**: Use Tailwind classes, dark theme default (`bg-gray-900`, `text-gray-200`)
- **Icons**: Create SVG components in `src/components/icons/` following existing patterns
- **Props**: Always include proper validation and default values

### API Integration
```javascript
// In composables
const dockerApi = useDockerApi()
const result = await dockerApi.getAllContainers()

// Error handling is automatic via handleApiCall wrapper
// Loading states managed by composable
```

### Build & Development
- **Dev server**: `npm run dev` (Vite on port 5173)
- **Environment**: Configure API backend in `.env` file:
  - `VITE_DOCKER_API_HOST` - API host (default: localhost)
  - `VITE_DOCKER_API_PORT` - API port (default: 3000)
  - `VITE_DOCKER_API_BASE_URL` - Complete URL (auto-generated if not provided)
- **Dependencies**: Uses exact Node.js version requirements (`^20.19.0 || >=22.12.0`)

## Key Files to Reference
- `src/stores/containers.js` - Advanced filtering/search implementation
- `src/composables/useDockerApi.js` - API integration patterns
- `src/components/common/BaseButton.vue` - Component structure example
- `src/components/features/containers/ContainerSearch.vue` - Advanced search UI patterns
- `API.md` - Complete Docker API documentation
- `ARCHITECTURE.md` - Detailed technical architecture

## Critical Conventions
- **No direct API calls** - always use `useDockerApi` composable
- **Consistent error handling** - leverage built-in API error management
- **Dark theme first** - all components designed for dark UI
- **Advanced search** - support prefix-based search syntax in filter components
- **Responsive design** - use Tailwind responsive classes for mobile compatibility