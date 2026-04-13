<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
    
    <div class="px-4 sm:px-6 lg:px-8 flex justify-end items-center h-10 space-x-4 text-sm bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      
      <button @click="toggleTheme" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2">
        <span v-if="isDark">☀️ Light Mode</span>
        <span v-else>🌙 Dark Mode</span>
      </button>

      <router-link 
        v-if="isLoggedIn" 
        to="/dashboard" 
        class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Dashboard
      </router-link>
      <router-link 
        v-else 
        to="/login" 
        class="font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
      >
        Admin Login
      </router-link>
    </div>

    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex-shrink-0 flex items-center">
            <img 
                src="/logo.PNG" 
                alt="Logo" 
                class="h-12 w-12 mr-4 object-contain drop-shadow-md"
            >
          <router-link to="/" class="text-2xl font-bold text-gray-900 dark:text-white">
            Enlightened <span class="text-indigo-600 dark:text-indigo-400">Wiki &nbsp &nbsp</span>
          </router-link>
        </div>

        <nav class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Home</router-link>
          <router-link to="/articles" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Articles</router-link>
          <router-link to="/artworks" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Artworks</router-link>
          <router-link to="/videos" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Videos</router-link>
          <router-link to="/feedback" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Feedback</router-link>
        </nav>

        <div class="flex-1 flex justify-end md:ml-6">
          <form @submit.prevent="handleSearch" class="w-full max-w-lg lg:max-w-xs relative">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="search" 
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" 
                placeholder="Search wiki..." 
                type="search"
              >
            </div>
          </form>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const searchQuery = ref('');
const isDark = ref(false);
const isLoggedIn = ref(false);

// --- SEARCH LOGIC ---
const handleSearch = () => {
  if (searchQuery.value.trim() !== '') {
    // Push the user to the new search page with their query in the URL
    router.push({ path: '/search', query: { q: searchQuery.value } });
    searchQuery.value = ''; // Clear the input field after searching
  }
};

// --- THEME LOGIC ---
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

// --- ON MOUNT ---
onMounted(() => {
  // 1. Sync Vue state with HTML class for dark mode
  isDark.value = document.documentElement.classList.contains('dark');

  // 2. Listen for Firebase Auth state changes
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user; // Converts object to boolean (true if user exists, false if null)
  });
});
</script>

<style scoped>
/* router-link-active automatically gets applied by Vue Router to the active link */
nav .router-link-exact-active {
  @apply text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400;
}
</style>