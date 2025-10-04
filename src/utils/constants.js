export const NAVIGATION_ITEMS = [
  { 
    name: 'Containers', 
    path: '/', 
    icon: 'containers',
    active: true 
  },
  { 
    name: 'Images', 
    path: '/images', 
    icon: 'images' 
  },
  { 
    name: 'Volumes', 
    path: '/volumes', 
    icon: 'volumes' 
  },
  { 
    name: 'Kubernetes', 
    path: '/kubernetes', 
    icon: 'kubernetes' 
  },
  { 
    name: 'Builds', 
    path: '/builds', 
    icon: 'builds' 
  }
]

// Docker API Configuration
const API_HOST = import.meta.env.VITE_DOCKER_API_HOST || 'localhost'
const API_PORT = import.meta.env.VITE_DOCKER_API_PORT || '3000'
const DEFAULT_API_URL = `http://${API_HOST}:${API_PORT}/api/v1`

export const DOCKER_API_BASE_URL = import.meta.env.VITE_DOCKER_API_BASE_URL || DEFAULT_API_URL

export const APP_NAME = 'Anchor'