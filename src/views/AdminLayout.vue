<template>
  <div v-if="userProfile" class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <AdminNavBar />
    <main class="p-4 sm:p-6 lg:p-8">
      <router-view />
    </main>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
     <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
</template>

<script setup>
import AdminNavBar from '../components/AdminNavBar.vue';
import { userProfile } from '../stores/userStore';
</script>