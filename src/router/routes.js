export const routes = [
  {
    path: '/',
    name: 'containers',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Containers'
    }
  },
  {
    path: '/images',
    name: 'images',
    component: () => import('@/views/ImagesView.vue'),
    meta: {
      title: 'Images'
    }
  },
  {
    path: '/volumes',
    name: 'volumes',
    component: () => import('@/views/VolumesView.vue'),
    meta: {
      title: 'Volumes'
    }
  },
  {
    path: '/kubernetes',
    name: 'kubernetes',
    component: () => import('@/views/KubernetesView.vue'),
    meta: {
      title: 'Kubernetes'
    }
  },
  {
    path: '/builds',
    name: 'builds',
    component: () => import('@/views/BuildsView.vue'),
    meta: {
      title: 'Builds'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
]