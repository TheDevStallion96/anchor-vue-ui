import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { APP_NAME } from '@/utils/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard for page titles
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - ${APP_NAME}` : APP_NAME
  next()
})

export default router
