# Modular Vue.js Project - Best Practices

## Project Structure

```
my-vue-app/
├── public/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── tailwind.css
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   └── BaseInput.vue
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── AppLayout.vue
│   │   └── features/
│   │       ├── home/
│   │       │   ├── HeroSection.vue
│   │       │   └── FeatureList.vue
│   │       └── about/
│   │           └── TeamSection.vue
│   ├── composables/
│   │   ├── useToggle.js
│   │   └── useApi.js
│   ├── router/
│   │   ├── index.js
│   │   └── routes.js
│   ├── stores/
│   │   └── counter.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── App.vue
│   └── main.js
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Installation

```bash
npm create vue@latest my-vue-app
# Select: Vue Router, Pinia

cd my-vue-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration Files

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

### src/assets/styles/tailwind.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded transition duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

### src/main.js
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

## Core Components

### src/App.vue
```vue
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
```

### src/components/layout/AppLayout.vue
```vue
<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>
```

### src/components/layout/AppHeader.vue
```vue
<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="text-2xl font-bold text-primary-600">
            MyApp
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="text-gray-700 hover:text-primary-600 transition font-medium"
            active-class="text-primary-600"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          @click="closeMobileMenu"
          class="block py-2 text-gray-700 hover:text-primary-600 transition font-medium"
          active-class="text-primary-600"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { NAVIGATION_ITEMS } from '@/utils/constants'

const navigation = NAVIGATION_ITEMS
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
```

### src/components/layout/AppFooter.vue
```vue
<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">MyApp</h3>
          <p class="text-gray-400">Building amazing experiences with Vue.js</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="item in navigation" :key="item.name">
              <RouterLink :to="item.path" class="text-gray-400 hover:text-white transition">
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <p class="text-gray-400">info@myapp.com</p>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} MyApp. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { NAVIGATION_ITEMS } from '@/utils/constants'

const navigation = NAVIGATION_ITEMS
const currentYear = computed(() => new Date().getFullYear())
</script>
```

### src/components/common/BaseButton.vue
```vue
<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses = 'font-semibold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]}`
})

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
```

### src/components/common/BaseCard.vue
```vue
<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="border-b border-gray-200 pb-4 mb-4">
      <slot name="header" />
    </div>
    
    <div>
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="border-t border-gray-200 pt-4 mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
  }
})

const cardClasses = computed(() => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  return `bg-white rounded-lg shadow-md ${paddingClasses[props.padding]}`
})
</script>
```

### src/components/features/home/HeroSection.vue
```vue
<template>
  <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-5xl font-bold mb-6">Welcome to MyApp</h1>
      <p class="text-xl mb-8 text-primary-100">
        A modern Vue.js application with best practices
      </p>
      <div class="flex justify-center gap-4">
        <BaseButton @click="handleGetStarted">
          Get Started
        </BaseButton>
        <BaseButton variant="secondary" @click="handleLearnMore">
          Learn More
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const handleGetStarted = () => {
  console.log('Get started clicked')
}

const handleLearnMore = () => {
  router.push('/about')
}
</script>
```

### src/components/features/home/FeatureList.vue
```vue
<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BaseCard v-for="feature in features" :key="feature.id">
          <template #header>
            <h3 class="text-xl font-semibold text-gray-800">{{ feature.title }}</h3>
          </template>
          <p class="text-gray-600">{{ feature.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const features = ref([
  {
    id: 1,
    title: 'Vue Router',
    description: 'Seamless navigation with Vue Router for building single-page applications.'
  },
  {
    id: 2,
    title: 'Tailwind CSS',
    description: 'Beautiful, responsive designs with utility-first CSS framework.'
  },
  {
    id: 3,
    title: 'Modular Architecture',
    description: 'Clean, maintainable code following Vue.js best practices.'
  }
])
</script>
```

## Composables

### src/composables/useToggle.js
```javascript
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const state = ref(initialValue)
  
  const toggle = () => {
    state.value = !state.value
  }
  
  const setTrue = () => {
    state.value = true
  }
  
  const setFalse = () => {
    state.value = false
  }
  
  return {
    state,
    toggle,
    setTrue,
    setFalse
  }
}
```

### src/composables/useApi.js
```javascript
import { ref } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  
  const execute = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      data.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    data,
    execute
  }
}
```

## Stores (Pinia)

### src/stores/counter.js
```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = 0
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
})
```

## Utils

### src/utils/constants.js
```javascript
export const NAVIGATION_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' }
]

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const APP_NAME = 'MyApp'
```

### src/utils/helpers.js
```javascript
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

## Router

### src/router/routes.js
```javascript
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Home'
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
```

### src/router/index.js
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

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
  document.title = to.meta.title ? `${to.meta.title} - MyApp` : 'MyApp'
  next()
})

export default router
```

## Views

### src/views/HomeView.vue
```vue
<template>
  <AppLayout>
    <HeroSection />
    <FeatureList />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import HeroSection from '@/components/features/home/HeroSection.vue'
import FeatureList from '@/components/features/home/FeatureList.vue'
</script>
```

### src/views/AboutView.vue
```vue
<template>
  <AppLayout>
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BaseCard padding="lg">
          <template #header>
            <h1 class="text-4xl font-bold text-gray-800">About Us</h1>
          </template>
          
          <div class="prose max-w-none">
            <p class="text-gray-600 mb-4">
              This is a modular Vue.js application following best practices.
            </p>
            <p class="text-gray-600 mb-6">
              The counter value is: <strong>{{ count }}</strong>
            </p>
            <div class="flex gap-2">
              <BaseButton @click="increment">Increment</BaseButton>
              <BaseButton variant="secondary" @click="decrement">Decrement</BaseButton>
              <BaseButton variant="danger" @click="reset">Reset</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment, decrement, reset } = counterStore
</script>
```

### src/views/NotFoundView.vue
```vue
<template>
  <AppLayout>
    <div class="flex items-center justify-center min-h-[60vh]">
      <BaseCard padding="lg" class="text-center max-w-md">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-6">Page not found</p>
        <BaseButton @click="goHome">Go Home</BaseButton>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
```

## Additional Configuration

### vite.config.js
```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## Run the Project

```bash
npm run dev
```

## Best Practices Implemented

1. **Component Organization**: Separated into common, layout, and feature components
2. **Composables**: Reusable logic with Vue Composition API
3. **Store Management**: Pinia for global state
4. **Route Configuration**: Separated routes from router setup
5. **Utility Functions**: Centralized helpers and constants
6. **Props Validation**: Type checking and validation
7. **Scoped Slots**: Flexible component composition
8. **Lazy Loading**: Route-based code splitting
9. **Navigation Guards**: Page title management
10. **Tailwind Components**: Reusable CSS classes