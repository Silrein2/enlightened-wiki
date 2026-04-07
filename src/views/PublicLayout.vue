<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <PublicNavbar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view /> 
    </main>
  </div>
</template>

<script setup>
import PublicNavbar from '../components/PublicNavbar.vue';
</script>