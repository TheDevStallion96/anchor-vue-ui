<template>
  <thead class="bg-gray-850 border-b border-gray-700">
    <tr class="text-left text-gray-400 text-sm">
      <th class="p-4 w-12">
        <input 
          type="checkbox" 
          class="rounded bg-gray-700 border-gray-600"
          :checked="allSelected"
          :indeterminate="someSelected"
          @change="$emit('toggle-select-all')"
        >
      </th>
      <th class="p-4">Name</th>
      <th class="p-4">Container ID</th>
      <th class="p-4">Image</th>
      <th class="p-4">Status</th>
      <th class="p-4">Port(s)</th>
      <th class="p-4">Created</th>
      <th class="p-4">Actions</th>
    </tr>
  </thead>
</template>

<script setup>
defineProps({
  allSelected: {
    type: Boolean,
    required: true
  },
  someSelected: {
    type: Boolean,
    required: true
  }
})

defineEmits([
  'toggle-select-all'
])
</script>