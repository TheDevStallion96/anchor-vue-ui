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

export const DOCKER_API_BASE_URL = import.meta.env.VITE_DOCKER_API_BASE_URL || 'http://localhost:3000/api/v1'

export const APP_NAME = 'Anchor'