<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 relative z-50">
    
    <div class="px-4 sm:px-6 lg:px-8 flex justify-end items-center h-10 space-x-4 text-sm bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <button @click="toggleTheme" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2">
        <span v-if="isDark">☀️ Light Mode</span>
        <span v-else>🌙 Dark Mode</span>
      </button>
      <router-link v-if="isLoggedIn" to="/dashboard" class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Dashboard</router-link>
      <router-link v-else to="/login" class="font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">Admin Login</router-link>
    </div>

    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex-shrink-0 flex items-center">
            <img src="/logo.PNG" alt="Logo" class="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 object-contain drop-shadow-md">
          <router-link to="/" class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
            Enlightened <span class="text-indigo-600 dark:text-indigo-400">Wiki</span>
          </router-link>
        </div>

        <nav class="hidden md:flex space-x-6 lg:space-x-8 ml-8">
          <router-link to="/" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Home</router-link>
          <router-link to="/articles" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Articles</router-link>
          <router-link to="/artworks" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Artworks</router-link>
          <router-link to="/videos" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Videos</router-link>
          <router-link to="/feedback" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors">Feedback</router-link>
        </nav>

        <div class="flex-1 flex justify-end items-center md:ml-6 gap-2 sm:gap-4">
          <form @submit.prevent="handleSearch" class="w-full max-w-[150px] sm:max-w-xs relative hidden sm:block">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
              </div>
              <input id="search" v-model="searchQuery" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Search..." type="search">
            </div>
          </form>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none transition-colors">
            <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

      </div>
    </div>

    <div v-show="isMobileMenuOpen" class="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl">
      
      <div class="px-4 pt-4 pb-2 sm:hidden border-b border-gray-100 dark:border-gray-800">
        <form @submit.prevent="handleSearch" class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
          </div>
          <input v-model="searchQuery" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Search wiki..." type="search">
        </form>
      </div>

      <div class="px-2 pt-2 pb-4 space-y-1">
        <router-link @click="isMobileMenuOpen = false" to="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">Home</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/articles" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">Articles</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/artworks" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">Artworks</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/videos" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">Videos</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/feedback" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">Feedback</router-link>
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

// 🌟 Mobile Menu State
const isMobileMenuOpen = ref(false);

// --- SEARCH LOGIC ---
const handleSearch = () => {
  if (searchQuery.value.trim() !== '') {
    isMobileMenuOpen.value = false; // Close menu on search
    router.push({ path: '/search', query: { q: searchQuery.value } });
    searchQuery.value = ''; 
  }
};

// ... theme logic and onMounted remain exactly the same ...
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

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user; 
  });
});
</script>

<style scoped>
/* Mobile active link styles */
.md\:hidden .router-link-exact-active {
  @apply bg-indigo-50 text-indigo-700 dark:bg-gray-800 dark:text-indigo-400 font-bold border-l-4 border-indigo-600 dark:border-indigo-400 border-b-0 pl-2;
}

nav .router-link-exact-active {
  @apply text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400;
}
</style>