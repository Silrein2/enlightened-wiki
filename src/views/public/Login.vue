<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the creation dashboard.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center font-medium">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                Have an invitation token? 
                <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 underline">
                Register as a Creator
                </router-link>
            </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust path if your firebase.js is elsewhere

const router = useRouter();

// Reactive state variables
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = ''; // Reset error message on new attempt

  try {
    // 1. Authenticate with Firebase
    await signInWithEmailAndPassword(auth, email.value, password.value);
    
    // 2. If successful, push the user to the admin dashboard
    router.push({ name: 'DashboardHome' });
    
  } catch (error) {
    // 3. Handle specific Firebase errors gracefully
    console.error("Login Error:", error.code);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage.value = 'Invalid email or password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many failed attempts. Please try again later.';
    } else {
      errorMessage.value = 'An error occurred during login.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>