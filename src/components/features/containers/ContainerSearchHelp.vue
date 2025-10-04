<template>
  <div class="bg-gray-900/50 rounded p-3">
    <h4 class="text-sm font-medium text-gray-300 mb-2">Search Syntax Tips:</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
      <div><code class="bg-gray-800 px-1 rounded">id:abc123</code> - Search by container ID</div>
      <div><code class="bg-gray-800 px-1 rounded">image:nginx</code> - Search by image name</div>
      <div><code class="bg-gray-800 px-1 rounded">status:running</code> - Search by status</div>
      <div><code class="bg-gray-800 px-1 rounded">port:8080</code> - Search by port number</div>
    </div>
  </div>
</template>

<script setup>
// No props or emits needed - this is a static help component
</script>