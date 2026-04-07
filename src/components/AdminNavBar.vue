<template>
  <nav class="bg-indigo-800 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center">
          <span class="font-bold text-xl tracking-wider mr-8">Enlightened Admin</span>
          
          <div class="hidden md:flex items-baseline space-x-2">
            <router-link 
              to="/dashboard" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              exact-active-class="bg-indigo-900"
            >
              Dashboard
            </router-link>
            
            <router-link 
              to="/dashboard/create" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-indigo-900"
            >
              Create Content
            </router-link>

            <router-link 
              to="/dashboard/profile" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-indigo-900"
            >
              Profile
            </router-link>
            
            <router-link 
              v-if="isAdmin" 
              to="/dashboard/settings" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-indigo-900"
            >
              Guild Settings
            </router-link>
            <router-link 
              v-if="isAdmin" 
              to="/dashboard/approval" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-indigo-900"
            >
              Approval List
            </router-link>
            <router-link 
              v-if="isAdmin" 
              to="/dashboard/usermanagement" 
              class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="bg-indigo-900"
            >
              User Management
            </router-link>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <router-link to="/" class="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
            &larr; Back to Wiki
          </router-link>
          
          <button 
            @click="handleLogout" 
            class="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 px-4 py-2 rounded text-sm font-bold transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { userProfile, clearUserProfile } from '../stores/userStore'; // Import the store

const router = useRouter();

// Use a computed property to react to the store's data
const isAdmin = computed(() => userProfile.value?.role === 'admin');

const handleLogout = async () => {
  await signOut(auth);
  clearUserProfile(); // Clear the store on logout
  router.push('/');
};
</script>