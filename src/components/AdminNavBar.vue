<template>
  <nav class="bg-indigo-800 text-white shadow-md relative z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <div class="flex items-center">
          <span class="font-bold text-xl tracking-wider mr-8">Enlightened Admin</span>
          
          <div class="hidden md:flex items-baseline space-x-2">
            <router-link to="/dashboard" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" exact-active-class="bg-indigo-900">Dashboard</router-link>
            <router-link to="/dashboard/create" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-indigo-900">Create Content</router-link>
            <router-link to="/dashboard/profile" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-indigo-900">Profile</router-link>
            <router-link v-if="isAdmin" to="/dashboard/settings" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-indigo-900">Guild Settings</router-link>
            <router-link v-if="isAdmin" to="/dashboard/approval" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-indigo-900">Approval List</router-link>
            <router-link v-if="isAdmin" to="/dashboard/usermanagement" class="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-indigo-900">User Management</router-link>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-indigo-200 hover:text-white text-sm font-medium transition-colors">&larr; Back to Wiki</router-link>
          <button @click="handleLogout" class="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 px-4 py-2 rounded text-sm font-bold transition-colors shadow-sm">Logout</button>
        </div>

        <div class="md:hidden flex items-center">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2 rounded-md transition-colors">
            <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

      </div>
    </div>

    <div v-show="isMobileMenuOpen" class="md:hidden bg-indigo-900 absolute w-full shadow-xl border-t border-indigo-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link @click="isMobileMenuOpen = false" to="/dashboard" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" exact-active-class="bg-indigo-800 text-white">Dashboard</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/dashboard/create" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" active-class="bg-indigo-800 text-white">Create Content</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/dashboard/profile" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" active-class="bg-indigo-800 text-white">Profile</router-link>
        <router-link v-if="isAdmin" @click="isMobileMenuOpen = false" to="/dashboard/settings" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" active-class="bg-indigo-800 text-white">Guild Settings</router-link>
        <router-link v-if="isAdmin" @click="isMobileMenuOpen = false" to="/dashboard/approval" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" active-class="bg-indigo-800 text-white">Approval List</router-link>
        <router-link v-if="isAdmin" @click="isMobileMenuOpen = false" to="/dashboard/usermanagement" class="block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-colors" active-class="bg-indigo-800 text-white">User Management</router-link>
        
        <div class="border-t border-indigo-700 pt-4 pb-2 mt-4">
          <router-link @click="isMobileMenuOpen = false" to="/" class="block px-3 py-2 rounded-md text-base font-medium text-indigo-300 hover:text-white hover:bg-indigo-700">&larr; Back to Wiki</router-link>
          <button @click="handleLogout" class="w-full text-left mt-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-bold text-white transition-colors">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'; // 🌟 Added ref
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { userProfile, clearUserProfile } from '../stores/userStore';

const router = useRouter();

// 🌟 Mobile Menu State
const isMobileMenuOpen = ref(false);

const isAdmin = computed(() => userProfile.value?.role === 'admin');

const handleLogout = async () => {
  isMobileMenuOpen.value = false; // Close menu on logout
  await signOut(auth);
  clearUserProfile(); 
  router.push('/');
};
</script>