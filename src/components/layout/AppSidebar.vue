<template>
  <aside class="w-64 bg-gray-950 p-4 overflow-y-auto">
    <nav class="space-y-1">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded transition-colors"
        :class="getNavItemClasses(item)"
      >
        <IconContainers v-if="item.icon === 'containers'" />
        <IconImages v-else-if="item.icon === 'images'" />
        <IconVolumes v-else-if="item.icon === 'volumes'" />
        <IconKubernetes v-else-if="item.icon === 'kubernetes'" />
        <IconBuilds v-else-if="item.icon === 'builds'" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { NAVIGATION_ITEMS } from '@/utils/constants'
import IconContainers from '@/components/icons/IconContainers.vue'
import IconImages from '@/components/icons/IconImages.vue'
import IconVolumes from '@/components/icons/IconVolumes.vue'
import IconKubernetes from '@/components/icons/IconKubernetes.vue'
import IconBuilds from '@/components/icons/IconBuilds.vue'

const route = useRoute()
const navigation = NAVIGATION_ITEMS

const getNavItemClasses = (item) => {
  const isActive = route.path === item.path
  return isActive 
    ? 'bg-gray-800 text-white' 
    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
}
</script>